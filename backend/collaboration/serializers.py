

from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Collaborator

User = get_user_model()


class CollaboratorSerializer(serializers.ModelSerializer):
    email = serializers.CharField(source="user.email")

    class Meta:
        model = Collaborator
        fields = ["email", "role"]


class DocumentAccessSerializer(serializers.Serializer):
    owner = serializers.CharField()
    collaborators = CollaboratorSerializer(many=True)