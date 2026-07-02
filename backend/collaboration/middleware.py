from urllib.parse import parse_qs
from channels.middleware import BaseMiddleware
from rest_framework_simplejwt.authentication import JWTAuthentication


class JWTAuthMiddleware(BaseMiddleware):

    async def __call__(self, scope, receive, send):

        # ✅ import here (NOT at top)
        from django.contrib.auth.models import AnonymousUser

        scope["user"] = AnonymousUser()

        query_string = scope["query_string"].decode()
        params = parse_qs(query_string)

        token = params.get("token", [None])[0]

        if token:
            try:
                validated = JWTAuthentication().get_validated_token(token)
                user = JWTAuthentication().get_user(validated)
                scope["user"] = user
            except Exception as e:
                print("JWT ERROR:", e)

        return await super().__call__(scope, receive, send)