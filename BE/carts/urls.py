from django.urls import path
from .views import AddToCartView, EditCartView, DeleteCartView, LoadCartView

urlpatterns = [
    path('cart/add/', AddToCartView.as_view(), name='add_to_cart'),
    path('cart/edit/', EditCartView.as_view(), name='edit_cart'),
    path('cart/delete/', DeleteCartView.as_view(), name='delete_cart'),
    path('cart/load/', LoadCartView.as_view(), name='load_cart'),
]