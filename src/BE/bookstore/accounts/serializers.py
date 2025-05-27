from rest_framework import serializers
from .models import Account
from django.contrib.auth.hashers import make_password

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