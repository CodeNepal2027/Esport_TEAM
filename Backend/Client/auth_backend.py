# # Backend/Client/auth_backend.py

# from django.contrib.auth.backends import ModelBackend
# from django.contrib.auth import get_user_model

# User = get_user_model()


# class TenantAuthBackend(ModelBackend):
#     """
#     Authenticates against the tenant DB.
#     Used by /tenant-admin/ only.
#     """

#     def authenticate(self, request, username=None, password=None, **kwargs):
#         if username is None:
#             username = kwargs.get(User.USERNAME_FIELD)
#         if username is None or password is None:
#             return None

#         try:
#             user = User.objects.using('tenant').get(
#                 **{User.USERNAME_FIELD: username}
#             )
#         except User.DoesNotExist:
#             User().set_password(password)   # timing-attack mitigation
#             return None

#         if user.check_password(password) and self.user_can_authenticate(user):
#             return user
#         return None

#     def get_user(self, user_id):
#         try:
#             return User.objects.using('tenant').get(pk=user_id)
#         except User.DoesNotExist:
#             return None



## ***************************** [ TENANT MASTER DB GUARD (2026/10/03) ] 
# Backend/Client/auth_backend.py

import logging

from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

User = get_user_model()
logger = logging.getLogger(__name__)


class TenantAuthBackend(ModelBackend):
    """
    Authenticates against the tenant DB.

    Restricts itself to /tenant-admin/ so it can never authenticate
    a login attempt at /admin/ (the master admin). Without this guard,
    a tenant user whose credentials match a row in the tenant DB would
    be logged into the master admin, because Django tries every
    authentication backend in order and stops at the first success.
    """

    def authenticate(self, request, username=None, password=None, **kwargs):
        # ---- PATH GUARD ----
        # Only authenticate requests to the tenant admin.
        # `request` may be None when called from the shell / management
        # commands; in those cases we allow it (used for tests).
        if request is not None and not request.path.startswith('/tenant-admin/'):
            return None
        # --------------------

        if username is None:
            username = kwargs.get(User.USERNAME_FIELD)
        if username is None or password is None:
            return None

        try:
            user = User.objects.using('tenant').get(
                **{User.USERNAME_FIELD: username}
            )
        except User.DoesNotExist:
            # Timing-attack mitigation — run the password hasher anyway
            User().set_password(password)
            return None

        if user.check_password(password) and self.user_can_authenticate(user):
            logger.info(
                f"[auth] TenantAuthBackend authenticated '{username}' for /tenant-admin/"
            )
            return user

        return None

    def get_user(self, user_id):
        try:
            return User.objects.using('tenant').get(pk=user_id)
        except User.DoesNotExist:
            return None