# Hybrid Recommendation Engine Implementation

## Summary
I have successfully implemented the Collaborative Filtering component using SVD and combined it into a complete Hybrid Recommendation Engine. The system now utilizes user interactions (views, add to cart, purchases, ratings) to generate personalized predictions alongside content-based similarities.

## Changes Made
1. **`books/models.py`**:
   - Added the `UserInteraction` Django model directly mapped to your `user_interactions` database table (using `managed=False` so it doesn't conflict with your migrations).

2. **`books/management/commands/seed_interactions.py`**:
   - Created a seed script that generated 3,123 dummy interaction records for 100 users across top-rated books.

3. **`books/services/recommender_service.py`**:
   - **Collaborative Filtering**: Implemented `scipy.sparse.linalg.svds` for Matrix Factorization. User interactions are weighted (`view=1.0`, `add_to_cart=3.0`, `purchase=5.0`, or direct `rating_score`) and reduced into latent factors, saving the `u`, `s`, `vt` matrices in a new `cf_model.pkl` artifact. Memory optimizations were handled via sparse CSR matrices.
   - **Hybrid Engine**: Developed `get_hybrid_recommendations` which blends Content-Based scores (40%) and Collaborative Filtering scores (60%). 
   - **Fallback/Cold-Start**: Handled cases where user history doesn't exist or SVD cannot run (by relying purely on CB or global top-rated books).

4. **`books/management/commands/train_recommender.py`**:
   - Updated the offline training command to fetch user interactions and train the new CF model.

5. **`books/views.py`**:
   - Updated `RecommendBooksAPIView` to accept both `?bookId=` and `?userId=` query parameters. It now calls the fully personalized hybrid logic.

## Validation Results
- The seed script `seed_interactions` successfully inserted data into your DB.
- Re-ran `python manage.py train_recommender`. It completed training the Content-Based model and subsequently the new CF Model without any memory limit issues.
