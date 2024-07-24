from django.contrib import admin
from .models import User, Profile

# Register your models here.


class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email']

    search_fields=['username','email']

class ProfileAdmin(admin.ModelAdmin):
    list_editable = ['verified']
    list_display = ['user', 'fullname', 'verified']

    search_fields=['fullname',]


admin.site.register(User, UserAdmin)
admin.site.register(Profile, ProfileAdmin)
