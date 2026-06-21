from rest_framework import serializers
from .models import user 

class UserSerializers(serializers.ModelSerializer):
    class Meta:
        model = user

        fields= [
            "id",
            "username",

            "email"
        ]