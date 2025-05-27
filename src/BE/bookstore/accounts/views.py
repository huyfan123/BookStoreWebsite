from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Account
from .serializers import AccountSerializer
from rest_framework.pagination import CursorPagination
import json
from django.contrib.auth.hashers import make_password,check_password
from django.db.models import Q

# Cursor pagination class
class AccountCursorPagination(CursorPagination):
    page_size = 10
    ordering = 'username'

# Fetch all accounts
@api_view(['GET'])
def account_list(request):
    accounts = Account.objects.all().order_by('username')
    paginator = AccountCursorPagination()
    result_page = paginator.paginate_queryset(accounts, request)
    serializer = AccountSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)

# Add a new account
@api_view(['POST'])
def create_account(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            raw_password = data.get('password')
            hashed_password = make_password(raw_password)  # Hash the password
            
            new_account = Account(
                username=data.get('username'),
                password=hashed_password,
                email=data.get('email'),
                fullname=data.get('fullname'),
                phonenumber=data.get('phonenumber'),
                address=data.get('address'), 
                role=data.get('role', 'user')  # Default role is 'user'
            )
            new_account.save()
            return Response({'message': 'Account created successfully'}, status=201)
        except Exception as e:
            # handle for each duplicate key column error
            if 'username' in str(e):
                return Response({'error': 'Username already exists'}, status=400)
            elif 'email' in str(e):
                return Response({'error': 'Email already exists'}, status=400)
            elif 'phonenumber' in str(e):
                return Response({'error': 'Phone number already exists'}, status=400)
            return Response({'error': str(e)}, status=400)
        
     

# Login account
@csrf_exempt
def login(request):
    if request.method == 'POST':
        try:
            # Parse JSON request body
            data = json.loads(request.body)
            username_or_email = data.get('username')
            password = data.get('password')

            if not username_or_email or not password:
                return JsonResponse({'error': 'Username/email and password are required'}, status=400)
            
            # Try to get account by username or email
            try:
                account = Account.objects.get(Q(username=username_or_email) | Q(email=username_or_email))
            except Account.DoesNotExist:
                return JsonResponse({'error': "Account doesn't exist"}, status=401)
            
            # Verify password
            if not check_password(password, account.password):
                return JsonResponse({'error': 'Wrong password'}, status=401)
           

            # Login successful, return user info (never return password!)
            return JsonResponse({
                'username': account.username,
                'fullname': account.fullname,
                'email': account.email,
                'phonenumber': account.phonenumber,
                'address': account.address,
                'role': account.role
            }, status=200)
        
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
    
    # If not POST, return a method not allowed error
    return JsonResponse({'error': 'Method not allowed'}, status=405)
# Edit Account API (Function-based view with partial updates)
@csrf_exempt
@api_view(['PATCH'])
def edit_account(request):
    username = request.query_params.get('username', None)
    if not username:
        return JsonResponse({"error": "Username is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Fetch the account by username
        account = Account.objects.get(username=username)
    except Account.DoesNotExist:
        return JsonResponse({"error": "Account not found"}, status=status.HTTP_404_NOT_FOUND)

    # Perform partial update
    serializer = AccountSerializer(account, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse({"message": "Account updated successfully"}, status=status.HTTP_200_OK)
    return JsonResponse({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

# Delete Account API (Function-based view)
@csrf_exempt
@api_view(['DELETE'])
def delete_account(request):
    username = request.query_params.get('username', None)
    if not username:
        return JsonResponse({"error": "Username is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Fetch the account by username
        account = Account.objects.get(username=username)
        account.delete()
        return JsonResponse({"message": "Account deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except Account.DoesNotExist:
        return JsonResponse({"error": "Account not found"}, status=status.HTTP_404_NOT_FOUND)


# Create Account API for admin
class CreateAccountAPIView(APIView):
    def post(self, request):
        serializer = AccountSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Account created successfully"}, status=status.HTTP_201_CREATED)
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

# Update Account API for admin
class UpdateAccountAPIView(APIView):
    def patch(self, request):
        username = request.query_params.get('username', None)
        if not username:
            return Response({"error": "Username is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            account = Account.objects.get(username=username)
        except Account.DoesNotExist:
            return Response({"error": "Account not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = AccountSerializer(account, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Account updated successfully"}, status=status.HTTP_200_OK)
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

# Search Account API for admin with cursor pagination
class SearchAccountAPIView(APIView):
    def get(self, request):
        query = request.query_params.get('username', None)
    
        if query:
            # Search across username, email, phonenumber, and fullname
            accounts = Account.objects.filter(
                Q(username__icontains=query) |
                Q(email__icontains=query) |
                Q(phonenumber__icontains=query) |
                Q(fullname__icontains=query)
            ).order_by('username')
        else:
            accounts = Account.objects.all().order_by('username')
        paginator = AccountCursorPagination()
        result_page = paginator.paginate_queryset(accounts, request)
        serializer = AccountSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)
    
# Get account details by userId (username)    
class LoadAccountAPIView(APIView):
    def get(self, request):
        username = request.query_params.get('username', None)
        if not username:
            return Response({"error": "Username is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            account = Account.objects.get(username=username)
            serializer = AccountSerializer(account)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Account.DoesNotExist:
            return Response({"error": "Account not found"}, status=status.HTTP_404_NOT_FOUND)
        
# Delete Account API for admin (using query params)
class DeleteAccountAPIView(APIView):
    def delete(self, request):
        username = request.query_params.get('username', None)
        if not username:
            return Response({"error": "Username is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            account = Account.objects.get(username=username)
            account.delete()
            return Response({"message": "Account deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Account.DoesNotExist:
            return Response({"error": "Account not found"}, status=status.HTTP_404_NOT_FOUND)