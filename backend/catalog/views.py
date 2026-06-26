
# Outils de Django REST Framework pour créer les routes API.
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

# Permission réservée au bibliothécaire et à l’administrateur.
from accounts.permissions import IsLibrarianOrAdministrator

# Modèles du catalogue.
from .models import Author, Book, BookCopy, Category

# Sérialiseurs qui transforment les données en JSON.
from .serializers import (
    AuthorSerializer,
    BookCopySerializer,
    BookSerializer,
    CategorySerializer,
)


class CategoryViewSet(viewsets.ModelViewSet):
    """
    Permet de consulter et de gérer les catégories.
    """

    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        # Tous les utilisateurs connectés peuvent consulter.
        if self.action in ("list", "retrieve"):
            permission_classes = [IsAuthenticated]
        else:
            # Seul le personnel peut modifier les catégories.
            permission_classes = [
                IsLibrarianOrAdministrator
            ]

        return [
            permission()
            for permission in permission_classes
        ]


class AuthorViewSet(viewsets.ModelViewSet):
    """
    Permet de consulter et de gérer les auteurs.
    """

    queryset = Author.objects.all()
    serializer_class = AuthorSerializer

    def get_permissions(self):
        # Tous les utilisateurs connectés peuvent consulter.
        if self.action in ("list", "retrieve"):
            permission_classes = [IsAuthenticated]
        else:
            # Seul le personnel peut modifier les auteurs.
            permission_classes = [
                IsLibrarianOrAdministrator
            ]

        return [
            permission()
            for permission in permission_classes
        ]


class BookViewSet(viewsets.ModelViewSet):
    """
    Permet de consulter et de gérer les livres.
    """

    queryset = (
        Book.objects
        .select_related("category")
        .prefetch_related("authors")
    )

    serializer_class = BookSerializer

    # Champs utilisables pour filtrer les livres.
    filterset_fields = (
        "category",
        "publication_year",
    )

    # Champs utilisés par la recherche.
    search_fields = (
        "title",
        "isbn",
        "publisher",
        "authors__first_name",
        "authors__last_name",
    )

    # Champs utilisables pour trier les résultats.
    ordering_fields = (
        "title",
        "publication_year",
        "created_at",
    )

    # Tri par défaut selon le titre.
    ordering = ("title",)

    def get_permissions(self):
        # Tous les utilisateurs connectés peuvent consulter.
        if self.action in ("list", "retrieve"):
            permission_classes = [IsAuthenticated]
        else:
            # Seul le personnel peut modifier les livres.
            permission_classes = [
                IsLibrarianOrAdministrator
            ]

        return [
            permission()
            for permission in permission_classes
        ]


class BookCopyViewSet(viewsets.ModelViewSet):
    """
    Permet de gérer les exemplaires physiques des livres.
    """

    queryset = BookCopy.objects.select_related("book")
    serializer_class = BookCopySerializer

    # Seul le personnel peut gérer les exemplaires.
    permission_classes = [IsLibrarianOrAdministrator]

    @action(
        detail=False,
        methods=["get"],
        url_path="available",
    )
    def available_copies(self, request):
        """
        Retourne uniquement les exemplaires disponibles.

        Cette route sera utilisée dans le formulaire
        de création d’un emprunt.
        """

        # Sélectionne seulement les exemplaires disponibles.
        copies = self.get_queryset().filter(
            status=BookCopy.Status.DISPONIBLE,
        )

        # Transforme les exemplaires en données JSON.
        serializer = self.get_serializer(
            copies,
            many=True,
        )

        return Response(serializer.data)

