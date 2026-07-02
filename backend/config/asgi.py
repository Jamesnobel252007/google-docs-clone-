import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter

# ✅ CRITICAL LINE (MUST BE FIRST BEFORE ANY DJANGO IMPORT)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

django_asgi_app = get_asgi_application()

from documents.routing import websocket_urlpatterns
from collaboration.middleware import JWTAuthMiddleware

application = ProtocolTypeRouter({
    "http": django_asgi_app,

    "websocket": JWTAuthMiddleware(
        URLRouter(websocket_urlpatterns)
    ),
})