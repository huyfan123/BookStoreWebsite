from django.db import models

class Account(models.Model):
    username = models.CharField(max_length=50, unique=True, null=False, primary_key=True)
    password = models.CharField(max_length=255, null=False)
    email = models.CharField(max_length=100, unique=True, null=False)
    fullname = models.CharField(max_length=100, null=False)
    phonenumber = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    role = models.CharField(
        max_length=5,  # 'admin' or 'user', so max_length=5 is enough
        choices=[
            ('admin', 'Admin'),
            ('user', 'User'),
        ],
        default='user'
    )

    class Meta:
        managed = False  # Use this if the table already exists and Django shouldn't manage it
        db_table = 'accounts'  # Name of the table in your database

    def __str__(self):
        return self.username