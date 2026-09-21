# Backend/Master/admin.py

from django.contrib import admin
from django.contrib.admin.models import LogEntry
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from django.utils.html import format_html
import logging

from .models import Organization

logger = logging.getLogger(__name__)


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = (
        'slug', 'team_tag', 'team_name', 'org_domain',
        'color_preview', 'subscription_tier', 'subscription_status',
    )
    list_filter = ('subscription_tier', 'subscription_status', 'org_country')
    search_fields = ('slug', 'team_tag', 'team_name', 'org_domain', 'org_email')
    ordering = ('slug',)
    readonly_fields = ('created_at', 'updated_at')

    @admin.display(description='Colors')
    def color_preview(self, obj):
        return format_html(
            '<span style="display:inline-block;width:20px;height:20px;'
            'border-radius:4px;background:{};border:1px solid #ccc;'
            'margin-right:4px;"></span>'
            '<span style="display:inline-block;width:20px;height:20px;'
            'border-radius:4px;background:{};border:1px solid #ccc;"></span>',
            obj.color_code_1, obj.color_code_2,
        )

    fieldsets = (
        ('Identity', {
            'fields': ('slug', 'org_domain', 'api_url'),
        }),
        ('Team Branding', {
            'fields': ('team_tag', 'team_name', 'team_logo_url',
                       'color_code_1', 'color_code_2'),
        }),
        ('Subdomains', {
            'fields': ('org_shop', 'org_achievements'),
        }),
        ('Socials', {
            'fields': ('org_youtube_link', 'org_tiktok_link',
                       'org_instagram_link', 'org_discord_link',
                       'org_twitter_link'),
            'classes': ('collapse',),
        }),
        ('Contact', {
            'fields': ('org_email', 'org_whatsapp', 'org_phone_1', 'org_phone_2'),
        }),
        ('Address', {
            'fields': ('org_country', 'org_address',
                       'org_working_day', 'org_working_hour'),
        }),
        ('Subscription & Platform', {
            'fields': ('subscription_tier', 'subscription_status', 'feature_flags'),
        }),
        ('Meta', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )

    def get_readonly_fields(self, request, obj=None):
        ro = list(super().get_readonly_fields(request, obj))
        if obj:
            ro.append('slug')
        return ro

    # --------------------------------------------------
    # Save explicitly to default DB
    # --------------------------------------------------
    def save_model(self, request, obj, form, change):
        obj.save(using='default')

    # --------------------------------------------------
    # LogEntry overrides — fail-safe writes
    # --------------------------------------------------
    def _write_log(self, request, obj, action_flag, message):
        """Write a LogEntry, but never let it break the save."""
        try:
            ct = ContentType.objects.db_manager('default').get_for_model(
                obj, for_concrete_model=False
            )
        except Exception as e:
            logger.warning(f"[admin-log] content type lookup failed: {e}")
            return

        if not request.user or not request.user.pk:
            logger.warning("[admin-log] no user, skipping log")
            return

        user_model = get_user_model()
        try:
            user_model.objects.using('default').get(pk=request.user.pk)
        except user_model.DoesNotExist:
            logger.warning(
                "[admin-log] user %s is not in default DB; skipping admin log write",
                request.user.pk,
            )
            return

        try:
            LogEntry.objects.using('default').create(
                user_id=request.user.pk,
                content_type_id=ct.pk,
                object_id=str(obj.pk),
                object_repr=str(obj)[:200],
                action_flag=action_flag,
                change_message=message or '',
            )
        except Exception as e:
            logger.warning(f"[admin-log] write failed: {e}")

    def log_addition(self, request, obj, message):
        self._write_log(request, obj, 1, message)

    def log_change(self, request, obj, message):
        self._write_log(request, obj, 2, message)

    def log_deletion(self, request, obj, object_repr):
        self._write_log(request, obj, 3, '')