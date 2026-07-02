import json
from channels.generic.websocket import AsyncWebsocketConsumer


class DocumentConsumer(AsyncWebsocketConsumer):

    active_users = {}

    async def connect(self):
        self.document_id = self.scope["url_route"]["kwargs"]["id"]
        self.room_group_name = f"document_{self.document_id}"

        # ✅ FIX: use scope directly (clean + reliable)
        self.user = self.scope.get("user")

        print("USER:", self.user)
        print("AUTH:", self.user.is_authenticated if self.user else None)

        self.username = (
            getattr(self.user, "username", None)
            if self.user and self.user.is_authenticated
            else "Anonymous"
        )

        # Join room
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name,
        )

        # Track user
        if self.room_group_name not in self.active_users:
            self.active_users[self.room_group_name] = set()

        self.active_users[self.room_group_name].add(self.username)

        await self.accept()

        await self.broadcast_online_users()

    async def disconnect(self, close_code):

        if self.room_group_name in self.active_users:
            self.active_users[self.room_group_name].discard(self.username)

            if not self.active_users[self.room_group_name]:
                del self.active_users[self.room_group_name]

        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name,
        )

        await self.broadcast_online_users()

    async def receive(self, text_data):
        data = json.loads(text_data)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "document_message",
                "message": data["message"],
            },
        )

    async def document_message(self, event):
        await self.send(
            text_data=json.dumps({
                "message": event["message"],
            })
        )

    async def broadcast_online_users(self):

        users = list(self.active_users.get(self.room_group_name, set()))

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "online_users",
                "users": users,
            },
        )

    async def online_users(self, event):

        await self.send(
            text_data=json.dumps({
                "type": "online_users",
                "users": event["users"],
            })
        )