from rest_framework import serializers
from .models import Cart
from books.serializers import BookSerializer  # Assuming you have a BookSerializer

class CartSerializer(serializers.ModelSerializer):
    book = BookSerializer()

    class Meta:
        model = Cart
        fields = ['cartId', 'book', 'quantity', 'added_at']