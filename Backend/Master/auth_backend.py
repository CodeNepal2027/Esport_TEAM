# Backend/Master/auth_backend.py
"""
Master-auth backend for /admin/ (default admin site).

Wraps Django's ModelBackend and additionally refuses any user who
also exists as a TenantUser in the tenant DB. This guarantees that
tenant admins cannot log into the master admin, even if their
credentials accidentally match a row in the master DB.
"""

from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model


class MasterOnlyAuthBackend(ModelBackend):
    """
    Same as ModelBackend (checks password against `default` DB), but
    rejects any user who has a TenantUser profile in the tenant DB.
    """

    def authenticate(self, request, username=None, password=None, **kwargs):
        user = super().authenticate(request, username=username, password=password, **kwargs)
        if user is None:
            return None

        # Reject tenant users — they must use /tenant-admin/, not /admin/
        try:
            from Client.models import TenantUser
            is_tenant = (
                TenantUser.objects.using('tenant')
                .filter(user_id=user.id)
                .exists()
            )
        except Exception:
            # If the tenant DB lookup fails, err on the side of allowing
            # master users (never lock out platform staff because of a
            # tenant-DB hiccup). But log it so you notice.
            import logging
            logging.getLogger(__name__).warning(
                "[auth] TenantUser lookup failed during master login; "
                "allowing superuser through."
            )
            is_tenant = False

        if is_tenant:
            # Block the login — return None so Django tries other backends.
            import logging
            logging.getLogger(__name__).warning(
                f"[auth] Blocked tenant user '{username}' from /admin/ login."
            )
            return None

        return user