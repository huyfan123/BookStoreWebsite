import pandas as pd
from django.core.management.base import BaseCommand
from books.models import Book, UserInteraction
from books.services.recommender_service import RecommenderService

class Command(BaseCommand):
    help = 'Train the recommendation model and save it to a .pkl file'

    def handle(self, *args, **kwargs):
        self.stdout.write('Fetching data from the database...')
        
        # Get all books with necessary fields
        books_qs = Book.objects.all().values('bookId', 'author', 'genres', 'series', 'characters', 'description')
        
        if not books_qs:
            self.stdout.write(self.style.ERROR('No books found in the database. Aborting training.'))
            return

        df = pd.DataFrame(list(books_qs))
        
        self.stdout.write(f'Loaded {len(df)} books. Starting Content-Based training...')
        
        # Get user interactions
        interactions_qs = UserInteraction.objects.all().values('user_id', 'book_id', 'interaction_type', 'rating_score')
        interactions_df = pd.DataFrame(list(interactions_qs))
        
        self.stdout.write(f'Loaded {len(interactions_df)} user interactions. Starting CF training...')
        
        try:
            service = RecommenderService()
            service.train(df)
            self.stdout.write(self.style.SUCCESS(f'Successfully trained Content-Based model.'))
            
            if not interactions_df.empty:
                service.train_cf(interactions_df)
                self.stdout.write(self.style.SUCCESS(f'Successfully trained Collaborative Filtering model.'))
            else:
                self.stdout.write(self.style.WARNING(f'No user interactions found. Skipping CF model training.'))
                
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'An error occurred during training: {str(e)}'))
