from rest_framework import serializers

from accounts.models import User
from catalog.models import BookCopy

from .models import Loan


class LoanSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()

    book_title = serializers.CharField(
        source="book_copy.book.title",
        read_only=True,
    )

    inventory_code = serializers.CharField(
        source="book_copy.inventory_code",
        read_only=True,
    )

    status_display = serializers.CharField(
        source="get_status_display",
        read_only=True,
    )

    created_by_name = serializers.CharField(
        source="created_by.username",
        read_only=True,
    )

    class Meta:
        model = Loan
        fields = (
            "id",
            "student",
            "student_name",
            "book_copy",
            "book_title",
            "inventory_code",
            "borrowed_at",
            "due_at",
            "returned_at",
            "status",
            "status_display",
            "created_by",
            "created_by_name",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "student_name",
            "book_title",
            "inventory_code",
            "borrowed_at",
            "returned_at",
            "status",
            "status_display",
            "created_by",
            "created_by_name",
            "created_at",
            "updated_at",
        )

    def get_student_name(self, obj):
        full_name = obj.student.get_full_name()
        return full_name or obj.student.username

    def validate_student(self, student):
        if student.role != User.Role.ELEVE:
            raise serializers.ValidationError(
                "L’utilisateur sélectionné doit être un élève."
            )

        if not student.is_active:
            raise serializers.ValidationError(
                "Le compte de cet élève est désactivé."
            )

        return student

    def validate_book_copy(self, book_copy):
        if book_copy.status != BookCopy.Status.DISPONIBLE:
            raise serializers.ValidationError(
                "Cet exemplaire n’est pas disponible."
            )

        return book_copy