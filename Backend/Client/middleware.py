# # Backend/Client/middleware.py

# from django.contrib.auth.models import AnonymousUser
# from django.contrib.auth import get_user_model


# class TenantAdminUserMiddleware:
#     def __init__(self, get_response):
#         self.get_response = get_response

#     def __call__(self, request):
#         if request.path.startswith('/tenant-admin/'):
#             user_id = request.session.get('_auth_user_id')
#             print(f"[MW] tenant-admin path | user_id={user_id}")
#             if user_id:
#                 User = get_user_model()
#                 try:
#                     request.user = User.objects.using('tenant').get(pk=user_id)
#                     print(f"[MW] loaded user from tenant DB: {request.user}")
#                 except User.DoesNotExist:
#                     print(f"[MW] user {user_id} not found in tenant DB")
#                     request.user = AnonymousUser()
#         return self.get_response(request)






# Backend/Client/middleware.py
"""
Ensure `request.user` is correct for each admin site.

Problem: Django uses ONE session cookie. `AuthenticationMiddleware` resolves
`_auth_user_id` against the DEFAULT router (master DB). A tenant session
(user_id=1 in tenant) therefore becomes `sujan` (user_id=1 in master) —
and every master-admin guard sees a legitimate superuser.

Fix:
    /tenant-admin/* → load user from the tenant DB by id
    everything else → if the id exists in master, load from master;
                      otherwise, treat as anonymous
"""

import logging

from django.contrib.auth.models import AnonymousUser
from django.contrib.auth import get_user_model

logger = logging.getLogger(__name__)


class TenantAdminUserMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        user_id = request.session.get('_auth_user_id')
        if not user_id:
            return self.get_response(request)

        User = get_user_model()
        path = request.path or ''

        if path.startswith('/tenant-admin/'):
            # -------- TENANT ADMIN PATH --------
            try:
                request.user = User.objects.using('tenant').get(pk=user_id)
            except User.DoesNotExist:
                request.user = AnonymousUser()
        else:
            # -------- EVERY OTHER PATH (including /admin/) --------
            # The session may be from a tenant login. Verify the SAME user
            # exists in the master DB before trusting `request.user`.
            try:
                request.user = User.objects.using('default').get(pk=user_id)
            except User.DoesNotExist:
                # No master user with this id → this is a tenant-only session
                # reaching a non-tenant path. Treat as unauthenticated so
                # master-admin guards can reject it cleanly.
                request.user = AnonymousUser()

        return self.get_response(request)