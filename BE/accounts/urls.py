from django.urls import path
from . import views
from .views import (
    CreateAccountAPIView, UpdateAccountAPIView, SearchAccountAPIView, 
    DeleteAccountAPIView, LoadAccountAPIView, CustomTokenObtainPairView,
    CustomTokenRefreshView, TokenBlacklistView
)

urlpatterns = [
    # =====================================================
    # JWT AUTHENTICATION ENDPOINTS
    # =====================================================
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),  # Get access & refresh tokens
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),  # Refresh access token
    path('token/blacklist/', TokenBlacklistView.as_view(), name='token_blacklist'),  # Logout (blacklist token)
    
    # =====================================================
    # ACCOUNT MANAGEMENT ENDPOINTS
    # =====================================================
    path('accounts/create/', views.create_account, name='create_account'),  # Add new account
    path('accounts/login/', views.login, name='login'),  # Login account (legacy endpoint)
    path('accounts/edit/', views.edit_account, name='edit_account'),  # Endpoint for editing accounts (partial updates)
    path('accounts/delete/', views.delete_account, name='delete_account'),  # Endpoint for deleting accounts
    path('admin/accounts/', views.account_list, name='account_list'),  # View all accounts for admin
    path('admin/accounts/create/', CreateAccountAPIView.as_view(), name='create_account_api'),
    path('admin/accounts/update/', UpdateAccountAPIView.as_view(), name='update_account'), 
    path('admin/accounts/search/', SearchAccountAPIView.as_view(), name='search_account'),
    path('admin/accounts/delete/', DeleteAccountAPIView.as_view(), name='delete_account_api'), 
    path('admin/accounts/account-info/', LoadAccountAPIView.as_view(), name='load_account_info'),  # Get account details by userId (username)
]