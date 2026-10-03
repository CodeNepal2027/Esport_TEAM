# Backend/Master/auth_backend.py
"""
Master-auth backend for /admin/ (default admin site).

MATCHES BY USERNAME, not user_id.
"""

import logging

from django.contrib.auth.backends import ModelBackend

logger = logging.getLogger(__name__)


def _is_tenant_username(username):
    if not username:
        return False
    try:
        from django.contrib.auth.models import User
        from Client.models import TenantUser

        tenant_ids = list(
            User.objects.using('tenant')
            .filter(username=username)
            .values_list('id', flat=True)
        )
        if not tenant_ids:
            return False

        return TenantUser.objects.using('tenant').filter(
            user_id__in=tenant_ids
        ).exists()

    except Exception as e:
        logger.warning(
            f"[auth] TenantUser lookup failed ({e}); treating as non-tenant."
        )
        return False


class MasterOnlyAuthBackend(ModelBackend):

    def authenticate(self, request, username=None, password=None, **kwargs):
        # 1. Standard master-DB authentication
        user = super().authenticate(request, username=username, password=password, **kwargs)
        if user is None:
            return None

        # 2. Superusers always pass — platform operators
        if user.is_superuser:
            return user

        # 3. Non-superuser with a matching tenant username → block
        if _is_tenant_username(user.username):
            logger.warning(
                f"[auth] Blocked tenant user '{username}' from /admin/ login."
            )
            return None

        # 4. Non-superuser, non-tenant, is staff → allow
        if user.is_staff:
            return user

        # 5. Anything else → reject
        return None