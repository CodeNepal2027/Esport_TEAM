# Backend/Client/admin_site.py

from django.contrib.admin import AdminSite


class TenantAdminSite(AdminSite):
    site_header = 'Tenant Admin'
    site_title = 'Tenant Admin'
    index_title = 'Client Content Management'

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