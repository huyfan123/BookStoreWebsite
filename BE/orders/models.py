from django.db import models
from django.contrib.auth.models import User
from django.db import models
from django.conf import settings

class Order(models.Model):

    orderId = models.AutoField(primary_key=True)  # Auto-incrementing primary key
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, # Giữ lại đơn hàng nếu account bị xóa
        null=True,
        db_column='user_id'
    ) 
    receiverName = models.CharField(max_length=100)
    receiverPhone = models.CharField(max_length=15) 
    orderDate = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50)
    totalAmount = models.FloatField()
    shippingAddress = models.TextField()
    paymentMethod = models.CharField(max_length=50)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "orders"  # Explicitly map to the orders table in the database
        managed = True


class OrderItem(models.Model):
    orderItemId = models.AutoField(primary_key=True)
    order = models.ForeignKey(
        Order, 
        on_delete=models.CASCADE, 
        db_column='orderId',
        related_name='items' # Dễ dàng query ngược từ Order: order.items.all()
    )
    book = models.ForeignKey(
        'books.Book', 
        on_delete=models.PROTECT, # Chặn xóa sách nếu đã có người mua
        db_column='bookId'
    )
    quantity = models.IntegerField()
    price = models.FloatField()
    totalPrice = models.FloatField()

    class Meta:
        db_table = "order_items"
        managed = True

    def __str__(self):
        return f"OrderItem #{self.orderItemId} for Order #{self.order.orderId}"