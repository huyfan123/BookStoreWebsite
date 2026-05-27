# Implementation Plan: Collaborative Filtering & Hybrid Engine

This plan details the implementation of the Collaborative Filtering (CF) component and its integration into a complete Hybrid Recommendation Engine.

## User Review Required
> [!WARNING]
> You mentioned that you have created the `user_interactions` table, but I could not find a corresponding Django Model (`UserInteraction`) in your `books/models.py`. 
> I plan to **create the Django Model** for `UserInteraction` in `books/models.py` mapping to the `user_interactions` table. Please confirm if this is acceptable, or let me know if you placed the model in another app.

## Proposed Changes

---

### books/models.py
Define the Django model for the user interactions to interact with the database.
#### [MODIFY] [models.py](file:///d:/STUDY/Pet_Projects/BookStoreWebsite/BE/books/models.py)
- **Class `UserInteraction`**:
  - `user_id`: CharField or IntegerField (assuming CharField to support UUIDs).
  - `book`: ForeignKey to `Book`.
  - `interaction_type`: CharField with choices ('view', 'add_to_cart', 'purchase', 'rating').
  - `rating_score`: FloatField/DecimalField (nullable).
  - `created_at`: DateTimeField.

---

### books/services/recommender_service.py
Enhance the existing service with CF and Hybrid logic.
#### [MODIFY] [recommender_service.py](file:///d:/STUDY/Pet_Projects/BookStoreWebsite/BE/books/services/recommender_service.py)
- **Matrix Factorization (SVD)**:
  - Aggregate user interactions into a sparse User-Item matrix using `scipy.sparse.csr_matrix`.
  - Apply weights: `view=1.0, add_to_cart=3.0, purchase=5.0`.
  - Perform Singular Value Decomposition (`scipy.sparse.linalg.svds`) to generate user and item latent feature matrices.
  - Compute predicted ratings for the user.
- **Hybrid Logic (`get_hybrid_recommendations`)**:
  - Retrieve Content-based similar items (if a `book_id` is provided).
  - Calculate Collaborative Filtering scores for the user.
  - Combine scores using a weighted average: `0.4 * Content + 0.6 * Collaborative`.
  - **Cold Start**: If the user has no interactions, fall back entirely to Content-based (if `book_id` is provided) or the "Top Books" logic.

---

### books/management/commands/train_recommender.py
Update the training script to handle both models.
#### [MODIFY] [train_recommender.py](file:///d:/STUDY/Pet_Projects/BookStoreWebsite/BE/books/management/commands/train_recommender.py)
- Fetch both `Book` data and `UserInteraction` data.
- Train Content-based model (existing).
- Train Collaborative Filtering model (new).
- Save both models into `.pkl` files (e.g., `recommendation_data.pkl` and `cf_model.pkl`).

---

### books/management/commands/seed_interactions.py
A new script to generate dummy data.
#### [NEW] [seed_interactions.py](file:///d:/STUDY/Pet_Projects/BookStoreWebsite/BE/books/management/commands/seed_interactions.py)
- Create a Django Management Command to generate synthetic interactions for ~100 dummy users across hundreds of random books.
- This will allow us to test the Matrix Factorization implementation.

---

### books/views.py
Update the API endpoint to support user-specific personalized recommendations.
#### [MODIFY] [views.py](file:///d:/STUDY/Pet_Projects/BookStoreWebsite/BE/books/views.py)
- **`RecommendBooksAPIView`**:
  - Extract `user_id` and `bookId` from `request.query_params`.
  - Call `get_hybrid_recommendations(user_id, book_id, limit=5)`.
  - Return personalized recommendations.

## Verification Plan

### Automated Tests
- None initially.

### Manual Verification
1. Run `python manage.py makemigrations` and `python manage.py migrate` to apply the `UserInteraction` model.
2. Run `python manage.py seed_interactions` to populate the mock data.
3. Run `python manage.py train_recommender` to train both models and verify no memory/computation errors occur.
4. Use the API (`/api/recommend/?userId=user_1&bookId=abc`) to verify Hybrid recommendations are returned successfully.
