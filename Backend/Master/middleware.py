# Backend/Master/middleware.py

from django.contrib.auth import logout
from django.shortcuts import redirect


class BlockTenantUsersFromMasterAdminMiddleware:
    """
    Force-logout any non-superuser who has a TenantUser profile and
    reaches /admin/.

    Superusers are exempt — they are the platform operators.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        path = request.path or ''
        user = getattr(request, 'user', None)

        if path.startswith('/admin/') and user and user.is_authenticated:
            # Superusers are always allowed.
            if user.is_superuser:
                return self.get_response(request)

            is_tenant = False
            try:
                from Client.models import TenantUser
                is_tenant = (
                    TenantUser.objects.using('tenant')
                    .filter(user_id=user.id)
                    .exists()
                )
            except Exception:
                is_tenant = False

            if is_tenant:
                import logging
                logging.getLogger(__name__).warning(
                    f"[auth] Blocked tenant user '{user.username}' from /admin/"
                )
                logout(request)
                return redirect('/admin/login/?tenant_blocked=1')

        return self.get_response(request)