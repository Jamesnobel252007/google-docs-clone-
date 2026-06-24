

from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Collaborator

User = get_user_model()


class CollaboratorSerializer(serializers.ModelSerializer):

    email = serializers.CharField(source="user.email", read_only=True)

    document_title = serializers.CharField(
        source="document.title",
        read_only=True
    )

    owner_email = serializers.CharField(
        source="document.owner.email",
        read_only=True
    )

    class Meta:
        model = Collaborator
        fields = [
            "email",
            "role",
            "document_title",
            "owner_email"
        ]


class DocumentAccessSerializer(serializers.Serializer):
    owner = serializers.CharField()
    collaborators = CollaboratorSerializer(many=True)