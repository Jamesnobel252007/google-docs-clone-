from rest_framework import serializers
from .models import Document

class DocumentSerializer(serializers.ModelSerializer):

    owner = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Document
        fields = "__all__"