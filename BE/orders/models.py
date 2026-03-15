from django.db import models
from django.contrib.auth.models import User

from django.db import models

class Order(models.Model):
    STATUS_CHOICES = [
        ("Processing", "Processing"),
        ("Shipping", "Shipping"),
        ("Delivered", "Delivered"),
        ("Cancelled", "Cancelled"),
    ]
    PAYMENT_METHOD_CHOICES = [
        ("Credit Card", "Credit Card"),
        ("PayPal", "PayPal"),
        ("Cash on Delivery", "Cash on Delivery"),
    ]

    orderId = models.AutoField(primary_key=True)  # Auto-incrementing primary key
    username = models.CharField(max_length=50)  # Username of the user who placed the order
    receiverName = models.CharField(max_length=100, default='')  # Name of the receiver
    receiverPhone = models.CharField(max_length=20, default='')  # Phone number of the receiver
    orderDate = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Processing")
    totalAmount = models.DecimalField(max_digits=10, decimal_places=2)
    shippingAddress = models.TextField()
    paymentMethod = models.CharField(max_length=50, choices=PAYMENT_METHOD_CHOICES, default="Credit Card")
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "orders"  # Explicitly map to the orders table in the database
        managed = False

    def __str__(self):
        return f"Order #{self.orderId} - {self.receiverName}"

class OrderItem(models.Model):
    orderItemId = models.AutoField(primary_key=True)  # Auto-incrementing primary key
    order = models.ForeignKey(
        "Order", related_name="items", on_delete=models.CASCADE, db_column="orderId"
    )  # Explicitly map to the 'orderId' column in the database
    book = models.ForeignKey(
        "books.Book", on_delete=models.CASCADE, db_column="bookId"
    )   # Link to the Book model
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    totalPrice = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = "order_items"
        managed = False

    def __str__(self):
        return f"OrderItem #{self.orderItemId} for Order #{self.order.orderId}"