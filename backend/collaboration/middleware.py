from urllib.parse import parse_qs
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.authentication import JWTAuthentication
from channels.db import database_sync_to_async


class JWTAuthMiddleware:

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):

        scope["user"] = AnonymousUser()

        query_string = scope.get("query_string", b"").decode()
        params = parse_qs(query_string)

        token = params.get("token", [None])[0]

        if token:
            try:
                scope["user"] = await self.get_user_from_token(token)
            except Exception as e:
                print("JWT ERROR:", e)

        return await self.app(scope, receive, send)

    @database_sync_to_async
    def get_user_from_token(self, token):
        jwt = JWTAuthentication()
        validated = jwt.get_validated_token(token)
        return jwt.get_user(validated)