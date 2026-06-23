from rest_framework.permissions import BasePermission

from .models import User


class IsStudent(BasePermission):
    message = "Cette action est réservée aux élèves."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == User.Role.ELEVE
        )


class IsLibrarian(BasePermission):
    message = "Cette action est réservée aux bibliothécaires."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == User.Role.BIBLIOTHECAIRE
        )


class IsAdministrator(BasePermission):
    message = "Cette action est réservée aux administrateurs."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == User.Role.ADMINISTRATEUR
        )


class IsLibrarianOrAdministrator(BasePermission):
    message = "Cette action est réservée au personnel de la bibliothèque."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role
            in (
                User.Role.BIBLIOTHECAIRE,
                User.Role.ADMINISTRATEUR,
            )
        )