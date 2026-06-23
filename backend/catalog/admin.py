from django.contrib import admin

from .models import Author, Book, BookCopy, Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "created_at")
    search_fields = ("name",)


@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ("first_name", "last_name")
    search_fields = ("first_name", "last_name")


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "isbn",
        "category",
        "publication_year",
    )
    list_filter = ("category", "publication_year")
    search_fields = ("title", "isbn", "authors__first_name", "authors__last_name")
    filter_horizontal = ("authors",)


@admin.register(BookCopy)
class BookCopyAdmin(admin.ModelAdmin):
    list_display = (
        "inventory_code",
        "book",
        "status",
        "condition",
    )
    list_filter = ("status", "condition")
    search_fields = ("inventory_code", "book__title")