# Backend/Client/management/commands/create_tenant_user.py

from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model

from Client.models import TenantUser

User = get_user_model()


class Command(BaseCommand):
    help = 'Create a tenant admin user linked to an organization'

    def add_arguments(self, parser):
        parser.add_argument('--username', required=True)
        parser.add_argument('--password', required=True)
        parser.add_argument('--slug',     required=True)
        parser.add_argument('--email',    default='')

    def handle(self, *args, **opts):
        username = opts['username'].strip()
        password = opts['password']
        slug     = opts['slug'].strip().lower()
        email    = opts['email'].strip()

        if not username:
            raise CommandError('Username is required')
        if not slug:
            raise CommandError('Slug is required')

        # Create or update user — with superuser for tenant admin
        if existing := User.objects.using('tenant').filter(username=username).first():
            user = existing
            created = False
        else:
            user = User(
                username=username,
                email=email,
            )
            created = True

        user.email = email or user.email
        user.is_staff = True
        user.is_superuser = True
        user.set_password(password)
        user.save(using='tenant')

        # Attach TenantUser profile
        TenantUser.objects.using('tenant').update_or_create(
            user=user,
            defaults={
                'organization_slug': slug,
                'is_tenant_admin': True,
            },
        )

        verb = 'Created' if created else 'Updated'
        self.stdout.write(self.style.SUCCESS(
            f'{verb} tenant user "{username}" for org "{slug}"'
        ))
        
        

# ==========USAGES [create TENANT NEW USER] ==============
# python manage.py create_tenant_user --username drs_admin --password secret123 --slug drs
# python manage.py create_tenant_user --username t2k_admin --password secret123 --slug t2k
# python manage.py create_tenant_user --username abc_admin --password secret123 --slug abc

# ==========USAGES [PASSWORD RESET TENANT EXISTING USER] ==============
# python manage.py create_tenant_user --username t2k_admin --password new_secret_456 --slug t2k

