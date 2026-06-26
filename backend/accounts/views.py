
# Outils de Django REST Framework pour créer les vues API.
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

# Modèle utilisateur personnalisé.
from .models import User

# Permissions selon les rôles.
from .permissions import (
    IsAdministrator,
    IsLibrarianOrAdministrator,
)

# Sérialiseurs utilisés pour transformer les utilisateurs en JSON.
from .serializers import (
    UserManagementSerializer,
    UserSerializer,
)


class CurrentUserView(APIView):
    """
    Retourne les informations de l’utilisateur connecté.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Transforme l’utilisateur connecté en données JSON.
        serializer = UserSerializer(request.user)

        return Response(serializer.data)


class UserManagementViewSet(viewsets.ModelViewSet):
    """
    Permet à l’administrateur de gérer les utilisateurs.
    """

    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = UserManagementSerializer
    permission_classes = [IsAdministrator]

    @action(
        detail=False,
        methods=["get"],
        url_path="students",
        permission_classes=[IsLibrarianOrAdministrator],
    )
    def students(self, request):
        """
        Retourne uniquement les élèves actifs.

        Cette route sera utilisée dans le formulaire
        de création d’un emprunt.
        """

        students = User.objects.filter(
            role=User.Role.ELEVE,
            is_active=True,
        ).order_by("last_name", "first_name", "username")

        serializer = UserSerializer(
            students,
            many=True,
        )

        return Response(serializer.data)

