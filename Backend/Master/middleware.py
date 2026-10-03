# Backend/Master/middleware.py

from django.contrib.auth import logout
from django.shortcuts import redirect


class BlockTenantUsersFromMasterAdminMiddleware:
    """
    Force-logout any tenant user who reaches /admin/.

    Uses a query-string flag (`?tenant_blocked=1`) to signal the reason
    to the login page, avoiding a hard dependency on MessageMiddleware.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        path = request.path or ''
        user = getattr(request, 'user', None)

        if path.startswith('/admin/') and user and user.is_authenticated:
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