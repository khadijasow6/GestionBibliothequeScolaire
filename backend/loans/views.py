
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import serializers, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from accounts.permissions import (
    IsLibrarianOrAdministrator,
    IsStudent,
)
from catalog.models import BookCopy

from .models import Loan
from .serializers import LoanSerializer
from .services import update_overdue_loans


class LoanViewSet(viewsets.ModelViewSet):
    queryset = Loan.objects.select_related(
        "student",
        "book_copy",
        "book_copy__book",
        "created_by",
    )
    serializer_class = LoanSerializer
    permission_classes = [IsLibrarianOrAdministrator]

    def get_queryset(self):
        """
        Met à jour les retards avant de retourner les emprunts.
        """
        update_overdue_loans()
        return super().get_queryset()

    @action(
        detail=False,
        methods=["get"],
        url_path="my-loans",
        permission_classes=[IsStudent],
    )
    
    @action(
        detail=False,
        methods=["get"],
        url_path="active",
    )
    def active_loans(self, request):
        loans = self.get_queryset().filter(
            status__in=[
                Loan.Status.EN_COURS,
                Loan.Status.EN_RETARD,
            ],
        )

        serializer = self.get_serializer(
            loans,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


    def my_loans(self, request):
        """
        Permet à un élève de consulter uniquement ses emprunts.
        """
        loans = self.get_queryset().filter(
            student=request.user,
        )

        serializer = self.get_serializer(
            loans,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    @action(
        detail=False,
        methods=["get"],
        url_path="overdue",
    )
    def overdue_loans(self, request):
        """
        Retourne la liste des emprunts en retard.
        """
        loans = self.get_queryset().filter(
            status=Loan.Status.EN_RETARD,
        )

        serializer = self.get_serializer(
            loans,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    def perform_create(self, serializer):
        """
        Enregistre un emprunt en appliquant les règles métier.
        """
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

        has_overdue_loan = Loan.objects.filter(
            student=student,
            status=Loan.Status.EN_RETARD,
        ).exists()

        if has_overdue_loan:
            raise serializers.ValidationError(
                "Cet élève possède un emprunt en retard."
            )

        with transaction.atomic():
            book_copy = get_object_or_404(
                BookCopy.objects.select_for_update(),
                pk=selected_copy.pk,
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
            book_copy.save(
                update_fields=[
                    "status",
                    "updated_at",
                ]
            )

    @action(
        detail=True,
        methods=["post"],
        url_path="return",
    )
    def return_book(self, request, pk=None):
        """
        Enregistre le retour d’un livre.
        """
        with transaction.atomic():
            loan = get_object_or_404(
                Loan.objects
                .select_for_update()
                .select_related("book_copy"),
                pk=pk,
            )

            if loan.status == Loan.Status.RETOURNE:
                return Response(
                    {
                        "detail": "Ce livre a déjà été retourné."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if loan.status == Loan.Status.PERDU:
                return Response(
                    {
                        "detail": (
                            "Un livre déclaré perdu ne peut pas "
                            "être retourné."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            loan.returned_at = timezone.now()
            loan.status = Loan.Status.RETOURNE
            loan.save(
                update_fields=[
                    "returned_at",
                    "status",
                    "updated_at",
                ]
            )

            book_copy = loan.book_copy
            book_copy.status = BookCopy.Status.DISPONIBLE
            book_copy.save(
                update_fields=[
                    "status",
                    "updated_at",
                ]
            )

        serializer = self.get_serializer(loan)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

