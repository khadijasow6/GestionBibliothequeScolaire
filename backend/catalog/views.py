
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from accounts.permissions import IsLibrarianOrAdministrator

from .models import Author, Book, BookCopy, Category
from .serializers import (
    AuthorSerializer,
    BookCopySerializer,
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
    queryset = (
        Book.objects
        .select_related("category")
        .prefetch_related("authors")
    )
    serializer_class = BookSerializer

    filterset_fields = (
        "category",
        "publication_year",
    )

    search_fields = (
        "title",
        "isbn",
        "publisher",
        "authors__first_name",
        "authors__last_name",
    )

    ordering_fields = (
        "title",
        "publication_year",
        "created_at",
    )

    ordering = ("title",)

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsLibrarianOrAdministrator]

        return [permission() for permission in permission_classes]


class BookCopyViewSet(viewsets.ModelViewSet):
    queryset = BookCopy.objects.select_related("book")
    serializer_class = BookCopySerializer
    permission_classes = [IsLibrarianOrAdministrator]

