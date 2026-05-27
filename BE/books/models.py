from django.db import models

class Book(models.Model):
    bookId = models.CharField(max_length=255, primary_key=True)  # Primary key column
    title = models.CharField(max_length=255, null=False)
    author = models.TextField(null=False)
    awards = models.TextField(blank=True, null=True)
    bookFormat = models.CharField(max_length=50, blank=True, null=True)
    characters = models.TextField(blank=True, null=True)
    coverImg = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    edition = models.CharField(max_length=255, blank=True, null=True)
    genres = models.CharField(max_length=255, blank=True, null=True)
    isbn = models.CharField(max_length=17, blank=True, null=True)
    language = models.CharField(max_length=50, blank=True, null=True)
    pages = models.PositiveIntegerField(blank=True, null=True)  # Unsigned int
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    publishDate = models.DateField(blank=True, null=True)
    publisher = models.CharField(max_length=255, blank=True, null=True)
    series = models.CharField(max_length=255, blank=True, null=True)
    setting = models.TextField(blank=False, null=False)
    quantity = models.PositiveIntegerField(blank=False, null=False)  # New field for stock quantity
    rating = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True, default=0.00)
    numRatings = models.BigIntegerField(blank=True, null=True, default=0)
    ratingsByStars = models.TextField(blank=True, null=True)
    likedPercent = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    bbeScore = models.BigIntegerField(blank=True, null=True, default=0)
    bbeVotes = models.BigIntegerField(blank=True, null=True, default=0)
    firstPublishDate = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False  # Use this if Django should not manage the database table
        db_table = 'books'  # Name of the table in your database

    def __str__(self):
        return self.title

class UserInteraction(models.Model):
    INTERACTION_CHOICES = [
        ('view', 'View'),
        ('add_to_cart', 'Add to Cart'),
        ('purchase', 'Purchase'),
        ('rating', 'Rating'),
    ]

    interaction_id = models.BigAutoField(primary_key=True)
    user_id = models.CharField(max_length=255, null=False)
    book = models.ForeignKey(Book, on_delete=models.CASCADE, db_column='book_id')
    interaction_type = models.CharField(max_length=50, choices=INTERACTION_CHOICES, null=False)
    rating_score = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False  # The table is already created in the DB
        db_table = 'user_interactions'

    def __str__(self):
        return f"{self.user_id} - {self.interaction_type} - {self.book_id}"