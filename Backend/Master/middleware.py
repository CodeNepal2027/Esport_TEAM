# # Backend/Master/middleware.py
# """
# Block tenant users from accessing the master admin (/admin/).

# Superusers always pass. Staff without a matching TenantUser profile pass.

# MATCHES BY USERNAME, not user_id — master and tenant DBs have
# independent autoincrement sequences, so id=1 in master is NOT the
# same person as id=1 in tenant.
# """

# import logging

# from django.contrib.auth import logout
# from django.shortcuts import redirect

# logger = logging.getLogger(__name__)


# def _is_tenant_username(username):
#     """True if a tenant user with this username has a TenantUser profile."""
#     if not username:
#         return False
#     try:
#         from django.contrib.auth.models import User
#         from Client.models import TenantUser

#         tenant_ids = list(
#             User.objects.using('tenant')
#             .filter(username=username)
#             .values_list('id', flat=True)
#         )
#         if not tenant_ids:
#             return False

#         return TenantUser.objects.using('tenant').filter(
#             user_id__in=tenant_ids
#         ).exists()

#     except Exception as e:
#         logger.warning(
#             f"[auth] TenantUser lookup failed ({e}); treating as non-tenant."
#         )
#         return False


# class BlockTenantUsersFromMasterAdminMiddleware:
#     def __init__(self, get_response):
#         self.get_response = get_response

#     def __call__(self, request):
#         path = request.path or ''
#         user = getattr(request, 'user', None)

#         if not path.startswith('/admin/'):
#             return self.get_response(request)

#         if not user or not user.is_authenticated:
#             return self.get_response(request)

#         # Superusers always allowed — platform operators.
#         if user.is_superuser:
#             return self.get_response(request)

#         # Non-superuser: block if the SAME USERNAME is a tenant user.
#         if _is_tenant_username(user.username):
#             logger.warning(
#                 f"[auth] Middleware blocked tenant user '{user.username}' from /admin/."
#             )
#             logout(request)
#             return redirect('/admin/login/?tenant_blocked=1')

#         if user.is_staff:
#             return self.get_response(request)

#         logger.warning(
#             f"[auth] Middleware blocked non-staff user '{user.username}' from /admin/."
#         )
#         logout(request)
#         return redirect('/admin/login/?tenant_blocked=1')




# Backend/Master/middleware.py

"""
====================================================================
MASTER ADMIN — TENANT GUARD MIDDLEWARE
====================================================================

PURPOSE
-------
Protect the master admin (/admin/) from tenant-user sessions.

Two databases are in play:

    default  → master DB  (auth_user, master_organization, ...)
    tenant   → tenant DB  (auth_user, client_hero, client_team, ...)

Both DBs have their own auth_user tables with independent
autoincrement sequences. That means:

    master.auth_user.id = 1  →  "sujan"     (platform superuser)
    tenant.auth_user.id = 1  →  "t2k_admin" (tenant admin)

They are different people who happen to share the numeric id.

Django's AuthenticationMiddleware resolves `_auth_user_id` from the
session cookie against the DEFAULT router (master). So a session
created by t2k_admin in the tenant admin loads the user object for
id=1 out of the master DB — which is sujan, a superuser. Without this
middleware, the master admin would treat that session as
authenticated and let the tenant user in.

RULES
-----
This middleware applies ONLY to paths starting with /admin/.

For each such request:

    1. If the user isn't authenticated → pass through.
        (The login page itself is handled later.)

    2. Verify the resolved user exists in the master DB with the
        SAME username. If not → force logout + redirect to
        /admin/login/?identity_mismatch=1.

        This is the backstop against id-collision.

    3. If the user is a master superuser → allow.

    4. If the user's username also exists as a TenantUser in the
        tenant DB (and isn't a master superuser) → force logout +
        redirect to /admin/login/?tenant_blocked=1.

    5. If the user is staff → allow.

    6. Otherwise → force logout + redirect to
        /admin/login/?tenant_blocked=1.

WHAT IT DOES NOT DO
-------------------
- It does NOT authenticate anyone. Authentication is handled by
    MasterOnlyAuthBackend (see Master/auth_backend.py) and
    TenantAuthBackend (see Client/auth_backend.py).

- It does NOT protect /tenant-admin/. That's the job of
    Client/middleware.py.

- It does NOT touch the response body. It only adds redirects or
    clears the session when the identity is wrong.

PLACEMENT
---------
In settings.MIDDLEWARE, this must run AFTER:

    - django.contrib.auth.middleware.AuthenticationMiddleware
    - Client.middleware.TenantAdminUserMiddleware
        (which re-resolves request.user to the correct DB)

and AFTER:

    - django.contrib.messages.middleware.MessageMiddleware
        (so that MessageMiddleware is available if this middleware
            ever wants to add a flash message)

Recommended order:

    ...
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'Client.middleware.TenantAdminUserMiddleware',   ← first
    'django.contrib.messages.middleware.MessageMiddleware',
    'Master.middleware.BlockTenantUsersFromMasterAdminMiddleware',
    ...

If the order is reversed (this middleware runs before the tenant
resolver), it will operate on the wrong `request.user` and reject
legitimate master sessions.

====================================================================
"""

