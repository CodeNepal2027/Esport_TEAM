# # Backend/Master/admin.py

# from django.contrib import admin
# from django.contrib.admin.models import LogEntry
# from django.contrib.auth import get_user_model
# from django.contrib.contenttypes.models import ContentType
# from django.utils.html import format_html
# import logging

# from .models import Organization

# logger = logging.getLogger(__name__)


# @admin.register(Organization)
# class OrganizationAdmin(admin.ModelAdmin):
#     list_display = (
#         'slug', 'team_tag', 'team_name', 'org_domain',
#         'color_preview', 'subscription_tier', 'subscription_status',
#     )
#     list_filter = ('subscription_tier', 'subscription_status', 'org_country')
#     search_fields = ('slug', 'team_tag', 'team_name', 'org_domain', 'org_email')
#     ordering = ('slug',)
#     readonly_fields = ('created_at', 'updated_at')

#     @admin.display(description='Colors')
#     def color_preview(self, obj):
#         return format_html(
#             '<span style="display:inline-block;width:20px;height:20px;'
#             'border-radius:4px;background:{};border:1px solid #ccc;'
#             'margin-right:4px;"></span>'
#             '<span style="display:inline-block;width:20px;height:20px;'
#             'border-radius:4px;background:{};border:1px solid #ccc;"></span>',
#             obj.color_code_1, obj.color_code_2,
#         )

#     fieldsets = (
#         ('Identity', {
#             'fields': ('slug', 'org_domain', 'api_url'),
#         }),
#         ('Team Branding', {
#             'fields': ('team_tag', 'team_name', 'team_logo_url',
#                        'color_code_1', 'color_code_2'),
#         }),
#         ('Subdomains', {
#             'fields': ('org_shop', 'org_achievements'),
#         }),
#         ('Socials', {
#             'fields': ('org_youtube_link', 'org_tiktok_link',
#                        'org_instagram_link', 'org_discord_link',
#                        'org_twitter_link'),
#             'classes': ('collapse',),
#         }),
#         ('Contact', {
#             'fields': ('org_email', 'org_whatsapp', 'org_phone_1', 'org_phone_2'),
#         }),
#         ('Address', {
#             'fields': ('org_country', 'org_address',
#                        'org_working_day', 'org_working_hour'),
#         }),
#         ('Subscription & Platform', {
#             'fields': ('subscription_tier', 'subscription_status', 'feature_flags'),
#         }),
#         ('Meta', {
#             'fields': ('created_at', 'updated_at'),
#             'classes': ('collapse',),
#         }),
#     )

#     def get_readonly_fields(self, request, obj=None):
#         ro = list(super().get_readonly_fields(request, obj))
#         if obj:
#             ro.append('slug')
#         return ro

#     # --------------------------------------------------
#     # Save explicitly to default DB
#     # --------------------------------------------------
#     def save_model(self, request, obj, form, change):
#         obj.save(using='default')

#     # --------------------------------------------------
#     # LogEntry overrides — fail-safe writes
#     # --------------------------------------------------
#     def _write_log(self, request, obj, action_flag, message):
#         """Write a LogEntry, but never let it break the save."""
#         try:
#             ct = ContentType.objects.db_manager('default').get_for_model(
#                 obj, for_concrete_model=False
#             )
#         except Exception as e:
#             logger.warning(f"[admin-log] content type lookup failed: {e}")
#             return

#         if not request.user or not request.user.pk:
#             logger.warning("[admin-log] no user, skipping log")
#             return

#         user_model = get_user_model()
#         try:
#             user_model.objects.using('default').get(pk=request.user.pk)
#         except user_model.DoesNotExist:
#             logger.warning(
#                 "[admin-log] user %s is not in default DB; skipping admin log write",
#                 request.user.pk,
#             )
#             return

#         try:
#             LogEntry.objects.using('default').create(
#                 user_id=request.user.pk,
#                 content_type_id=ct.pk,
#                 object_id=str(obj.pk),
#                 object_repr=str(obj)[:200],
#                 action_flag=action_flag,
#                 change_message=message or '',
#             )
#         except Exception as e:
#             logger.warning(f"[admin-log] write failed: {e}")

#     def log_addition(self, request, obj, message):
#         self._write_log(request, obj, 1, message)

#     def log_change(self, request, obj, message):
#         self._write_log(request, obj, 2, message)

#     def log_deletion(self, request, obj, object_repr):
#         self._write_log(request, obj, 3, '')





## ***************************** [ New Updated code FROM IMAGE URL to IMAGE FILE (2026/10/03) ] 
# Backend/Master/admin.py

from django.contrib import admin
from django.contrib.admin.models import LogEntry
from django.contrib.contenttypes.models import ContentType
from django.utils.html import format_html

from .models import Organization


# ============================================
# HELPERS
# ============================================
def _active_logo_preview(obj):
    """Large logo preview for the change form."""
    value = obj.logo or ''
    if not value:
        return '— no logo —'

    source = 'uploaded file' if obj.team_logo_file else (
        'URL' if obj.team_logo_url else 'unknown'
    )

    return format_html(
        '<img src="{}" style="height:60px;border-radius:4px;'
        'object-fit:contain;background:#fff;padding:2px;" />'
        '<div style="font-size:11px;color:#666;margin-top:4px;">'
        'Serving: <b>{}</b></div>',
        value, source,
    )


