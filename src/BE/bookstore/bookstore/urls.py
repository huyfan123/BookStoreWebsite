from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('books.urls')),  # Include the books app's URLs
    path('api/', include('accounts.urls')),  # Include accounts app URLs
    path('api/', include('carts.urls')),  # Prefix for all cart-related API endpoints
    path('api/', include('orders.urls')),  # Prefix for all order-related API endpoints
]