import json

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async



from users.models import User
from collaboration.models import Collaborator


class DocumentConsumer(AsyncWebsocketConsumer):

    # document_id -> {username1, username2}
    active_users = {}

    async def connect(self):
        self.document_id = self.scope["url_route"]["kwargs"]["id"]
        self.group_name = f"document_{self.document_id}"
        self.user = self.scope["user"]

        print("🔌 CONNECT CALLED")
        print("USER =", self.user)
        print("DOCUMENT =", self.document_id)

        allowed = await self.has_access()

        print("ALLOWED =", allowed)

        if not allowed:
            print("❌ ACCESS DENIED")
            await self.close(code=4003)
            return

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name,
    )

        await self.accept()

    # ✅ INIT GROUP
        if self.group_name not in self.active_users:
            self.active_users[self.group_name] = set()

        self.active_users[self.group_name].add(self.user.username)

        print("🟢 ACTIVE USERS UPDATED:", self.active_users)

    # 🔥 IMPORTANT: SEND UPDATE
        await self.send_online_users()

        print("CONNECTED")

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
        print("Sending online users to", self.user.username)

        await self.send(
        text_data=json.dumps({
            "type": "online_users",
            "users": event["users"],
        })
    )

    async def send_online_users(self):
        print("📡 send_online_users CALLED")
        print("GROUP:", self.group_name)
        print("ACTIVE USERS:", self.active_users)

        users = list(self.active_users.get(self.group_name, set()))

        await self.channel_layer.group_send(
        self.group_name,
        {
            "type": "online_users",
            "users": users,
        },
    )
        
    @database_sync_to_async
    def has_access(self):
        from documents.models import Document
        if self.user.is_anonymous:
            return False

        try:
            doc = Document.objects.get(id=self.document_id)
        except Document.DoesNotExist:
            return False

        if doc.owner == self.user:
            return True

        return Collaborator.objects.filter(
            document=doc,
            user=self.user
        ).exists()
        
   