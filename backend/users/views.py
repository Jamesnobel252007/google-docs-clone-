from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import User


class RegisterView(APIView):

    def post(self, req):

        email = req.data["email"]

        if User.objects.filter(email=email).exists():
            return Response(
                {"error": "Email already exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.create_user(
            username=req.data["username"],
            email=email,
            password=req.data["password"]
        )

        return Response(
            {"message": "User created"},
            status=status.HTTP_201_CREATED
        )