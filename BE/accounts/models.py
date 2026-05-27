from django.db import models
from django.contrib.auth.models import AbstractUser
    
class Account(AbstractUser):
    
    fullname = models.CharField(max_length=100, null=False)
    phonenumber = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    role = models.CharField(
        max_length=5,
        choices=[
            ('admin', 'Admin'),
            ('user', 'User'),
        ],
        default='user'
    )

    class Meta:
        db_table = 'accounts'

    def __str__(self):
        return self.username