# ============================================
# ADMIN
# ============================================
@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):

    # ---------- CHANGELIST ----------
    list_display = (
        'logo_thumb',
        'slug',
        'team_tag',
        'team_name',
        'domain_link',
        'color_swatch',
        'subscription_tier',
        'subscription_status',
    )
    list_display_links = ('slug', 'team_name')
    list_filter = ('subscription_tier', 'subscription_status')
    search_fields = ('slug', 'team_tag', 'team_name', 'org_domain')
    ordering = ('slug',)

    # ---------- CHANGEFORM ----------
    readonly_fields = ('active_logo', 'created_at', 'updated_at')

    fieldsets = (
        ('Brand', {
            'fields': (
                'slug',
                'team_tag',
                'team_name',
                'org_domain',
                'color_code_1',
                'color_code_2',
                'team_logo_file',
                'active_logo',
            ),
        }),
        ('Subscription', {
            'fields': ('subscription_tier', 'subscription_status'),
        }),
        ('Advanced — API & Fallback Logo', {
            'classes': ('collapse',),
            'fields': ('api_url', 'team_logo_url'),
        }),
        ('Advanced — Subdomains', {
            'classes': ('collapse',),
            'fields': ('org_shop', 'org_achievements'),
        }),
        ('Advanced — Socials', {
            'classes': ('collapse',),
            'fields': (
                'org_youtube_link', 'org_tiktok_link', 'org_instagram_link',
                'org_discord_link', 'org_twitter_link',
            ),
        }),
        ('Advanced — Contact / Address', {
            'classes': ('collapse',),
            'fields': (
                'org_country', 'org_address',
                'org_working_day', 'org_working_hour',
                'org_email', 'org_whatsapp',
                'org_phone_1', 'org_phone_2',
            ),
        }),
        ('Advanced — Platform', {
            'classes': ('collapse',),
            'fields': ('feature_flags', 'created_at', 'updated_at'),
        }),
    )

    # ============================================
    # CHANGELIST COLUMNS
    # ============================================
    @admin.display(description='Logo')
    def logo_thumb(self, obj):
        value = obj.logo or ''
        if not value:
            return format_html('<span style="color:#888;font-size:12px;">—</span>')
        return format_html(
            '<img src="{}" '
            'style="height:36px;width:36px;border-radius:6px;'
            'object-fit:contain;background:#fff;padding:2px;'
            'border:1px solid #ddd;" />',
            value,
        )

    @admin.display(description='Domain', ordering='org_domain')
    def domain_link(self, obj):
        """Clickable external link for the tenant's public domain."""
        raw = (obj.org_domain or '').strip()
        if not raw:
            return format_html('<span style="color:#888;font-size:12px;">—</span>')

        href = raw
        if not href.startswith(('http://', 'https://')):
            href = f'https://{href}'

        display = raw.replace('https://', '').replace('http://', '').rstrip('/')

        return format_html(
            '<a href="{}" target="_blank" rel="noopener noreferrer" '
            'style="font-size:12px;color:#0a66c2;text-decoration:none;'
            'white-space:nowrap;" '
            'title="Open {} in a new tab">'
            '{}</a>',
            href, display, display,
        )

    @admin.display(description='Colors', ordering='color_code_1')
    def color_swatch(self, obj):
        """Two-tone swatch: color_code_1 on the left, color_code_2 on the right."""
        c1 = obj.color_code_1 or '#000000'
        c2 = obj.color_code_2 or '#000000'

        return format_html(
            '<div style="display:flex;flex-direction:column;gap:4px;align-items:flex-start;">'
            '  <div style="display:flex;border-radius:6px;overflow:hidden;'
            '              border:1px solid #ddd;box-shadow:0 1px 2px rgba(0,0,0,0.06);">'
            '    <span style="width:28px;height:20px;background:{};" title="{}"></span>'
            '    <span style="width:28px;height:20px;background:{};" title="{}"></span>'
            '  </div>'
            '  <div style="font-size:10px;color:#666;font-family:monospace;'
            '              letter-spacing:0.2px;line-height:1.2;">'
            '    <span>{}</span> · <span>{}</span>'
            '  </div>'
            '</div>',
            c1, c1,
            c2, c2,
            c1, c2,
        )

    @admin.display(description='Active logo')
    def active_logo(self, obj):
        return _active_logo_preview(obj)

    # ============================================
    # AUDIT LOG — force writes to the MASTER DB
    # --------------------------------------------
    # The default Django admin writes LogEntry via the default router,
    # which can route to the `tenant` DB in this project. When it does,
    # the `auth_user` FK on LogEntry points at a row that only exists in
    # the master DB → IntegrityError: FOREIGN KEY constraint failed.
    #
    # These four overrides pin every audit-log write to 'default'.
    # Mirrors the same pattern used in ScopedTenantAdmin on the Client side.
    # ============================================
    def log_addition(self, request, obj, message):
        LogEntry.objects.using('default').create(
            user_id=request.user.pk,
            content_type_id=ContentType.objects.db_manager('default')
                .get_for_model(obj, for_concrete_model=False).pk,
            object_id=str(obj.pk),
            object_repr=str(obj),
            action_flag=1,   # ADDITION
            change_message=message,
        )

    def log_change(self, request, obj, message):
        LogEntry.objects.using('default').create(
            user_id=request.user.pk,
            content_type_id=ContentType.objects.db_manager('default')
                .get_for_model(obj, for_concrete_model=False).pk,
            object_id=str(obj.pk),
            object_repr=str(obj),
            action_flag=2,   # CHANGE
            change_message=message,
        )

    def log_deletion(self, request, obj, object_repr):
        LogEntry.objects.using('default').create(
            user_id=request.user.pk,
            content_type_id=ContentType.objects.db_manager('default')
                .get_for_model(obj, for_concrete_model=False).pk,
            object_id=str(obj.pk),
            object_repr=str(object_repr),
            action_flag=3,   # DELETION
            change_message='',
        )

    def log_deletions(self, request, queryset):
        """Bulk 'Delete selected' — writes one LogEntry per object."""
        for obj in queryset:
            self.log_deletion(request, obj, str(obj))