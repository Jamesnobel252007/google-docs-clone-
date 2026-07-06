from django.db import models

# Create your models here.
from django.db import models
from django.conf import settings

from users.models import User

class Document(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()

    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="documents")

    is_favorite = models.BooleanField(default=False)
    is_trashed = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    

    def __str__(self):
        return self.title