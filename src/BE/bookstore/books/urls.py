from django.urls import path
from . import views
from .views import *

urlpatterns = [
    # path('books/', views.book_list, name='book_list'),  # Route to fetch books
    path('books/', BookListAPIView.as_view(), name='book-list'),
    path('books/filter/', FilterBooksAPIView.as_view(), name='filter_books'),
    path('books/search/', SearchBooksAPIView.as_view(), name='search_books'),
    path('books/create/', CreateBookAPIView.as_view(), name='create_book'),
    path('books/update/', UpdateBookAPIView.as_view(), name='update_book'),
    path('books/delete/', DeleteBookAPIView.as_view(), name='delete_book'),
    path('books/book-info/', LoadBookAPIView.as_view(), name='load_book'),
    path('books/recommend/', RecommendBooksAPIView.as_view(), name='recommend_books'),  # Get 3 random books
    path('books/statistics/', BookStatisticsAPIView.as_view(), name='book_statistics'),
]