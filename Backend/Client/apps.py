# Backend/Client/apps.py

from django.apps import AppConfig


class ClientConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'Client'

    def ready(self):
        # Ensures admin.py runs and registers models with tenant_admin_site
        import Client.admin           # noqa

        # Register post_delete signals for image file cleanup
        import Client.signals         # noqa

        # Register startup retention sweep (runs on server start / migrate)
        import Client.startup_trim    # noqa