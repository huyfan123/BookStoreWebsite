from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemSerializer
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError
from books.models import Book
from rest_framework.pagination import CursorPagination
from django.db.models import Q


# View User's Orders and Order Items
class UserOrderView(APIView):
    def get(self, request):
        username = request.query_params.get("username")
        if not username:
            return Response({"error": "Username is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch orders and their items for the given username
        orders = Order.objects.filter(username=username).prefetch_related("items")
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# List all orders with orderId, username, totalAmount, and status (for admin)
class OrderListAdminView(APIView):
    def get(self, request):
        class SimpleOrderCursorPagination(CursorPagination):
            page_size = 10
            ordering = 'orderId'
        paginator = SimpleOrderCursorPagination()
        orders = Order.objects.all().order_by('orderId').values('orderId', 'username', 'totalAmount', 'status')
        result_page = paginator.paginate_queryset(orders, request)
        return paginator.get_paginated_response(result_page)

# Search for a specific order by orderId or username (for admin)
class SearchOrderCursorPagination(CursorPagination):
    page_size = 10
    ordering = 'orderDate'

class SearchOrderView(APIView):
    def get(self, request):
        query = request.query_params.get("order_id", None)
        if not query:
            return Response({"error": "order_id is required as a query parameter."}, status=status.HTTP_400_BAD_REQUEST)

        # Try to search by orderId (exact match) or username (partial match)
        orders = Order.objects.filter(
            Q(orderId__iexact=query) |
            Q(username__icontains=query)
        ).order_by('orderDate')


        paginator = SearchOrderCursorPagination()
        result_page = paginator.paginate_queryset(orders, request)
        serializer = OrderSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

# Create an Order (For Users)
class CreateOrderView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            # Extract order data from the request
            username = request.data.get("username")
            receiver_name = request.data.get("receiverName")
            receiver_phone = request.data.get("receiverPhone")
            shipping_address = request.data.get("shippingAddress")
            payment_method = request.data.get("paymentMethod")
            items_data = request.data.get("items", [])

            # Create the order
            order = Order.objects.create(
                username=username,
                receiverName=receiver_name,
                receiverPhone=receiver_phone,
                shippingAddress=shipping_address,
                paymentMethod=payment_method,
                status="Processing",
                totalAmount=0,  # We'll calculate this later
            )

            total_amount = 0

            # Add items to the order
            for item_data in items_data:
                book_id = item_data.get("book_id")  # Extract book ID from request
                book = get_object_or_404(Book, bookId=book_id)  # Fetch the Book instance

                quantity = item_data.get("quantity")
                price = item_data.get("price")
                total_price = price * quantity

                # Check if enough stock is available
                if book.quantity < quantity:
                    order.delete()  # Clean up the created order
                    return Response({
                        "error": f"Not enough stock for '{book.title}'. Only {book.quantity} left."
                    }, status=status.HTTP_400_BAD_REQUEST)

                # Create the OrderItem
                OrderItem.objects.create(
                    order=order,
                    book=book,  # Use the Book instance
                    quantity=quantity,
                    price=price,
                    totalPrice=total_price,
                )

                # Update the book's inventory
                book.quantity -= quantity
                book.save()

                # Update the total order amount
                total_amount += total_price

            # Update the order's total amount
            order.totalAmount = total_amount
            order.save()

            return Response({"message": "Order created successfully!"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Edit an Order (For Admins)
class EditOrderView(APIView):
    # permission_classes = [IsAdminUser]

    def patch(self, request):
        order_id = request.query_params.get("order_id")
        if not order_id:
            raise ValidationError({"error": "order_id is required as a query parameter."})

        order = get_object_or_404(Order, orderId=order_id)

        serializer = OrderSerializer(order, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Edit Order Status (For Users - Cancel Only)
class EditOrderStatusView(APIView):
    def put(self, request):
        username = request.query_params.get("username")
        order_id = request.query_params.get("order_id")

        print(f"Username: {username}, Order ID: {order_id}")
        if not username or not order_id:
            return Response({"error": "Username and order_id are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Fetch the order based on username and order_id
            order = Order.objects.get(orderId=order_id, username=username)
        except Order.DoesNotExist:
            return Response({"error": "Order not found or you don't have permission to modify this order"}, status=status.HTTP_404_NOT_FOUND)

        if order.status != "Processing":
            return Response({"error": "Only orders in 'Processing' status can be cancelled"}, status=status.HTTP_400_BAD_REQUEST)

        # Update the status to 'Cancelled'
        order.status = "Cancelled"
        order.save()
        return Response({"message": "Order cancelled successfully"}, status=status.HTTP_200_OK)

# Delete an Order (For Admins)
class DeleteOrderView(APIView):
    # permission_classes = [IsAdminUser]

    def delete(self, request):
        order_id = request.query_params.get("order_id")
        if not order_id:
            raise ValidationError({"error": "order_id is required as a query parameter."})

        order = get_object_or_404(Order, orderId=order_id)
        order.delete()
        return Response({"message": "Order deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

# Get all information of a specific order (for admin, without order items)
class OrderDetailAdminView(APIView):
    def get(self, request):
        order_id = request.query_params.get('order_id')
        if not order_id:
            return Response({'error': 'order_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            order = Order.objects.get(orderId=order_id)
            # Exclude order items from the response
            data = {
                'orderId': order.orderId,
                'username': order.username,
                'receiverName': order.receiverName,
                'receiverPhone': order.receiverPhone,
                'orderDate': order.orderDate,
                'status': order.status,
                'totalAmount': order.totalAmount,
                'shippingAddress': order.shippingAddress,
                'paymentMethod': order.paymentMethod,
                'createdAt': order.createdAt,
                'updatedAt': order.updatedAt,
            }
            return Response(data, status=status.HTTP_200_OK)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

