# Backend/Client/admin_site.py

from django.contrib.admin import AdminSite
from django.urls import reverse


class TenantAdminSite(AdminSite):
    site_header = 'Tenant Admin'
    site_title = 'Tenant Admin'
    index_title = 'Client Content Management'

    # ============================================
    # URL OVERRIDES — the critical fix.
    # Without these, Django's base AdminSite points them at the MASTER
    # admin's URLs. That causes tenant logins to redirect to /admin/,
    # and the tenant session to appear as if it were a master session.
    # ============================================
    @property
    def login_url(self):
        return reverse('tenant_admin:login')

    @property
    def logout_url(self):
        return reverse('tenant_admin:logout')

    @property
    def index_url(self):
        return reverse('tenant_admin:index')

    # ============================================
    # PERMISSION
    # ============================================
    def has_permission(self, request):
        """
        Superusers always allowed.
        Staff users allowed if a TenantUser row exists in the TENANT DB.
        """
        if not request.user.is_active or not request.user.is_authenticated:
            return False

        if request.user.is_superuser:
            return True

        # Explicit query to TENANT DB — do NOT use hasattr()
        from Client.models import TenantUser
        return TenantUser.objects.using('tenant').filter(
            user_id=request.user.id
        ).exists()


tenant_admin_site = TenantAdminSite(name='tenant_admin')