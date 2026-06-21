from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import document
from .serializers import DocumentSerializer


class DocumentViewSet(viewsets.ModelViewSet):

    serializer_class = DocumentSerializer

    permission_classes = [
        IsAuthenticated
    ]

    def get_queryset(self):

        return document.objects.filter(
            owner=self.request.user
        )

    def perform_create(self, serializer):

        serializer.save(
            owner=self.request.user
        )