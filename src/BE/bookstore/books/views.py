from django.http import JsonResponse
from .models import Book

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