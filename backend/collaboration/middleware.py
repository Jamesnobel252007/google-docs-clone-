from urllib.parse import parse_qs
from channels.middleware import BaseMiddleware
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.authentication import JWTAuthentication
from asgiref.sync import sync_to_async


class JWTAuthMiddleware(BaseMiddleware):

    async def __call__(self, scope, receive, send):

        scope["user"] = AnonymousUser()

        query_string = scope["query_string"].decode()
        params = parse_qs(query_string)

        token = params.get("token", [None])[0]

        if token:
            try:
                user = await self.get_user_from_token(token)
                scope["user"] = user
            except Exception as e:
                print("JWT ERROR:", e)

        return await super().__call__(scope, receive, send)

    @sync_to_async
    def get_user_from_token(self, token):
        jwt = JWTAuthentication()
        validated = jwt.get_validated_token(token)
        return jwt.get_user(validated)