from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Document
from .serializers import DocumentSerializer


class DocumentViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer

    def get_queryset(self):
        user = self.request.user
        return Document.objects.filter(owner=user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    # ⭐ FAVORITE TOGGLE
    @action(detail=True, methods=["patch"])
    def favorite(self, request, pk=None):
        doc = self.get_object()
        doc.is_favorite = not doc.is_favorite
        doc.save()
        return Response({"status": "ok", "is_favorite": doc.is_favorite})

    # 🗑️ MOVE TO TRASH
    @action(detail=True, methods=["patch"])
    def trash(self, request, pk=None):
        doc = self.get_object()
        doc.is_trashed = True
        doc.save()
        return Response({"status": "moved to trash"})

    # ♻️ RESTORE
    @action(detail=True, methods=["patch"])
    def restore(self, request, pk=None):
        doc = self.get_object()
        doc.is_trashed = False
        doc.save()
        return Response({"status": "restored"})

    # ❌ DELETE FOREVER
    @action(detail=True, methods=["delete"])
    def delete_forever(self, request, pk=None):
        doc = self.get_object()
        doc.delete()
        return Response({"status": "deleted forever"})
    

    
from rest_framework.decorators import api_view

@api_view(["GET"])
def shared_to_me(request):
    docs = Document.objects.filter(collaborator__user=request.user)
    return Response(DocumentSerializer(docs, many=True).data)

@api_view(["GET"])
def shared_by_me(request):
    docs = Document.objects.filter(owner=request.user)
    return Response(DocumentSerializer(docs, many=True).data)