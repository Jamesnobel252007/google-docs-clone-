from django.contrib import admin
from .models import Comment, CommentReply


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "document",
        "author",
        "resolved",
        "created_at",
    )

    list_filter = (
        "resolved",
        "created_at",
    )

    search_fields = (
        "content",
        "author__username",
        "document__title",
    )


@admin.register(CommentReply)
class CommentReplyAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "comment",
        "author",
        "created_at",
    )

    search_fields = (
        "content",
        "author__username",
    )