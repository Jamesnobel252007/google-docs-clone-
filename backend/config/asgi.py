from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter

from documents.routing import websocket_urlpatterns
from collaboration.middleware import JWTAuthMiddleware

application = ProtocolTypeRouter({
    "http": get_asgi_application(),

    "websocket": JWTAuthMiddleware(
        URLRouter(websocket_urlpatterns)
    ),
})