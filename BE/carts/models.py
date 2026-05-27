from django.db import models
from django.conf import settings
from accounts.models import Account
from books.models import Book

class Cart(models.Model):
    cartId = models.AutoField(primary_key=True)  # Map to the `cartId` column in the database
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        db_column='user_id'
    )
    book = models.ForeignKey(
        'books.Book', 
        on_delete=models.CASCADE, 
        db_column='bookId'
    )
    quantity = models.IntegerField()  # Map to `quantity`
    added_at = models.DateTimeField(auto_now_add=True)  # Map to `addedAt`

    class Meta:
        managed = True  # Let Django handle the table
        db_table = 'carts'  # Explicitly specify the table name

    def __str__(self):
        return f"Cart {self.cartId}: {self.user.username} - {self.book.title} - {self.quantity}"