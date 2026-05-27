import random
from django.core.management.base import BaseCommand
from books.models import Book, UserInteraction

class Command(BaseCommand):
    help = 'Seed dummy user interactions for Collaborative Filtering'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding dummy interactions...')
        
        # We need a pool of books to interact with
        # Let's get top 1000 books by rating to ensure some overlap
        books_qs = list(Book.objects.filter(rating__isnull=False).order_by('-rating', '-numRatings')[:1000])
        
        if not books_qs:
            self.stdout.write(self.style.ERROR('No books found. Please ensure books are loaded first.'))
            return

        users = [f'user_{i}' for i in range(1, 101)]  # 100 dummy users
        interaction_types = ['view', 'add_to_cart', 'purchase', 'rating']
        
        interactions_to_create = []
        
        for user_id in users:
            # Each user interacts with 10 to 50 books
            num_interactions = random.randint(10, 50)
            interacted_books = random.sample(books_qs, num_interactions)
            
            for book in interacted_books:
                # Randomly choose an interaction type
                interaction_type = random.choice(interaction_types)
                rating_score = None
                
                if interaction_type == 'rating':
                    # Ratings usually 1 to 5
                    rating_score = round(random.uniform(1.0, 5.0), 2)
                    
                interaction = UserInteraction(
                    user_id=user_id,
                    book=book,
                    interaction_type=interaction_type,
                    rating_score=rating_score
                )
                interactions_to_create.append(interaction)
                
        # Bulk create (Note: if table has issues, it might throw an error)
        # Using bulk_create ignores the 'managed=False' when inserting
        try:
            UserInteraction.objects.bulk_create(interactions_to_create)
            self.stdout.write(self.style.SUCCESS(f'Successfully created {len(interactions_to_create)} interactions.'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Failed to seed interactions: {str(e)}'))
