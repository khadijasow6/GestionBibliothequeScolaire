
from datetime import timedelta

from django.test import TestCase
from django.utils import timezone

from accounts.models import User
from catalog.models import Book, BookCopy, Category

from .models import Loan
from .services import update_overdue_loans


class OverdueLoanTest(TestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            username="testadmin",
            password="TestPassword123!",
            role=User.Role.ADMINISTRATEUR,
        )

        self.student = User.objects.create_user(
            username="teststudent",
            password="TestPassword123!",
            role=User.Role.ELEVE,
            matricule="TEST-001",
        )

        category = Category.objects.create(
            name="Test",
        )

        book = Book.objects.create(
            title="Livre de test",
            isbn="1234567890123",
            publication_year=2025,
            category=category,
        )

        self.book_copy = BookCopy.objects.create(
            book=book,
            inventory_code="TEST-EX-001",
            status=BookCopy.Status.EMPRUNTE,
            condition=BookCopy.Condition.BON,
        )

    def test_overdue_loan_is_updated(self):
        loan = Loan.objects.create(
            student=self.student,
            book_copy=self.book_copy,
            due_at=timezone.now() - timedelta(days=1),
            status=Loan.Status.EN_COURS,
            created_by=self.admin,
        )

        update_overdue_loans()
        loan.refresh_from_db()

        self.assertEqual(
            loan.status,
            Loan.Status.EN_RETARD,
        )

