from rest_framework import serializers

from .models import Author, Book, BookCopy, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = (
            "id",
            "name",
            "description",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
        )


class AuthorSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Author
        fields = (
            "id",
            "first_name",
            "last_name",
            "full_name",
            "biography",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "full_name",
            "created_at",
            "updated_at",
        )

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"


class BookSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(
        source="category.name",
        read_only=True,
    )

    author_names = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = (
            "id",
            "title",
            "isbn",
            "description",
            "publication_year",
            "publisher",
            "category",
            "category_name",
            "authors",
            "author_names",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "category_name",
            "author_names",
            "created_at",
            "updated_at",
        )

    def get_author_names(self, obj):
        return [
            f"{author.first_name} {author.last_name}"
            for author in obj.authors.all()
        ]


class BookCopySerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(
        source="book.title",
        read_only=True,
    )

    status_display = serializers.CharField(
        source="get_status_display",
        read_only=True,
    )

    condition_display = serializers.CharField(
        source="get_condition_display",
        read_only=True,
    )

    class Meta:
        model = BookCopy
        fields = (
            "id",
            "book",
            "book_title",
            "inventory_code",
            "status",
            "status_display",
            "condition",
            "condition_display",
            "acquisition_date",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "book_title",
            "status_display",
            "condition_display",
            "created_at",
            "updated_at",
        )