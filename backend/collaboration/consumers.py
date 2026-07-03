import json

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

from documents.models import document
from collaboration.models import Collaborator


class DocumentConsumer(AsyncWebsocketConsumer):

    # document_id -> {username1, username2}
    active_users = {}

    async def connect(self):
        self.document_id = self.scope["url_route"]["kwargs"]["id"]
        self.group_name = f"document_{self.document_id}"

        self.user = self.scope["user"]

        allowed = await self.has_access()

        if not allowed:
            await self.close()
            return

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

        users = self.active_users.setdefault(
            self.group_name,
            set()
        )

        users.add(self.user.username)

        await self.send_online_users()

    async def disconnect(self, close_code):

        if self.group_name in self.active_users:

            self.active_users[self.group_name].discard(
                self.user.username
            )

            if len(self.active_users[self.group_name]) == 0:
                del self.active_users[self.group_name]

        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

        await self.send_online_users()

    async def receive(self, text_data):

        data = json.loads(text_data)

        if data.get("type") == "content":

            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "document_update",
                    "message": data["message"],
                    "sender": self.user.username,
                },
            )

    async def document_update(self, event):

        # Don't echo back to sender
        if event["sender"] == self.user.username:
            return

        await self.send(
            text_data=json.dumps({
                "type": "content",
                "message": event["message"],
            })
        )

    async def online_users(self, event):

        await self.send(
            text_data=json.dumps({
                "type": "online_users",
                "users": event["users"],
            })
        )

    async def send_online_users(self):

        users = list(
            self.active_users.get(
                self.group_name,
                set()
            )
        )

        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "online_users",
                "users": users,
            }
        )

    @database_sync_to_async
    def has_access(self):

        if self.user.is_anonymous:
            return False

        try:
            doc = document.objects.get(id=self.document_id)
        except document.DoesNotExist:
            return False

        if doc.owner == self.user:
            return True

        return Collaborator.objects.filter(
            document=doc,
            user=self.user
        ).exists()