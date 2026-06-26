from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from collaboration.models import Collaborator
from .models import document
from .serializers import DocumentSerializer
from rest_framework.viewsets import ModelViewSet
from collaboration.permissions import IsOwnerOrCollaborator
from rest_framework.decorators import action
from rest_framework.response import Response


class DocumentViewSet(ModelViewSet):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrCollaborator]

    def get_queryset(self):
        return document.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=["GET"], permission_classes=[IsAuthenticated])
    def access(self, request, pk=None):

        doc = self.get_object()

        collaborators = Collaborator.objects.filter(document=doc)

        return Response({

            "document": {
        "id": doc.id,
        "title": doc.title,
        "content": doc.content,
    },
            "owner": doc.owner.email,
            "collaborators": [
                {
                    "email": c.user.email,
                    "role": c.role
                }
                for c in collaborators
            ]
        })