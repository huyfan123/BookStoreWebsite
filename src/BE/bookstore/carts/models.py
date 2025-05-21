from django.db import models
from accounts.models import Account
from books.models import Book

class Cart(models.Model):
    cartId = models.AutoField(primary_key=True)  # Map to the `cartId` column in the database
    user = models.ForeignKey(
        Account,
        to_field='username',  # Reference the `username` column in the accounts table
        db_column='username',
        on_delete=models.CASCADE
    )
    book = models.ForeignKey(
        Book,
        to_field='bookId',  # Reference the `bookId` column in the books table
        db_column='bookId',
        on_delete=models.CASCADE
    )
    quantity = models.PositiveIntegerField(default=1)  # Map to `quantity`
    added_at = models.DateTimeField(db_column='addedAt', auto_now_add=True)  # Map to `addedAt`

    class Meta:
        managed = True  # Let Django handle the table
        db_table = 'carts'  # Explicitly specify the table name

    def __str__(self):
        return f"Cart {self.cartId}: {self.user.username} - {self.book.title} - {self.quantity}"