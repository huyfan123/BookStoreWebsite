from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Cart
from books.models import Book
from .serializers import CartSerializer
from accounts.models import Account


# Add to Cart
class AddToCartView(APIView):
    def post(self, request):
        username = request.data.get('username')
        book_id = request.data.get('bookId')
        quantity = request.data.get('quantity', 1)

        # Validate User
        user = get_object_or_404(Account, username=username)

        # Validate Book
        book = get_object_or_404(Book, bookId=book_id)

        # Add or Update Cart Entry
        cart_item, created = Cart.objects.get_or_create(user=user, book=book)
        if not created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity
        cart_item.save()

        return Response({"message": "Book added to cart successfully"}, status=status.HTTP_201_CREATED)

class EditCartView(APIView):
    def put(self, request):
        cart_id = request.query_params.get('cartId')
        if not cart_id:
            return Response({"error": "cartId is required."}, status=status.HTTP_400_BAD_REQUEST)

        quantity = request.data.get('quantity')


        try:
            cart_item = Cart.objects.get(cartId=cart_id)
        except Cart.DoesNotExist:
            return Response({"error": "Cart item not found."}, status=status.HTTP_404_NOT_FOUND)

        # Update the cart item
        cart_item.quantity = quantity
        cart_item.save()

        return Response(
            {
                "message": "Cart updated successfully.",
            },
            status=status.HTTP_200_OK,
        )

# Delete Book in Cart
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Cart

class DeleteCartView(APIView):
    def delete(self, request):
        cart_id = request.query_params.get('cartId')  # Get `cartId` from query params
        if not cart_id:
            return Response({"error": "cartId is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cart_item = Cart.objects.get(cartId=cart_id)
        except Cart.DoesNotExist:
            return Response({"error": "Cart item not found."}, status=status.HTTP_404_NOT_FOUND)
        
        # Delete the cart item
        cart_item.delete()
        return Response(
            {"message": "Book removed from cart successfully.", "cartId": cart_id},
            status=status.HTTP_200_OK
        )

# Load List Books in Cart
class LoadCartView(APIView):
    def get(self, request):
        username = request.query_params.get('username')

        if not username:
            return Response({"error": "Username is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Validate User
        user = get_object_or_404(Account, username=username)

        # Get Cart Items
        cart_items = Cart.objects.filter(user=user)
        serializer = CartSerializer(cart_items, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)