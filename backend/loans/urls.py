from rest_framework.routers import DefaultRouter

from .views import LoanViewSet


router = DefaultRouter()
router.register("loans", LoanViewSet, basename="loan")

urlpatterns = router.urls