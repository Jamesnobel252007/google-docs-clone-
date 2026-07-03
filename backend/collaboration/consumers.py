import json
from pydoc import doc
from xml.dom.minidom import Document
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from collaboration.models import Collaborator
from documents.models import document

class DocumentConsumer(AsyncWebsocketConsumer):

    active_users = {}

    async def connect(self):

        self.document_id = self.scope["url_route"]["kwargs"]["id"]
        self.room_group_name = f"document_{self.document_id}"

        self.user = self.scope["user"]

        has_access = await self.check_access()

        if not has_access:
            await self.close()
            return

        self.username = self.user.username

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
    )

        if self.room_group_name not in self.active_users:
            self.active_users[self.room_group_name] = set()

        self.active_users[self.room_group_name].add(self.username)

        await self.accept()

        await self.broadcast_online_users()

    async def disconnect(self, close_code):

        if self.room_group_name in self.active_users:

            self.active_users[self.room_group_name].discard(
                self.username
        )

            if len(self.active_users[self.room_group_name]) == 0:
                del self.active_users[self.room_group_name]

        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
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
    


    from channels.db import database_sync_to_async

    @database_sync_to_async
    def check_access(self):
        if self.user.is_anonymous:
            return False

        doc = document.objects.get(id=self.document_id)

        return (
        doc.owner == self.user or
        Collaborator.objects.filter(
            document=doc,
            user=self.user
        ).exists()
    )