from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import CurrentUserView, UserManagementViewSet


router = DefaultRouter()
router.register(
    "users",
    UserManagementViewSet,
    basename="user",
)

urlpatterns = [
    path("me/", CurrentUserView.as_view(), name="current-user"),
    path("", include(router.urls)),
]