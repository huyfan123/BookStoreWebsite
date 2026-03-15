from django.contrib import admin
from .models import Account

class AccountAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'fullname', 'phonenumber', 'role')
    search_fields = ('username', 'email', 'fullname', 'role')
    list_filter = ('role',)
    ordering = ('username',)

admin.site.register(Account, AccountAdmin)