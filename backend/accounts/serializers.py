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


class UserManagementSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=False,
        min_length=8,
    )

    role_display = serializers.CharField(
        source="get_role_display",
        read_only=True,
    )

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "password",
            "first_name",
            "last_name",
            "email",
            "role",
            "role_display",
            "matricule",
            "is_active",
            "date_joined",
        )
        read_only_fields = (
            "id",
            "role_display",
            "date_joined",
        )

    def validate(self, attrs):
        role = attrs.get(
            "role",
            getattr(self.instance, "role", User.Role.ELEVE),
        )
        matricule = attrs.get(
            "matricule",
            getattr(self.instance, "matricule", None),
        )

        if role == User.Role.ELEVE and not matricule:
            raise serializers.ValidationError({
                "matricule": "Le matricule est obligatoire pour un élève."
            })

        return attrs

    def create(self, validated_data):
        password = validated_data.pop("password", None)

        user = User(**validated_data)

        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()

        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)

        for field, value in validated_data.items():
            setattr(instance, field, value)

        if password:
            instance.set_password(password)

        instance.save()
        return instance