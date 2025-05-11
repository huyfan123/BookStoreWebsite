from django.http import JsonResponse
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import CursorPagination
from .models import Book
from .serializers import BookSerializer, BookDetailSerializer

def book_list(request):
    # Get the limit (number of records to fetch) from query parameters
    limit = request.GET.get('limit', None)  # Example: ?limit=10
    
    try:
        limit = int(limit) if limit else None  # Convert limit to integer if provided
    except ValueError:
        return JsonResponse({'error': 'Invalid limit value'}, status=400)
    
    if limit:
        # Fetch the specified number of books
        books = Book.objects.all()[:limit].values()  # Slicing the QuerySet to limit the records
    else:
        # Fetch all books if no limit is specified
        books = Book.objects.all().values()

    return JsonResponse(list(books), safe=False)  # Return the data as JSON

class BookCursorPagination(CursorPagination):
    page_size = 30  # Items per page
    ordering = 'bookId'  # Order by 'id' field

# Book list with pagination
class BookListAPIView(ListAPIView):
    queryset = Book.objects.values('bookId', 'title', 'author', 'price', 'coverImg')
    serializer_class = BookSerializer
    pagination_class = BookCursorPagination  # Use custom pagination

class LoadBookAPIView(APIView):
    def get(self, request):
        bookId = request.query_params.get('bookId', None)
        if not bookId:
            return Response({"error": "bookId is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Fetch the book by bookId
            book = Book.objects.get(bookId=bookId)
        except Book.DoesNotExist:
            # Return a 404 if the book does not exist
            return Response({"error": "Book not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Serialize and return the book information
        serializer = BookDetailSerializer(book)
        return Response(serializer.data, status=status.HTTP_200_OK)

class FilterBookCursorPagination(CursorPagination):
    page_size = 30  # Items per page
    ordering = 'bookId'  # Order by 'id' field

class FilterBooksAPIView(APIView):
    def get(self, request):
        # Initialize filters dictionary
        filters = {}

        # Get query parameters
        min_price = request.query_params.get('min_price', None)
        max_price = request.query_params.get('max_price', None)
        language = request.query_params.get('language', None)
        genre = request.query_params.get('genre', None)

        # Apply filters dynamically
        if min_price:
            filters['price__gte'] = min_price  # Price greater than or equal to min_price
        if max_price:
            filters['price__lte'] = max_price  # Price less than or equal to max_price
        if language:
            filters['language__icontains'] = language  # Case-insensitive match for language
        if genre:
            filters['genres__icontains'] = genre  # Case-insensitive match for genre

        # Fetch filtered books
        books = Book.objects.filter(**filters)

        # Apply cursor pagination
        paginator = FilterBookCursorPagination()
        paginator.page_size = 20  # Set page size
        paginated_books = paginator.paginate_queryset(books, request)

        # Serialize data
        serializer = BookSerializer(paginated_books, many=True)

        # Return paginated response
        return paginator.get_paginated_response(serializer.data)   
    
class SearchBookCursorPagination(CursorPagination):
    page_size = 30  # Items per page
    ordering = 'bookId'  # Order by 'id' field
    
# Search Books API
class SearchBooksAPIView(APIView):
    def get(self, request):
        title_query = request.query_params.get('title', None)
        if title_query:
            books = Book.objects.filter(title__icontains=title_query)
            
            # Apply cursor pagination
            paginator = SearchBookCursorPagination()
            paginator.page_size = 30  # Set page size
            paginated_books = paginator.paginate_queryset(books, request)

            serializer = BookSerializer(paginated_books, many=True)
            return paginator.get_paginated_response(serializer.data)  
        return Response({"error": "Title query parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

# Create Book API
class CreateBookAPIView(APIView):
    def post(self, request):
        serializer = BookSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Book created successfully"}, status=status.HTTP_201_CREATED)
        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

# Update Book API (Partial Updates using query parameters)
class UpdateBookAPIView(APIView):
    def patch(self, request):
        book_id = request.query_params.get('book_id', None)
        if not book_id:
            return Response({"error": "Query parameter 'book_id' is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            book = Book.objects.get(pk=book_id)
        except Book.DoesNotExist:
            return Response({"error": "Book not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = BookSerializer(book, data=request.data, partial=True)  # Enable partial updates
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Book updated successfully"}, status=status.HTTP_200_OK)
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

# Delete Book API (using query parameters)
class DeleteBookAPIView(APIView):
    def delete(self, request):
        book_id = request.query_params.get('book_id', None)
        if not book_id:
            return Response({"error": "Query parameter 'book_id' is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            book = Book.objects.get(pk=book_id)
            book.delete()
            return Response({"message": "Book deleted successfully"}, status=status.HTTP_200_OK)
        except Book.DoesNotExist:
            return Response({"error": "Book not found"}, status=status.HTTP_404_NOT_FOUND)