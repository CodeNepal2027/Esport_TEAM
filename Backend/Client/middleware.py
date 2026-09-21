# Backend/Client/middleware.py

from django.contrib.auth.models import AnonymousUser
from django.contrib.auth import get_user_model


class TenantAdminUserMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path.startswith('/tenant-admin/'):
            user_id = request.session.get('_auth_user_id')
            print(f"[MW] tenant-admin path | user_id={user_id}")
            if user_id:
                User = get_user_model()
                try:
                    request.user = User.objects.using('tenant').get(pk=user_id)
                    print(f"[MW] loaded user from tenant DB: {request.user}")
                except User.DoesNotExist:
                    print(f"[MW] user {user_id} not found in tenant DB")
                    request.user = AnonymousUser()
        return self.get_response(request)