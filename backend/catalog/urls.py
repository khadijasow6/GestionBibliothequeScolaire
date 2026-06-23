from rest_framework.routers import DefaultRouter

from .views import AuthorViewSet, BookViewSet, CategoryViewSet


router = DefaultRouter()
router.register("categories", CategoryViewSet, basename="category")
router.register("authors", AuthorViewSet, basename="author")
router.register("books", BookViewSet, basename="book")

urlpatterns = router.urls