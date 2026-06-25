from django.utils import timezone

from .models import Loan


def update_overdue_loans():
    """
    Passe automatiquement à EN_RETARD les emprunts
    dont la date limite est dépassée.
    """
    return Loan.objects.filter(
        status=Loan.Status.EN_COURS,
        due_at__lt=timezone.now(),
        returned_at__isnull=True,
    ).update(
        status=Loan.Status.EN_RETARD,
        updated_at=timezone.now(),
    )