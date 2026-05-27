# Implementation of Hybrid Recommendation System

This plan outlines the steps to build and integrate a Hybrid Recommendation Engine for the Bookstore Django project.

## User Review Required
> [!WARNING]
> You mentioned that the Cold Start logic should prioritize books based on `rating` and `numRatings` from the database. However, the `Book` model in `books/models.py` **does not have** `rating` or `numRatings` fields (only fields like `price`, `quantity`, `pages`, etc.). 
> Please clarify how you'd like to handle the cold start:
> 1. Should we add `rating` and `numRatings` fields to the `Book` model?
> 2. Or should we use a fallback logic for now (e.g., random books, or books with the highest `quantity`/stock)?

## Open Questions
- Where should the `.pkl` file be saved? I will place it in `books/ml_models/recommendation_data.pkl` by default. Is this acceptable?
- `cosine_similarity` on a very large dataset can result in a massive NxN matrix (e.g., 100,000 books = ~40GB matrix). If the dataset is huge, we might need a more memory-efficient approach (like nearest neighbors or limiting the dataset). How many books are currently in the database?

## Proposed Changes

---

### books/services/recommender_service.py
A new service class to handle preprocessing, model training, and inference.
#### [NEW] [recommender_service.py](file:///d:/STUDY/Pet_Projects/BookStoreWebsite/BE/books/services/recommender_service.py)
- **Class `RecommenderService`**:
  - `__init__()`: Loads the pre-trained model (`.pkl`) into memory if it exists.
  - `preprocess_data(df)`: Uses `ast.literal_eval` to parse `genres`, `characters`, `awards`. Uses `nltk` to remove punctuation and stopwords from `description`, converting everything to lowercase.
  - `create_soup(df)`: Combines `author`, `genres`, `series`, `characters`, and the cleaned `description` into a single string per book.
  - `train_and_save(books_queryset)`: Vectorizes the "Soup" using `TfidfVectorizer`, calculates `cosine_similarity`, and saves the similarity matrix and `bookId`-to-index mapping to a `.pkl` file.
  - `get_content_based_recommendations(book_id, limit=5)`: Returns a list of similar `bookId`s from the matrix.
  - `get_cold_start_recommendations(limit=5)`: Returns default books for new users. (Will use `quantity` or random temporarily until `rating` is clarified).

---

### books/management/commands/train_recommender.py
A Django management command to run the model training offline.
#### [NEW] [train_recommender.py](file:///d:/STUDY/Pet_Projects/BookStoreWebsite/BE/books/management/commands/train_recommender.py)
- **Command `train_recommender`**:
  - Fetches all `Book` records from the database.
  - If the database is empty, it aborts gracefully.
  - Passes the data to `RecommenderService().train_and_save()` to process and dump the `.pkl` file.

---

### books/views.py
Integration of the service into the API.
#### [MODIFY] [views.py](file:///d:/STUDY/Pet_Projects/BookStoreWebsite/BE/books/views.py)
- Update `RecommendBooksAPIView`:
  - Check `request.query_params` for a `bookId`.
  - If `bookId` exists: call `RecommenderService().get_content_based_recommendations(bookId)`.
  - If no `bookId` or the book isn't found: call `RecommenderService().get_cold_start_recommendations()`.
  - Fetch the corresponding `Book` objects and serialize them.

## Verification Plan

### Automated Tests
- N/A.

### Manual Verification
1. Run `python manage.py train_recommender` and verify it runs successfully and generates the `.pkl` file.
2. Test the API `/api/recommend/?bookId=<id>` using curl or a browser to verify content-based recommendations are returned.
3. Test the API `/api/recommend/` without `bookId` to verify cold-start recommendations are returned.
4. Verify graceful handling of invalid `bookId`s.
