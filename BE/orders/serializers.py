from rest_framework import serializers
from .models import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    bookId = serializers.CharField(source="book.bookId", read_only=True)  # Access the bookId from the related Book model
    coverImg = serializers.CharField(source="book.coverImg", read_only=True)  # Access the coverImg from the related Book model

    class Meta:
        model = OrderItem
        fields = ["orderItemId", "bookId", "quantity", "price", "totalPrice", "coverImg"]

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)  # Nested serializer for order items

    class Meta:
        model = Order
        fields = "__all__"  # Includes all the fields (order_id, username, order_date, etc.)