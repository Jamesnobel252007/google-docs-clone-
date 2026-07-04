from django.db import models

# Create your models here.
from django.db import models
from django.conf import settings

class Document(models.Model):

    is_favorite = models.BooleanField(default=False)
    is_trashed = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)

    title = models.CharField(max_length=255)

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    content = models.TextField(
        blank=True,
        default=""
    )

    created_at = models.DateTimeField(
        auto_now_add= True
    )

    updated_at = models.DateTimeField(
        auto_now =True
    )

    def __str__(self):
        return self.title