from rest_framework import serializers
from .models import Book

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['bookId', 'title', 'author', 'price', 'coverImg', 'quantity']
        
        
# Custom serializer for detailed book information
class BookDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = [
            'bookId', 
            'title', 
            'series',
            'author', 
            'description', 
            'language',
            'isbn',
            'genres',
            'characters',
            'bookFormat',
            'edition',
            'pages',
            'publishDate',
            'awards',
            'coverImg', 
            'price',
            'quantity',  # Add quantity to detailed serializer
        ]