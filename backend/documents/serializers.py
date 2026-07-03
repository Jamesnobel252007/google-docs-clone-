from rest_framework import serializers
from .models import document  # also fix casing if needed

class DocumentSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(
        source="owner.username",
        read_only=True
    )

    class Meta:
        model = document
        fields = [
            "id",
            "title",
            "content",
            "owner",
            "owner_username",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "owner",
            "owner_username",
            "created_at",
            "updated_at",
        ]