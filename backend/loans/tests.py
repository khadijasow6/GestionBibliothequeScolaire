
from datetime import timedelta

from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from accounts.models import User
from catalog.models import Book, BookCopy, Category

from .models import Loan
from .services import update_overdue_loans


class LoanTest(TestCase):
    def setUp(self):
        self.client = APIClient()

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

    def test_return_loan_updates_book_copy_status(self):
        loan = Loan.objects.create(
            student=self.student,
            book_copy=self.book_copy,
            due_at=timezone.now() + timedelta(days=7),
            status=Loan.Status.EN_COURS,
            created_by=self.admin,
        )

        self.client.force_authenticate(user=self.admin)

        response = self.client.post(
            f"/api/loans/{loan.id}/return/",
        )

        loan.refresh_from_db()
        self.book_copy.refresh_from_db()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            loan.status,
            Loan.Status.RETOURNE,
        )
        self.assertEqual(
            self.book_copy.status,
            BookCopy.Status.DISPONIBLE,
        )

