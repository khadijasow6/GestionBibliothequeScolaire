from django.db import transaction
from django.utils import timezone
from rest_framework import serializers, viewsets

from accounts.permissions import IsLibrarianOrAdministrator
from catalog.models import BookCopy

from .models import Loan
from .serializers import LoanSerializer


class LoanViewSet(viewsets.ModelViewSet):
    queryset = Loan.objects.select_related(
        "student",
        "book_copy",
        "book_copy__book",
        "created_by",
    )
    serializer_class = LoanSerializer
    permission_classes = [IsLibrarianOrAdministrator]

    def perform_create(self, serializer):
        student = serializer.validated_data["student"]
        selected_copy = serializer.validated_data["book_copy"]
        due_at = serializer.validated_data["due_at"]

        if due_at <= timezone.now():
            raise serializers.ValidationError({
                "due_at": "La date limite doit être dans le futur."
            })

        active_statuses = [
            Loan.Status.EN_COURS,
            Loan.Status.EN_RETARD,
        ]

        active_loans_count = Loan.objects.filter(
            student=student,
            status__in=active_statuses,
        ).count()

        if active_loans_count >= 3:
            raise serializers.ValidationError(
                "Cet élève possède déjà trois emprunts actifs."
            )

        if Loan.objects.filter(
            student=student,
            status=Loan.Status.EN_RETARD,
        ).exists():
            raise serializers.ValidationError(
                "Cet élève possède un emprunt en retard."
            )

        with transaction.atomic():
            book_copy = BookCopy.objects.select_for_update().get(
                pk=selected_copy.pk
            )

            if book_copy.status != BookCopy.Status.DISPONIBLE:
                raise serializers.ValidationError(
                    "Cet exemplaire n’est plus disponible."
                )

            serializer.save(
                created_by=self.request.user,
                book_copy=book_copy,
                status=Loan.Status.EN_COURS,
            )

            book_copy.status = BookCopy.Status.EMPRUNTE
            book_copy.save(update_fields=["status", "updated_at"])