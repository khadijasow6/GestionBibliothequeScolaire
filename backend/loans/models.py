from django.conf import settings
from django.db import models

from catalog.models import BookCopy


class Loan(models.Model):
    class Status(models.TextChoices):
        EN_COURS = "EN_COURS", "En cours"
        RETOURNE = "RETOURNE", "Retourné"
        EN_RETARD = "EN_RETARD", "En retard"
        PERDU = "PERDU", "Perdu"

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="loans",
        verbose_name="Élève",
    )

    book_copy = models.ForeignKey(
        BookCopy,
        on_delete=models.PROTECT,
        related_name="loans",
        verbose_name="Exemplaire",
    )

    borrowed_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date d’emprunt",
    )

    due_at = models.DateTimeField(
        verbose_name="Date limite de retour",
    )

    returned_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Date de retour",
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.EN_COURS,
        verbose_name="Statut",
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="created_loans",
        verbose_name="Enregistré par",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Créé le",
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Modifié le",
    )

    class Meta:
        ordering = ["-borrowed_at"]
        verbose_name = "Emprunt"
        verbose_name_plural = "Emprunts"

    def __str__(self):
        return f"{self.student.username} - {self.book_copy.book.title}"