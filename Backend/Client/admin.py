# Backend/Client/admin.py

from django.contrib import admin
from django.contrib.admin.models import LogEntry
from django.contrib.contenttypes.models import ContentType
from django.utils.html import format_html

from .models import (
    TenantUser, Hero, About, AboutParagraph, AboutStat,
    Sponsers, Gallery, Team, Events, Videos,
)
from .admin_site import tenant_admin_site


def get_user_org_slug(request):
    """Return the tenant slug for the logged-in user, or None."""
    if not request.user.is_authenticated:
        return None
    try:
        profile = TenantUser.objects.using('tenant').get(user_id=request.user.id)
        return profile.organization_slug
    except TenantUser.DoesNotExist:
        return None


class ScopedTenantAdmin(admin.ModelAdmin):
    using = 'tenant'

    def get_queryset(self, request):
        """
        Priority:
          1. If user has a TenantUser profile → filter by their slug
          2. Else if user is superuser (Optech staff) → no filter (see all)
          3. Else → deny all
        """
        qs = super().get_queryset(request).using(self.using)

        slug = get_user_org_slug(request)
        if slug:
            return qs.filter(organization_slug=slug)

        if request.user.is_superuser:
            return qs

        return qs.none()

    def save_model(self, request, obj, form, change):
        if not getattr(obj, 'organization_slug', None):
            slug = get_user_org_slug(request)
            if slug:
                obj.organization_slug = slug
        obj.save(using=self.using)

    def delete_model(self, request, obj):
        obj.delete(using=self.using)

    def delete_queryset(self, request, queryset):
        queryset.using(self.using).delete()

    def get_exclude(self, request, obj=None):
        exclude = list(super().get_exclude(request, obj) or [])
        # Hide organization_slug from client users (auto-assigned)
        # But show it for real platform superusers
        slug = get_user_org_slug(request)
        if slug and hasattr(self.model, 'organization_slug'):
            if 'organization_slug' not in exclude:
                exclude.append('organization_slug')
        return exclude

    def get_readonly_fields(self, request, obj=None):
        readonly = list(super().get_readonly_fields(request, obj))
        # Platform superuser (no profile) can edit organization_slug
        slug = get_user_org_slug(request)
        if not slug and request.user.is_superuser and hasattr(self.model, 'organization_slug'):
            if 'organization_slug' in readonly:
                readonly.remove('organization_slug')
        return readonly

    # ----- LogEntry overrides (force tenant DB) -----
    def log_addition(self, request, obj, message):
        LogEntry.objects.using(self.using).create(
            user_id=request.user.pk,
            content_type_id=ContentType.objects.db_manager(self.using)
                .get_for_model(obj, for_concrete_model=False).pk,
            object_id=str(obj.pk),
            object_repr=str(obj),
            action_flag=1,
            change_message=message,
        )

    def log_change(self, request, obj, message):
        LogEntry.objects.using(self.using).create(
            user_id=request.user.pk,
            content_type_id=ContentType.objects.db_manager(self.using)
                .get_for_model(obj, for_concrete_model=False).pk,
            object_id=str(obj.pk),
            object_repr=str(obj),
            action_flag=2,
            change_message=message,
        )

    def log_deletion(self, request, obj, object_repr):
        LogEntry.objects.using(self.using).create(
            user_id=request.user.pk,
            content_type_id=ContentType.objects.db_manager(self.using)
                .get_for_model(obj, for_concrete_model=False).pk,
            object_id=str(obj.pk),
            object_repr=str(object_repr),
            action_flag=3,
            change_message='',
        )


# -------- Inlines --------
class AboutParagraphInline(admin.TabularInline):
    model = AboutParagraph
    extra = 1
    fields = ('order', 'text')
    ordering = ('order',)


class AboutStatInline(admin.TabularInline):
    model = AboutStat
    extra = 1
    fields = ('order', 'label', 'value')
    ordering = ('order',)


# -------- Admin classes --------
class TenantUserAdmin(admin.ModelAdmin):
    list_display = ('user', 'organization_slug', 'is_tenant_admin', 'created_at')
    list_filter = ('organization_slug', 'is_tenant_admin')
    search_fields = ('user__username', 'organization_slug')
    ordering = ('organization_slug',)


class HeroAdmin(ScopedTenantAdmin):
    list_display = ('organization_slug', 'title', 'tag', 'order')
    list_editable = ('order',)
    search_fields = ('title', 'tag')


class AboutAdmin(ScopedTenantAdmin):
    list_display = ('organization_slug', 'heading')
    inlines = (AboutParagraphInline, AboutStatInline)
    search_fields = ('heading',)


class SponsersAdmin(ScopedTenantAdmin):
    list_display = ('organization_slug', 'name', 'order')
    list_editable = ('order',)
    search_fields = ('name',)


class GalleryAdmin(ScopedTenantAdmin):
    list_display = ('organization_slug', 'thumbnail', 'title', 'category', 'order')
    list_filter = ('category',)
    list_editable = ('order',)
    search_fields = ('title', 'description')

    @admin.display(description='Preview')
    def thumbnail(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="height:40px;border-radius:4px;" />',
                obj.image,
            )
        return '—'


class TeamAdmin(ScopedTenantAdmin):
    list_display = ('organization_slug', 'name', 'role', 'country', 'order')
    list_filter = ('role',)
    list_editable = ('order',)
    search_fields = ('name', 'real_name')


class EventsAdmin(ScopedTenantAdmin):
    # list_display = ('organization_slug', 'title', 'status', 'category', 'date', 'order')
    list_display = ('organization_slug', 'title', 'category', 'date', 'order')
    list_filter = ('status', 'category')
    list_editable = ('order',)
    search_fields = ('title', 'location')


class VideosAdmin(ScopedTenantAdmin):
    list_display = ('organization_slug', 'category', 'youtube_url', 'order')
    list_filter = ('category',)
    list_editable = ('order',)
    search_fields = ('youtube_url',)


# -------- Register --------
# tenant_admin_site.register(TenantUser, TenantUserAdmin)
tenant_admin_site.register(Hero,       HeroAdmin)
tenant_admin_site.register(About,      AboutAdmin)
tenant_admin_site.register(Sponsers,   SponsersAdmin)
tenant_admin_site.register(Gallery,    GalleryAdmin)
tenant_admin_site.register(Team,       TeamAdmin)
tenant_admin_site.register(Events,     EventsAdmin)
tenant_admin_site.register(Videos,     VideosAdmin)