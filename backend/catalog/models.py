from django.db import models


class Category(models.Model):
    name = models.CharField(
        max_length=100,
        unique=True,
        verbose_name="Nom",
    )
    description = models.TextField(
        blank=True,
        verbose_name="Description",
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Créée le",
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Modifiée le",
    )

    class Meta:
        ordering = ["name"]
        verbose_name = "Catégorie"
        verbose_name_plural = "Catégories"

    def __str__(self):
        return self.name


class Author(models.Model):
    first_name = models.CharField(
        max_length=100,
        verbose_name="Prénom",
    )
    last_name = models.CharField(
        max_length=100,
        verbose_name="Nom",
    )
    biography = models.TextField(
        blank=True,
        verbose_name="Biographie",
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
        ordering = ["last_name", "first_name"]
        verbose_name = "Auteur"
        verbose_name_plural = "Auteurs"

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Book(models.Model):
    title = models.CharField(
        max_length=200,
        verbose_name="Titre",
    )
    isbn = models.CharField(
        max_length=13,
        unique=True,
        verbose_name="ISBN",
    )
    description = models.TextField(
        blank=True,
        verbose_name="Description",
    )
    publication_year = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name="Année de publication",
    )
    publisher = models.CharField(
        max_length=150,
        blank=True,
        verbose_name="Éditeur",
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="books",
        verbose_name="Catégorie",
    )
    authors = models.ManyToManyField(
        Author,
        related_name="books",
        verbose_name="Auteurs",
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
        ordering = ["title"]
        verbose_name = "Livre"
        verbose_name_plural = "Livres"

    def __str__(self):
        return self.title
        
class BookCopy(models.Model):
    class Status(models.TextChoices):
        DISPONIBLE = "DISPONIBLE", "Disponible"
        EMPRUNTE = "EMPRUNTE", "Emprunté"
        PERDU = "PERDU", "Perdu"
        DETERIORE = "DETERIORE", "Détérioré"

    class Condition(models.TextChoices):
        NEUF = "NEUF", "Neuf"
        BON = "BON", "Bon état"
        MOYEN = "MOYEN", "État moyen"
        MAUVAIS = "MAUVAIS", "Mauvais état"

    book = models.ForeignKey(
        Book,
        on_delete=models.CASCADE,
        related_name="copies",
        verbose_name="Livre",
    )

    inventory_code = models.CharField(
        max_length=50,
        unique=True,
        verbose_name="Code d’inventaire",
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DISPONIBLE,
        verbose_name="Statut",
    )

    condition = models.CharField(
        max_length=20,
        choices=Condition.choices,
        default=Condition.BON,
        verbose_name="État physique",
    )

    acquisition_date = models.DateField(
        null=True,
        blank=True,
        verbose_name="Date d’acquisition",
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
        ordering = ["inventory_code"]
        verbose_name = "Exemplaire"
        verbose_name_plural = "Exemplaires"

    def __str__(self):
        return f"{self.inventory_code} - {self.book.title}"        