from django.db import models

# Create your models here.
from django.db import models
from django.conf import settings
from documents.models import document


class Collaborator(models.Model):

    ROLE_CHOICES = [
        ("viewer", "Viewer"),
        ("editor", "Editor"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    document = models.ForeignKey(
        document,
        on_delete=models.CASCADE,
        related_name="collaborators"
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES
    )

    class Meta:
        unique_together = ("user", "document")