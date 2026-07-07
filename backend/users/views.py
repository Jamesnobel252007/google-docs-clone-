from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import User


class RegisterView(APIView):

    def post(self, request):

        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")

        if not username or not email or not password:
            return Response(
                {"error": "All fields are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "Username already exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(email=email).exists():
            return Response(
                {"error": "Email already exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

        User.objects.create_user(
            username=username,
            email=email,
            password=password
        )

        return Response(
            {"message": "User created successfully"},
            status=status.HTTP_201_CREATED
        )




class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        return Response({
            "id": user.id,
            "username": user.username,
            "full_name": user.username,   # display username as full name
            "email": user.email,
        })

    def patch(self, request):
        user = request.user

        username = request.data.get("username")
        email = request.data.get("email")

        if username:
            if User.objects.exclude(id=user.id).filter(username=username).exists():
                return Response(
                    {"error": "Username already exists"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            user.username = username

        if email:
            if User.objects.exclude(id=user.id).filter(email=email).exists():
                return Response(
                    {"error": "Email already exists"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            user.email = email

        user.save()

        return Response({
            "id": user.id,
            "username": user.username,
            "full_name": user.username,
            "email": user.email,
            "message": "Profile updated successfully",
        })