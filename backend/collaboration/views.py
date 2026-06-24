from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from users.models import User
from documents.models import document
from .models import Collaborator
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated

from .serializers import CollaboratorSerializer

from documents.serializers import DocumentSerializer
from rest_framework.permissions import IsAuthenticated



class ShareDocumentView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        doc = document.objects.get(
            id=request.data["document_id"]
        )

        if doc.owner != request.user:
            return Response(
                {"error": "Not owner"},
                status=403
            )

        user = User.objects.get(
            email=request.data["email"]
        )

        Collaborator.objects.create(
            user=user,
            document=doc,
            role=request.data["role"]
        )

        return Response({
            "message": "Document shared"
        })
    

class CollaboratorListView(ListAPIView):

    serializer_class = CollaboratorSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Collaborator.objects.all()
    


class SharedDocumentsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        collaborations = Collaborator.objects.filter(
            user=request.user
        )

        documents = []

        for collaboration in collaborations:
            documents.append(
                collaboration.document
            )

        serializer = DocumentSerializer(
            documents,
            many=True
        )

        return Response(serializer.data)
    

