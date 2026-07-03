from pydoc import doc


from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from collaboration.models import Collaborator
from .models import document
from .serializers import DocumentSerializer
from rest_framework.viewsets import ModelViewSet
from collaboration.permissions import IsOwnerOrCollaborator
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q

class DocumentViewSet(ModelViewSet):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrCollaborator]

    def get_queryset(self):

        return document.objects.filter(

        Q(owner=self.request.user)

        |

        Q(collaborators__user=self.request.user)

    ).distinct()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)



    @action(detail=True, methods=["get"])
    def collaborators(self, request, pk=None):
        doc = self.get_object()

        collaborator_list = []

    # Add owner first
        collaborator_list.append({
        "id": doc.owner.id,
        "username": doc.owner.username,
        "role": "owner",
    })

    # Add collaborators
        collaborators = Collaborator.objects.filter(document=doc)

        for c in collaborators:
            collaborator_list.append({
    "id": c.user.id,
    "username": c.user.username,
    "role": c.role,
    "collaborator_id": c.id,
})

        return Response(collaborator_list)
    
    
    @action(detail=True, methods=["delete"], url_path="remove-collaborator/(?P<user_id>[^/.]+)")
    def remove_collaborator(self, request, pk=None, user_id=None):

        doc = self.get_object()

    # Only owner can remove collaborators
        if doc.owner != request.user:
            return Response(
            {"error": "Only owner can remove collaborators"},
            status=403
        )

        if int(user_id) == doc.owner.id:
            return Response(
        {"error": "Owner cannot be removed."},
        status=400
    )
    
        collaborator = Collaborator.objects.filter(
        document=doc,
        user_id=user_id
    ).first()

        if not collaborator:
            return Response(
            {"error": "Collaborator not found"},
            status=404
        )

        collaborator.delete()

        return Response({"message": "Collaborator removed"})

# users/views.py

