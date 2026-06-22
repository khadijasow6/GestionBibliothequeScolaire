from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        ELEVE = "ELEVE", "Élève"
        BIBLIOTHECAIRE = "BIBLIOTHECAIRE", "Bibliothécaire"
        ADMINISTRATEUR = "ADMINISTRATEUR", "Administrateur"

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.ELEVE,
    )

    matricule = models.CharField(
        max_length=50,
        unique=True,
        null=True,
        blank=True,
    )

    def __str__(self):
        return f"{self.username} - {self.get_role_display()}"


