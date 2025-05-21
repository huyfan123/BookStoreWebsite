from django.urls import path
from .views import (
    UserOrderView,
    CreateOrderView,
    EditOrderView,
    EditOrderStatusView,
    DeleteOrderView,
)

urlpatterns = [
    path("orders/", UserOrderView.as_view(), name="user-orders"),
    path("orders/create/", CreateOrderView.as_view(), name="create-order"),
    path("orders/edit/", EditOrderView.as_view(), name="edit-order"),  # No path parameter
    path("orders/status/", EditOrderStatusView.as_view(), name="edit-order-status"),  # No path parameter
    path("orders/delete/", DeleteOrderView.as_view(), name="delete-order"),  # No path parameter
]