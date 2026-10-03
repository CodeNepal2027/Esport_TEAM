# Backend/Master/middleware.py
"""
Block tenant users from accessing the master admin (/admin/).

Superusers always pass. Staff without a matching TenantUser profile pass.

MATCHES BY USERNAME, not user_id — master and tenant DBs have
independent autoincrement sequences, so id=1 in master is NOT the
same person as id=1 in tenant.
"""

import logging

from django.contrib.auth import logout
from django.shortcuts import redirect

logger = logging.getLogger(__name__)


def _is_tenant_username(username):
    """True if a tenant user with this username has a TenantUser profile."""
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


class BlockTenantUsersFromMasterAdminMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        path = request.path or ''
        user = getattr(request, 'user', None)

        if not path.startswith('/admin/'):
            return self.get_response(request)

        if not user or not user.is_authenticated:
            return self.get_response(request)

        # Superusers always allowed — platform operators.
        if user.is_superuser:
            return self.get_response(request)

        # Non-superuser: block if the SAME USERNAME is a tenant user.
        if _is_tenant_username(user.username):
            logger.warning(
                f"[auth] Middleware blocked tenant user '{user.username}' from /admin/."
            )
            logout(request)
            return redirect('/admin/login/?tenant_blocked=1')

        if user.is_staff:
            return self.get_response(request)

        logger.warning(
            f"[auth] Middleware blocked non-staff user '{user.username}' from /admin/."
        )
        logout(request)
        return redirect('/admin/login/?tenant_blocked=1')