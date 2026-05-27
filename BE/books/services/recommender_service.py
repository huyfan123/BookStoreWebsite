import os
import pickle
import ast
import string
import numpy as np
import pandas as pd
import nltk
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import NearestNeighbors
from scipy.sparse import csr_matrix
from scipy.sparse.linalg import svds
from django.db.models import Count, Sum, Case, When, IntegerField, Q
from books.models import Book, UserInteraction
import random

class RecommenderService:
    def __init__(self):
        self.model_path = os.path.join(os.path.dirname(__file__), '..', 'ml_models', 'recommendation_data.pkl')
        self.cf_model_path = os.path.join(os.path.dirname(__file__), '..', 'ml_models', 'cf_model.pkl')
        
        self.similarity_dict = self._load_model(self.model_path)
        self.cf_data = self._load_model(self.cf_model_path)
        
    def _load_model(self, path):
        if os.path.exists(path):
            with open(path, 'rb') as f:
                return pickle.load(f)
        return None

    def _preprocess_list_field(self, x):
        if isinstance(x, str):
            try:
                parsed = ast.literal_eval(x)
                if isinstance(parsed, list):
                    return [str(item).strip().lower() for item in parsed]
            except (ValueError, SyntaxError):
                return [x.strip().lower()]
        elif isinstance(x, list):
            return [str(item).strip().lower() for item in x]
        return []

    def _clean_text(self, text):
        if not isinstance(text, str):
            return ""
        text = text.lower()
        text = text.translate(str.maketrans('', '', string.punctuation))
        
        try:
            stop_words = set(stopwords.words('english'))
        except LookupError:
            nltk.download('stopwords', quiet=True)
            stop_words = set(stopwords.words('english'))
            
        words = text.split()
        cleaned = [w for w in words if w not in stop_words]
        return " ".join(cleaned)

    def _create_soup(self, row):
        author = str(row.get('author', '')).lower().replace(' ', '')
        genres = " ".join([g.replace(' ', '') for g in self._preprocess_list_field(row.get('genres'))])
        series = str(row.get('series', '')).lower().replace(' ', '')
        characters = " ".join([c.replace(' ', '') for c in self._preprocess_list_field(row.get('characters'))])
        description = self._clean_text(row.get('description', ''))
        return f"{author} {genres} {series} {characters} {description}"

    def train(self, df):
        """Train the Content-Based recommendation model."""
        if df.empty:
            return

        df['soup'] = df.apply(self._create_soup, axis=1)

        tfidf = TfidfVectorizer(stop_words='english')
        tfidf_matrix = tfidf.fit_transform(df['soup'])

        n_neighbors = min(51, tfidf_matrix.shape[0])
        nbrs = NearestNeighbors(n_neighbors=n_neighbors, metric='cosine', algorithm='brute').fit(tfidf_matrix)
        distances, indices = nbrs.kneighbors(tfidf_matrix)

        similarity_dict = {}
        book_ids = df['bookId'].tolist()
        
        for idx, book_id in enumerate(book_ids):
            neighbor_indices = indices[idx]
            top_50 = [book_ids[i] for i in neighbor_indices if i != idx][:50]
            similarity_dict[book_id] = top_50

        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        with open(self.model_path, 'wb') as f:
            pickle.dump(similarity_dict, f)

        self.similarity_dict = similarity_dict

    def train_cf(self, interactions_df):
        if interactions_df.empty:
            return
            
        weights = {'view': 1.0, 'add_to_cart': 3.0, 'purchase': 5.0, 'rating': 0.0}
        
        def calc_score(row):
            if row['interaction_type'] == 'rating' and pd.notnull(row['rating_score']):
                return float(row['rating_score'])
            return weights.get(row['interaction_type'], 1.0)
            
        interactions_df['score'] = interactions_df.apply(calc_score, axis=1)
        
        # Aggregate scores (mean) for duplicate user-item pairs
        user_item_scores = interactions_df.groupby(['user_id', 'book_id'])['score'].mean().reset_index()
        
        users = user_item_scores['user_id'].unique()
        books = user_item_scores['book_id'].unique()
        
        user_to_idx = {user: idx for idx, user in enumerate(users)}
        idx_to_book = {idx: book for idx, book in enumerate(books)}
        book_to_idx = {book: idx for idx, book in enumerate(books)}
        
        row_idx = user_item_scores['user_id'].map(user_to_idx).values
        col_idx = user_item_scores['book_id'].map(book_to_idx).values
        data = user_item_scores['score'].values
        
        from scipy.sparse import csr_matrix
        from scipy.sparse.linalg import svds
        import numpy as np

        matrix_size = (len(users), len(books))
        sparse_matrix = csr_matrix((data, (row_idx, col_idx)), shape=matrix_size)
        
        # Convert to float to avoid dtype errors
        sparse_matrix = sparse_matrix.asfptype()
        
        k = min(50, min(sparse_matrix.shape) - 1)
        if k < 1:
            return # Matrix too small
            
        u, s, vt = svds(sparse_matrix, k=k)
        
        cf_data = {
            'u': u,
            's': s,
            'vt': vt,
            'user_to_idx': user_to_idx,
            'idx_to_book': idx_to_book
        }
        
        os.makedirs(os.path.dirname(self.cf_model_path), exist_ok=True)
        with open(self.cf_model_path, 'wb') as f:
            pickle.dump(cf_data, f)
            
        self.cf_data = cf_data

    def get_cf_recommendations(self, user_id):
        """Returns predicted scores for all books for a specific user"""
        if not self.cf_data or user_id not in self.cf_data['user_to_idx']:
            return {}
            
        import numpy as np
        user_idx = self.cf_data['user_to_idx'][user_id]
        u = self.cf_data['u']
        s = self.cf_data['s']
        vt = self.cf_data['vt']
        idx_to_book = self.cf_data['idx_to_book']
        
        user_row = u[user_idx, :]
        predicted_scores = np.dot(user_row * s, vt)
        
        book_scores = {idx_to_book[i]: float(score) for i, score in enumerate(predicted_scores)}
        return book_scores

    def get_content_based_recommendations(self, book_id, limit=5):
        if not self.similarity_dict:
            return self.get_cold_start_recommendations(limit)

        similar_ids = self.similarity_dict.get(book_id, [])
        if not similar_ids:
            return self.get_cold_start_recommendations(limit)

        top_ids = similar_ids[:limit]
        books = list(Book.objects.filter(bookId__in=top_ids))
        books.sort(key=lambda x: top_ids.index(x.bookId))
        return books

    def get_hybrid_recommendations(self, user_id=None, book_id=None, limit=5):
        """
        Combines Collaborative Filtering and Content-based Recommendations.
        Weights: 0.4 * Content + 0.6 * Collaborative
        """
        cf_scores = {}
        if user_id:
            cf_scores = self.get_cf_recommendations(user_id)
            
        cb_books = []
        if book_id and self.similarity_dict:
            similar_ids = self.similarity_dict.get(book_id, [])
            cb_books = similar_ids[:50]
                
        if not cf_scores and not cb_books:
            return self.get_cold_start_recommendations(limit)
            
        if not cf_scores and cb_books:
            return self.get_content_based_recommendations(book_id, limit)
            
        # Candidates pool
        sorted_cf = sorted(cf_scores.items(), key=lambda x: x[1], reverse=True)
        top_cf_books = [b for b, s in sorted_cf[:100]]
        
        candidates = set(top_cf_books)
        if cb_books:
            candidates.update(cb_books)
            
        max_cf = max(cf_scores.values()) if cf_scores else 1.0
        if max_cf == 0: max_cf = 1.0
        
        final_scores = []
        for b_id in candidates:
            # CB Score
            cb_score = 0.0
            if b_id in cb_books:
                rank = cb_books.index(b_id)
                cb_score = 1.0 - (rank / len(cb_books))
                
            # CF Score
            c_score = cf_scores.get(b_id, 0.0) / max_cf
            
            # Hybrid calculation
            score = 0.4 * cb_score + 0.6 * c_score
            final_scores.append((b_id, score))
            
        final_scores.sort(key=lambda x: x[1], reverse=True)
        top_limit_ids = [x[0] for x in final_scores[:limit]]
        
        books = list(Book.objects.filter(bookId__in=top_limit_ids))
        books.sort(key=lambda x: top_limit_ids.index(x.bookId))
        
        return books

    def _apply_genre_capping_and_dedup(self, candidates, exclude_ids, limit=10):
        filtered_books = []
        consecutive_genre_count = 0
        last_genre = None

        for book in candidates:
            if len(filtered_books) >= limit:
                break
            
            if book.bookId in exclude_ids:
                continue
                
            main_genre = "Unknown"
            if book.genres:
                genres_list = self._preprocess_list_field(book.genres)
                if genres_list:
                    main_genre = genres_list[0]
            
            if main_genre == last_genre:
                consecutive_genre_count += 1
            else:
                consecutive_genre_count = 1
                last_genre = main_genre
                
            if consecutive_genre_count > 3:
                continue
                
            filtered_books.append(book)
            exclude_ids.add(book.bookId)
            
        return filtered_books

    def get_homepage_recommendations(self, user_id=None, limit=10):
        exclude_ids = set()
        purchased_ids = set()
        
        if user_id:
            purchased_ids = set(UserInteraction.objects.filter(
                user_id=user_id, interaction_type='purchase'
            ).values_list('book_id', flat=True))
            exclude_ids.update(purchased_ids)
            
        # 1. Personalized
        personalized = []
        if user_id:
            raw_personalized = self.get_hybrid_recommendations(user_id=user_id, limit=limit*3)
            personalized = self._apply_genre_capping_and_dedup(raw_personalized, exclude_ids, limit)
            
        if len(personalized) < limit:
            cold_start_candidates = self.get_cold_start_recommendations(limit=limit*3)
            random.shuffle(cold_start_candidates)
            needed = limit - len(personalized)
            personalized.extend(self._apply_genre_capping_and_dedup(cold_start_candidates, exclude_ids, needed))
            
        # 2. Explore New
        explore_new = []
        target_genres = []
        if user_id:
            user_interacted_book_ids = UserInteraction.objects.filter(user_id=user_id).values_list('book_id', flat=True)
            user_books = Book.objects.filter(bookId__in=user_interacted_book_ids)
            
            known_genres = set()
            for b in user_books:
                if b.genres:
                    known_genres.update(self._preprocess_list_field(b.genres))
                    
            all_genres_query = Book.objects.exclude(genres__isnull=True).exclude(genres='').values('genres').annotate(count=Count('bookId')).order_by('-count')[:50]
            all_popular_genres = []
            for g in all_genres_query:
                all_popular_genres.extend(self._preprocess_list_field(g['genres']))
                
            all_popular_genres = list(set(all_popular_genres))
            unseen_genres = [g for g in all_popular_genres if g not in known_genres]
            if unseen_genres:
                target_genres = random.sample(unseen_genres, min(2, len(unseen_genres)))
        
        if not target_genres:
            all_genres_query = Book.objects.exclude(genres__isnull=True).exclude(genres='').values('genres').annotate(count=Count('bookId')).order_by('-count')[:20]
            top_genres_flat = []
            for g in all_genres_query:
                top_genres_flat.extend(self._preprocess_list_field(g['genres']))
                
            unique_top = []
            for g in top_genres_flat:
                if g not in unique_top:
                    unique_top.append(g)
                    
            if len(unique_top) > 3:
                outside_top_3 = unique_top[3:]
                target_genres = random.sample(outside_top_3, min(2, len(outside_top_3)))
                
        genre_query = Q()
        for g in target_genres:
            genre_query |= Q(genres__icontains=g)
            
        if genre_query:
            explore_candidates = list(Book.objects.filter(
                genre_query, rating__gte=4.0, numRatings__gte=100
            ).order_by('-rating', '-numRatings')[:limit*3])
            
            random.shuffle(explore_candidates)
            explore_new = self._apply_genre_capping_and_dedup(explore_candidates, exclude_ids, limit)
            
        if len(explore_new) < limit:
            needed = limit - len(explore_new)
            extra_explore = list(Book.objects.filter(rating__gte=4.0, numRatings__gte=100).order_by('?')[:needed*3])
            explore_new.extend(self._apply_genre_capping_and_dedup(extra_explore, exclude_ids, needed))

        # 3. Trending
        trending = []
        trending_query = UserInteraction.objects.values('book_id').annotate(
            score=Sum(
                Case(
                    When(interaction_type='purchase', then=5),
                    When(interaction_type='add_to_cart', then=3),
                    When(interaction_type='view', then=1),
                    default=0,
                    output_field=IntegerField(),
                )
            )
        ).order_by('-score')[:limit*5]
        
        trending_book_ids = [t['book_id'] for t in trending_query]
        trending_candidates = list(Book.objects.filter(bookId__in=trending_book_ids))
        trending_candidates.sort(key=lambda x: trending_book_ids.index(x.bookId) if x.bookId in trending_book_ids else 999)
        
        trending = self._apply_genre_capping_and_dedup(trending_candidates, exclude_ids, limit)
        
        if len(trending) < limit:
            needed = limit - len(trending)
            extra_trending = list(Book.objects.filter(numRatings__gte=500).order_by('-rating', '-numRatings')[:needed*3])
            trending.extend(self._apply_genre_capping_and_dedup(extra_trending, exclude_ids, needed))
            
        return {
            'personalized': personalized,
            'explore_new': explore_new,
            'trending': trending
        }

    def get_cold_start_recommendations(self, limit=5):
        books = Book.objects.filter(
            rating__isnull=False, 
            numRatings__isnull=False,
            numRatings__gte=100
        ).order_by('-rating', '-numRatings')[:limit]
        
        if not books:
            books = Book.objects.filter(rating__isnull=False).order_by('-rating', '-numRatings')[:limit]
            
        if not books:
            books = Book.objects.all().order_by('-bookId')[:limit]
            
        return list(books)
