

from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Collaborator



User = get_user_model()
class CollaboratorSerializer(serializers.ModelSerializer):

    user = serializers.CharField(
        source="user.email",
        read_only=True
    )

    document = serializers.CharField(
        source="document.title",
        read_only=True
    )

    class Meta:
        model = Collaborator
        fields = [
            "id",
            "user",
            "document",
            "role"
        ]
class DocumentAccessSerializer(serializers.Serializer):
    owner = serializers.CharField()
    collaborators = CollaboratorSerializer(many=True)