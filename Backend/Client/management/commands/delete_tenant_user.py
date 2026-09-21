# Backend/Client/management/commands/delete_tenant_user.py

from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model

from Client.models import TenantUser

User = get_user_model()


class Command(BaseCommand):
    help = 'Delete a tenant admin user and its TenantUser profile'

    def add_arguments(self, parser):
        parser.add_argument('--username', required=True, help='Username to delete')
        parser.add_argument(
            '--keep-user', action='store_true',
            help='Only delete the TenantUser profile, keep the Django auth user',
        )
        parser.add_argument(
            '--yes', '-y', action='store_true',
            help='Skip confirmation prompt',
        )

    def handle(self, *args, **opts):
        username = opts['username'].strip()
        keep_user = opts['keep_user']
        assume_yes = opts['yes']

        if not username:
            raise CommandError('Username is required')

        # Find the user in the TENANT DB
        try:
            user = User.objects.using('tenant').get(username=username)
        except User.DoesNotExist:
            raise CommandError(f'User "{username}" not found in tenant DB')

        # Find the profile
        profile = TenantUser.objects.using('tenant').filter(user=user).first()

        # Show what will be deleted
        self.stdout.write('')
        self.stdout.write(self.style.WARNING('About to delete:'))
        self.stdout.write(f'  Username:      {user.username}')
        self.stdout.write(f'  Email:         {user.email or "—"}')
        self.stdout.write(f'  Org slug:      {profile.organization_slug if profile else "—"}')
        self.stdout.write(f'  TenantUser:    {"yes" if profile else "no"}')
        self.stdout.write(
            f'  Action:        {"remove profile only (keep user)" if keep_user else "delete user + profile"}'
        )
        self.stdout.write('')

        # Confirmation prompt
        if not assume_yes:
            answer = input('Continue? (y/N): ').strip().lower()
            if answer not in ('y', 'yes'):
                self.stdout.write(self.style.WARNING('Cancelled'))
                return

        # Perform the delete
        if keep_user:
            if profile:
                profile.delete(using='tenant')
                self.stdout.write(self.style.SUCCESS(
                    f'✅ Removed TenantUser profile for "{username}" (user kept)'
                ))
            else:
                self.stdout.write(self.style.WARNING(
                    f'No TenantUser profile found for "{username}"'
                ))
        else:
            user.delete(using='tenant')
            self.stdout.write(self.style.SUCCESS(
                f'✅ Deleted user "{username}" and its profile from tenant DB'
            ))
        



## ========== USAGES [DELETE TENANT USER] ==============
## Delete user + TenantUser profile
# python manage.py delete_tenant_user --username drs_admin
# python manage.py delete_tenant_user --username t2k_admin
# python manage.py delete_tenant_user --username abc_admin

## ========== USAGES [REVOKE ACCESS ONLY] ==============
## Remove TenantUser profile only — user can still log in but has no admin access
# python manage.py delete_tenant_user --username t2k_admin --keep-user

## ========== USAGES [SKIP CONFIRMATION] ==============
# python manage.py delete_tenant_user --username t2k_admin --yes

