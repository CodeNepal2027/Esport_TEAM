# Backend/Client/auth_backend.py

from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

User = get_user_model()


class TenantAuthBackend(ModelBackend):
    """
    Authenticates against the tenant DB.
    Used by /tenant-admin/ only.
    """

    def authenticate(self, request, username=None, password=None, **kwargs):
        if username is None:
            username = kwargs.get(User.USERNAME_FIELD)
        if username is None or password is None:
            return None

        try:
            user = User.objects.using('tenant').get(
                **{User.USERNAME_FIELD: username}
            )
        except User.DoesNotExist:
            User().set_password(password)   # timing-attack mitigation
            return None

        if user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None

    def get_user(self, user_id):
        try:
            return User.objects.using('tenant').get(pk=user_id)
        except User.DoesNotExist:
            return None