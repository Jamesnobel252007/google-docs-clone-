from rest_framework import serializers
from .models import Document  # also fix casing if needed


from rest_framework.response import Response

class DocumentSerializer(serializers.ModelSerializer):

    is_favorite = serializers.BooleanField(required=False)
    is_trashed = serializers.BooleanField(required=False)
    is_deleted = serializers.BooleanField(required=False)

    class Meta:
        model = Document
        fields = [
            "id",
            "title",
            "content",
            "owner",
            "updated_at",

            # ADD THESE (IMPORTANT)
            "is_favorite",
            "is_trashed",
            "is_deleted",
        ]