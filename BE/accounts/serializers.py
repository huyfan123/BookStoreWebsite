from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from .models import Account
from django.contrib.auth.hashers import make_password, check_password
from django.db.models import Q

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = [
            'username', 
            'password', 
            'email', 
            'fullname', 
            'phonenumber', 
            'address', 
            'role'
        ]
        # Optionally, you can add extra kwargs to manage write-only/read-only settings
        extra_kwargs = {
            'password': {'write_only': True},  # Password should be write-only for security
        }

    def create(self, validated_data):
        # Customize the create method if needed
        # For example, you could hash passwords here if needed
        # Hash the password before saving
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Customize the update method if needed
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        return super().update(instance, validated_data)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom serializer for JWT token creation with Account model support.
    Includes the 'role' field as a custom claim in the JWT payload.
    """
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        username_or_email = attrs.get('username')
        password = attrs.get('password')

        if not username_or_email or not password:
            raise serializers.ValidationError('Username/email and password are required.')

        # Try to get account by username or email
        try:
            account = Account.objects.get(Q(username=username_or_email) | Q(email=username_or_email))
        except Account.DoesNotExist:
            raise serializers.ValidationError('Invalid username/email or password.')

        # Verify password
        if not check_password(password, account.password):
            raise serializers.ValidationError('Invalid username/email or password.')

        # Generate tokens
        refresh = RefreshToken()
        refresh['user_id'] = str(account.username)  # Add custom claim: username
        refresh['username'] = account.username
        refresh['role'] = account.role  # Add custom claim: role
        refresh['email'] = account.email
        refresh['fullname'] = account.fullname

        access = refresh.access_token
        access['user_id'] = str(account.username)
        access['username'] = account.username
        access['role'] = account.role  # Add role to access token as well
        access['email'] = account.email
        access['fullname'] = account.fullname

        return {
            'refresh': str(refresh),
            'access': str(access),
            'user': {
                'username': account.username,
                'email': account.email,
                'fullname': account.fullname,
                'phonenumber': account.phonenumber,
                'address': account.address,
                'role': account.role,
            }
        }

    @classmethod
    def get_token(cls, user):
        """
        Override the get_token method to add custom claims to the refresh token.
        """
        token = super().get_token(user)
        token['role'] = user.role if hasattr(user, 'role') else 'user'
        token['email'] = user.email if hasattr(user, 'email') else ''
        return token


class TokenRefreshResponseSerializer(serializers.Serializer):
    """
    Serializer for refresh token response, including custom claims.
    """
    access = serializers.CharField()
    refresh = serializers.CharField(required=False)


class CustomTokenRefreshSerializer(TokenRefreshSerializer):
    """
    Custom refresh serializer that works with the Account model.
    Validates the refresh token without trying to look up a user in Django's User model.
    """
    
    def validate(self, attrs):
        """
        Validate and refresh the token for the Account model.
        """
        refresh = RefreshToken(attrs['refresh'])
        
        # Add custom claims to the new access token
        access = refresh.access_token
        
        # Extract user info from the existing refresh token claims
        username = refresh.get('username')
        
        # Try to get the account to include current info
        try:
            account = Account.objects.get(username=username)
            # Update claims with current account data
            access['user_id'] = str(account.username)
            access['username'] = account.username
            access['role'] = account.role
            access['email'] = account.email
            access['fullname'] = account.fullname
        except Account.DoesNotExist:
            # If account doesn't exist, just use claims from token
            access['user_id'] = refresh.get('user_id')
            access['username'] = refresh.get('username')
            access['role'] = refresh.get('role', 'user')
            access['email'] = refresh.get('email', '')
            access['fullname'] = refresh.get('fullname', '')
        
        return {
            'access': str(access),
            'refresh': str(refresh),
        }