from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib import admin

from documents.views import DocumentViewSet

router = DefaultRouter()
router.register(r"documents", DocumentViewSet, basename="documents")

urlpatterns = [
    path("admin/", admin.site.urls),

    path("api/users/", include("users.urls")),

    path("api/token/", TokenObtainPairView.as_view()),
    path("api/token/refresh/", TokenRefreshView.as_view()),

    # IMPORTANT: ONLY ONE API ROUTER ENTRY
    path("api/", include(router.urls)),
]