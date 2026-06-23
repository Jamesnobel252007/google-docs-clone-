from django.urls import path
from .views import (
    ShareDocumentView,
    CollaboratorListView,
    SharedDocumentsView
)

urlpatterns = [
    path("share/", ShareDocumentView.as_view()),
    path("collaborators/", CollaboratorListView.as_view()),
    path(
    "shared-documents/",
    SharedDocumentsView.as_view()
),
]