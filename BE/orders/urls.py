from django.urls import path
from .views import (
    UserOrderView,
    SearchOrderView,
    CreateOrderView,
    EditOrderView,
    EditOrderStatusView,
    DeleteOrderView,
    OrderListAdminView,  # Import the new view
    OrderDetailAdminView,  # Import the OrderDetailAdminView
)

urlpatterns = [
    path("orders/", UserOrderView.as_view(), name="user-orders"),
    path("orders/search/", SearchOrderView.as_view(), name="search-order"),  # No path parameter
    path("orders/create/", CreateOrderView.as_view(), name="create-order"),
    path("orders/edit/", EditOrderView.as_view(), name="edit-order"),  # No path parameter
    path("orders/status/", EditOrderStatusView.as_view(), name="edit-order-status"),  # No path parameter
    path("orders/delete/", DeleteOrderView.as_view(), name="delete-order"),  # No path parameter
    path("orders/list/", OrderListAdminView.as_view(), name="order-list"),  # List all orders (orderId, username, total, status)
    path("orders/details/", OrderDetailAdminView.as_view(), name="order-details-admin"),  # Get all info of a specific order (admin)
]