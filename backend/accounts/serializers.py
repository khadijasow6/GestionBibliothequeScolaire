from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):
    role_display = serializers.CharField(
        source="get_role_display",
        read_only=True,
    )

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "role",
            "role_display",
            "matricule",
        )
        read_only_fields = (
            "id",
            "username",
            "role",
            "role_display",
        )