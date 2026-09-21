# Backend/Client/apps.py

from django.apps import AppConfig


class ClientConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'Client'

    def ready(self):
        # Ensures admin.py runs and registers models with tenant_admin_site
        import Client.admin  # noqa