import logging

from django.contrib.auth import logout
from django.contrib.auth.models import User
from django.shortcuts import redirect

logger = logging.getLogger(__name__)


# ============================================
# HELPERS
# ============================================
def _user_exists_in_master(user):
    """
    Return True only if a master-DB row exists with BOTH this pk and
    this exact username.

    Why both: an id match alone isn't safe, because the tenant DB
    has its own user with the same numeric id. Requiring the username
    to match as well guarantees we're dealing with the same person.

    Fails closed: any exception → False → caller treats as untrusted.
    """
    if not user or not user.is_authenticated:
        return False
    try:
        return User.objects.using('default').filter(
            pk=user.pk,
            username=user.username,
        ).exists()
    except Exception:
        return False


def _is_tenant_username(username):
    """
    Return True if a tenant-side user with this username has a
    TenantUser profile in the tenant DB.

    Used to reject anyone from the master admin who is really a
    tenant admin — even when their username also exists in master
    (which can happen during migration or if an admin was created
    in both DBs by mistake).

    Fails open: if the tenant lookup errors, we don't block, because
    a DB hiccup on the tenant side should not lock platform staff
    out of the master admin. The `_user_exists_in_master` check
    above already prevents the id-collision case.
    """
    if not username:
        return False
    try:
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


# ============================================
# MIDDLEWARE
# ============================================
class BlockTenantUsersFromMasterAdminMiddleware:
    """
    Guard the master admin against tenant-user sessions.

    Rules (see header for the full explanation):
        1. Unauthenticated           → pass (login page handles it)
        2. Not in master DB          → logout + redirect
        3. Master superuser          → allow
        4. Tenant username           → logout + redirect
        5. Staff, non-tenant         → allow
        6. Anything else             → logout + redirect
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        path = request.path or ''
        user = getattr(request, 'user', None)

        # Scope: only /admin/ paths
        if not path.startswith('/admin/'):
            return self.get_response(request)

        # 1. Unauthenticated — let the admin login view handle it
        if not user or not user.is_authenticated:
            return self.get_response(request)

        # 2. Backstop: the resolved user must exist in master with
        #    this exact username, otherwise it's an id-collision
        #    (tenant session leaking into master).
        if not _user_exists_in_master(user):
            logger.warning(
                f"[auth] Master admin rejected '{user.username}' "
                f"— not in master DB."
            )
            logout(request)
            return redirect('/admin/login/?identity_mismatch=1')

        # 3. Superusers pass — they've already been verified above.
        if user.is_superuser:
            return self.get_response(request)

        # 4. Block anyone who is a tenant user, even if they're
        #    staff in master.
        if _is_tenant_username(user.username):
            logger.warning(
                f"[auth] Middleware blocked tenant user "
                f"'{user.username}' from /admin/."
            )
            logout(request)
            return redirect('/admin/login/?tenant_blocked=1')

        # 5. Non-superuser master staff → allow
        if user.is_staff:
            return self.get_response(request)

        # 6. Anything else → block
        logger.warning(
            f"[auth] Middleware blocked non-staff user "
            f"'{user.username}' from /admin/."
        )
        logout(request)
        return redirect('/admin/login/?tenant_blocked=1')