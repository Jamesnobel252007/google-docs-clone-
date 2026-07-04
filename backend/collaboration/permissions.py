# collaboration/permissions.py

from rest_framework.permissions import BasePermission
from collaboration.models import Collaborator


class IsOwnerOrCollaborator(BasePermission):
    """
    Permission system for collaborative documents.

    Rules:
    - Owner: full access
    - Editor: read + write
    - Viewer: read-only
    """

    def is_owner(self, user, obj):
        return obj.owner == user

    def get_collaborator(self, user, obj):
        return Collaborator.objects.filter(
            user=user,
            document=obj
        ).first()

    def has_object_permission(self, request, view, obj):

        print("-------------")
        print("METHOD:", request.method)
        print("REQUEST USER:", request.user)
        print("OWNER:", obj.owner)

        collab = self.get_collaborator(request.user, obj)

        print("COLLAB:", collab)

        if collab:
            print("ROLE:", collab.role)

        if self.is_owner(request.user, obj):
            print("OWNER ACCESS")
            return True

        if not collab:
            print("NO COLLAB ACCESS")
            return False

        if request.method in ["GET", "HEAD", "OPTIONS"]:
            print("READ ACCESS")
            return True

        if request.method in ["PUT", "PATCH"]:
            print("EDITOR ACCESS")
            return collab.role == "editor"

        if request.method == "DELETE":
            print("DELETE DENIED")
            return False

        return False