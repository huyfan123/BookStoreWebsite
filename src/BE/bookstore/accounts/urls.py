from django.urls import path
from . import views
from .views import CreateAccountAPIView, UpdateAccountAPIView, SearchAccountAPIView, DeleteAccountAPIView

urlpatterns = [
    path('accounts/create/', views.create_account, name='create_account'),  # Add new account
    path('accounts/login/', views.login, name='login'),  # Login account
    path('admin/accounts/', views.account_list, name='account_list'),  # View all accounts for admin
    path('admin/accounts/create/', CreateAccountAPIView.as_view(), name='create_account'),
    path('admin/accounts/update/', UpdateAccountAPIView.as_view(), name='update_account'),  # No username in the URL, uses query params
    path('admin/accounts/search/', SearchAccountAPIView.as_view(), name='search_account'),
    path('admin/accounts/delete/', DeleteAccountAPIView.as_view(), name='delete_account'),  # No username in the URL, uses query params
]