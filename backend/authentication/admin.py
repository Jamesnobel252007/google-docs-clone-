from django.contrib import admin
from .models import UserProfile


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "email_notifications",
        "document_notifications",
        "mention_notifications",
    )

    search_fields = (
        "user__username",
        "user__email",
    )