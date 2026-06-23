from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from accounts.permissions import IsLibrarianOrAdministrator

from .models import Author, Book, Category
from .serializers import (
    AuthorSerializer,
    BookSerializer,
    CategorySerializer,
)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsLibrarianOrAdministrator]

        return [permission() for permission in permission_classes]


class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsLibrarianOrAdministrator]

        return [permission() for permission in permission_classes]


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.select_related("category").prefetch_related("authors")
    serializer_class = BookSerializer

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsLibrarianOrAdministrator]

        return [permission() for permission in permission_classes]