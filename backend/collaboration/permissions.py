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

        user = request.user

        # 1. Owner override (highest priority)
        if self.is_owner(user, obj):
            return True

        # 2. Check collaboration
        collab = self.get_collaborator(user, obj)

        # If no access at all
        if not collab:
            return False

        # 3. SAFE READ ACCESS (GET, HEAD, OPTIONS)
        if request.method in ["GET", "HEAD", "OPTIONS"]:
            return True

        # 4. WRITE ACCESS (UPDATE)
        if request.method in ["PUT", "PATCH"]:
            return collab.role == "editor"

        # 5. DELETE RULE
        if request.method == "DELETE":
            return False  # only owner can delete

        # Default deny
        return False