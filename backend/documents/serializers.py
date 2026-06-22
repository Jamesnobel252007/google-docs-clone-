from rest_framework import serializers
from .models import document

class DocumentSerializer(serializers.ModelSerializer):

    class Meta:
        model = document
        fields = "__all__"
        read_only_fields = ["owner"]