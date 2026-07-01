from django.urls import re_path
from .consumers import DocumentConsumer

print("✅ collaboration.routing loaded")

websocket_urlpatterns = [
    re_path(
        r"ws/documents/(?P<document_id>\d+)/$",
        DocumentConsumer.as_asgi(),
    ),
]



