from django.urls import path
from . import views
from .views import CreateAccountAPIView, UpdateAccountAPIView, SearchAccountAPIView, DeleteAccountAPIView

urlpatterns = [
    path('accounts/create/', views.create_account, name='create_account'),  # Add new account
    path('accounts/login/', views.login, name='login'),  # Login account
    path('accounts/edit/', views.edit_account, name='edit_account'),  # Endpoint for editing accounts (partial updates)
    path('accounts/delete/', views.delete_account, name='delete_account'),  # Endpoint for deleting accounts
    path('admin/accounts/', views.account_list, name='account_list'),  # View all accounts for admin
    path('admin/accounts/create/', CreateAccountAPIView.as_view(), name='create_account'),
    path('admin/accounts/update/', UpdateAccountAPIView.as_view(), name='update_account'), 
    path('admin/accounts/search/', SearchAccountAPIView.as_view(), name='search_account'),
    path('admin/accounts/delete/', DeleteAccountAPIView.as_view(), name='delete_account'), 
]