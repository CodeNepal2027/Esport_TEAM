# Backend/Master/auth_backend.py
"""
Master-auth backend for /admin/ (default admin site).

Wraps Django's ModelBackend and additionally refuses any user who
exists as a TenantUser in the tenant DB — UNLESS they are a superuser.

This lets platform staff (superusers) log in even if they also happen
to manage a tenant, while still blocking pure tenant users from the
master admin.
"""

from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

import logging

logger = logging.getLogger(__name__)


class MasterOnlyAuthBackend(ModelBackend):
    """
    Same as ModelBackend (checks password against `default` DB), but
    rejects any user who has a TenantUser profile in the tenant DB
    AND is not a master superuser.
    """

    def authenticate(self, request, username=None, password=None, **kwargs):
        user = super().authenticate(request, username=username, password=password, **kwargs)
        if user is None:
            return None

        # Superusers are always allowed in master admin.
        # They may also be tenant admins — that's fine for the platform operator.
        if user.is_superuser:
            return user

        # Non-superuser: reject if they have a TenantUser profile in the tenant DB.
        try:
            from Client.models import TenantUser
            is_tenant = (
                TenantUser.objects.using('tenant')
                .filter(user_id=user.id)
                .exists()
            )
        except Exception:
            logger.warning(
                "[auth] TenantUser lookup failed during master login; "
                "allowing user through. Check tenant DB."
            )
            is_tenant = False

        if is_tenant:
            logger.warning(
                f"[auth] Blocked tenant user '{username}' from /admin/ login."
            )
            return None

        return user