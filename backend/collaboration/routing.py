from django.urls import re_path
from collaboration.consumers import DocumentConsumer

websocket_urlpatterns = [
    re_path(r"ws/documents/(?P<id>\w+)/$", DocumentConsumer.as_asgi()),
]