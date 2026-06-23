from django.contrib import admin

from .models import Loan


@admin.register(Loan)
class LoanAdmin(admin.ModelAdmin):
    list_display = (
        "student",
        "book_copy",
        "borrowed_at",
        "due_at",
        "returned_at",
        "status",
        "created_by",
    )

    list_filter = (
        "status",
        "borrowed_at",
        "due_at",
    )

    search_fields = (
        "student__username",
        "student__first_name",
        "student__last_name",
        "student__matricule",
        "book_copy__inventory_code",
        "book_copy__book__title",
    )

    readonly_fields = (
        "borrowed_at",
        "created_at",
        "updated_at",
    )