from rest_framework.routers import DefaultRouter

from .views import (
    AuthorViewSet,
    BookCopyViewSet,
    BookViewSet,
    CategoryViewSet,
)


router = DefaultRouter()
router.register("categories", CategoryViewSet, basename="category")
router.register("authors", AuthorViewSet, basename="author")
router.register("books", BookViewSet, basename="book")
router.register("book-copies", BookCopyViewSet, basename="book-copy")

urlpatterns = router.urls