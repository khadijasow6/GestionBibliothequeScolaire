
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import User
from accounts.permissions import IsLibrarianOrAdministrator
from catalog.models import Book, BookCopy
from loans.models import Loan
from loans.services import update_overdue_loans


class DashboardStatsView(APIView):
    permission_classes = [IsLibrarianOrAdministrator]

    def get(self, request):
        update_overdue_loans()

        data = {
            "total_books": Book.objects.count(),
            "available_copies": BookCopy.objects.filter(
                status=BookCopy.Status.DISPONIBLE,
            ).count(),
            "active_loans": Loan.objects.filter(
                status__in=[
                    Loan.Status.EN_COURS,
                    Loan.Status.EN_RETARD,
                ],
            ).count(),
            "overdue_loans": Loan.objects.filter(
                status=Loan.Status.EN_RETARD,
            ).count(),
            "total_students": User.objects.filter(
                role=User.Role.ELEVE,
            ).count(),
        }

        return Response(data)

