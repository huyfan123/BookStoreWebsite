from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Account
from .serializers import AccountSerializer
import json

# Fetch all accounts
@api_view(['GET'])
def account_list(request):
    accounts = Account.objects.all().values()
    return Response(accounts, status=status.HTTP_200_OK)

# Add a new account
@api_view(['POST'])
def create_account(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            new_account = Account(
                username=data.get('username'),
                password=data.get('password'),  # In a real app, hash the password!
                email=data.get('email'),
                fullname=data.get('fullname'),
                phonenumber=data.get('phonenumber'),
                address=data.get('address'), 
                role=data.get('role', 'user')  # Default role is 'user'
            )
            new_account.save()
            return JsonResponse({'message': 'Account created successfully'}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
# Login account    
@csrf_exempt
def login(request):
    if request.method == 'POST':
        try:
            # Parse JSON request body
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            
            # Check if the account exists
            try:
                account = Account.objects.get(username=username)
            except Account.DoesNotExist:
                return JsonResponse({'error': 'Invalid username or password'}, status=401)
            
            # Verify the password (in production, use hashed passwords)
            if account.password != password:
                return JsonResponse({'error': 'Invalid username or password'}, status=401)

            # If credentials are valid, return a success response
            return JsonResponse({'username': account.username,"fullname": account.fullname, "email": account.email, "phonenumber": account.phonenumber,"address":account.address,'role': account.role}, status=200)
        
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

# Search Account API for admin
class SearchAccountAPIView(APIView):
    def get(self, request):
        filters = {}
        username = request.query_params.get('username', None)
        email = request.query_params.get('email', None)
        phonenumber = request.query_params.get('phonenumber', None)
        fullname = request.query_params.get('fullname', None)

        if username:
            filters['username__icontains'] = username
        if email:
            filters['email__icontains'] = email
        if phonenumber:
            filters['phonenumber__icontains'] = phonenumber
        if fullname:
            filters['fullname__icontains'] = fullname

        accounts = Account.objects.filter(**filters)
        serializer = AccountSerializer(accounts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

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