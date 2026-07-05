from pydoc import doc

from django.db.models import Q

from rest_framework import viewsets
from rest_framework.decorators import action, api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Document
from .serializers import DocumentSerializer


class DocumentViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    from django.db.models import Q

    from django.db.models import Q

    def get_queryset(self):
        user = self.request.user

        queryset = Document.objects.filter(
            Q(owner=user) |
            Q(collaborators__user=user)
        ).distinct()


        filter_type = self.request.query_params.get("filter")

        if filter_type == "favorites":
            queryset = queryset.filter(is_favorite=True)

        elif filter_type == "trash":
            queryset = queryset.filter(is_trashed=True)

        return queryset

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    # ---------------- FAVORITE ----------------

    @action(detail=True, methods=["patch"])
    def favorite(self, request, pk=None):
        print("FAVORITE CALLED", pk)

        doc = self.get_object()

        doc.is_favorite = not doc.is_favorite
        doc.save()

        return Response({
        "is_favorite": doc.is_favorite
    })

    # ---------------- TRASH ----------------

    @action(detail=True, methods=["patch"])
    def trash(self, request, pk=None):
        doc = self.get_object()

        doc.is_trashed = True
        doc.save()

        return Response(DocumentSerializer(doc).data)

    # ---------------- RESTORE ----------------

    @action(detail=True, methods=["patch"])
    def restore(self, request, pk=None):
        print("RESTORE CALLED", pk)

        doc = self.get_object()
        doc.is_trashed = False
        doc.save()

        return Response({"status": "restored"})

    # ---------------- DELETE ----------------

    @action(detail=True, methods=["delete"])
    def delete_forever(self, request, pk=None):
        doc = self.get_object()
        doc.delete()

        return Response({"status": "deleted forever"})

    # ---------------- COLLABORATORS ----------------

    from collaboration.models import Collaborator

    @action(detail=True, methods=["get"])
    def collaborators(self, request, pk=None):

        document = self.get_object()

        data = [
        {
            "id": document.owner.id,
            "username": document.owner.username,
            "role": "owner",
        }
    ]

        collaborators = Collaborator.objects.filter(
        document=document
    ).select_related("user")

        for c in collaborators:
            data.append({
            "id": c.user.id,
            "username": c.user.username,
            "role": c.role,
        })

        return Response(data)


@api_view(["GET"])
def shared_to_me(request):
    docs = Document.objects.filter(collaborators__user=request.user).distinct()

    return Response(DocumentSerializer(docs, many=True).data)


@api_view(["GET"])
def shared_by_me(request):
    docs = Document.objects.filter(owner=request.user)

    return Response(DocumentSerializer(docs, many=True).data)