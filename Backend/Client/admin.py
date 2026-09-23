# # Backend/Client/admin.py

# from django.contrib import admin
# from django.contrib.admin.models import LogEntry
# from django.contrib.contenttypes.models import ContentType
# from django.utils.html import format_html

# from .models import (
#     TenantUser, Hero, About, AboutParagraph, AboutStat,
#     Sponsers, Gallery, Team, Events, Videos,
# )
# from .admin_site import tenant_admin_site


# def get_user_org_slug(request):
#     """Return the tenant slug for the logged-in user, or None."""
#     if not request.user.is_authenticated:
#         return None
#     try:
#         profile = TenantUser.objects.using('tenant').get(user_id=request.user.id)
#         return profile.organization_slug
#     except TenantUser.DoesNotExist:
#         return None


# class ScopedTenantAdmin(admin.ModelAdmin):
#     using = 'tenant'

#     def get_queryset(self, request):
#         """
#         Priority:
#           1. If user has a TenantUser profile → filter by their slug
#           2. Else if user is superuser (Optech staff) → no filter (see all)
#           3. Else → deny all
#         """
#         qs = super().get_queryset(request).using(self.using)

#         slug = get_user_org_slug(request)
#         if slug:
#             return qs.filter(organization_slug=slug)

#         if request.user.is_superuser:
#             return qs

#         return qs.none()

#     def save_model(self, request, obj, form, change):
#         if not getattr(obj, 'organization_slug', None):
#             slug = get_user_org_slug(request)
#             if slug:
#                 obj.organization_slug = slug
#         obj.save(using=self.using)

#     def delete_model(self, request, obj):
#         obj.delete(using=self.using)

#     def delete_queryset(self, request, queryset):
#         queryset.using(self.using).delete()

#     def get_exclude(self, request, obj=None):
#         exclude = list(super().get_exclude(request, obj) or [])
#         # Hide organization_slug from client users (auto-assigned)
#         # But show it for real platform superusers
#         slug = get_user_org_slug(request)
#         if slug and hasattr(self.model, 'organization_slug'):
#             if 'organization_slug' not in exclude:
#                 exclude.append('organization_slug')
#         return exclude

#     def get_readonly_fields(self, request, obj=None):
#         readonly = list(super().get_readonly_fields(request, obj))
#         # Platform superuser (no profile) can edit organization_slug
#         slug = get_user_org_slug(request)
#         if not slug and request.user.is_superuser and hasattr(self.model, 'organization_slug'):
#             if 'organization_slug' in readonly:
#                 readonly.remove('organization_slug')
#         return readonly

#     # ----- LogEntry overrides (force tenant DB) -----
#     def log_addition(self, request, obj, message):
#         LogEntry.objects.using(self.using).create(
#             user_id=request.user.pk,
#             content_type_id=ContentType.objects.db_manager(self.using)
#                 .get_for_model(obj, for_concrete_model=False).pk,
#             object_id=str(obj.pk),
#             object_repr=str(obj),
#             action_flag=1,
#             change_message=message,
#         )

#     def log_change(self, request, obj, message):
#         LogEntry.objects.using(self.using).create(
#             user_id=request.user.pk,
#             content_type_id=ContentType.objects.db_manager(self.using)
#                 .get_for_model(obj, for_concrete_model=False).pk,
#             object_id=str(obj.pk),
#             object_repr=str(obj),
#             action_flag=2,
#             change_message=message,
#         )

#     def log_deletion(self, request, obj, object_repr):
#         LogEntry.objects.using(self.using).create(
#             user_id=request.user.pk,
#             content_type_id=ContentType.objects.db_manager(self.using)
#                 .get_for_model(obj, for_concrete_model=False).pk,
#             object_id=str(obj.pk),
#             object_repr=str(object_repr),
#             action_flag=3,
#             change_message='',
#         )


# # -------- Inlines --------
# class AboutParagraphInline(admin.TabularInline):
#     model = AboutParagraph
#     extra = 1
#     fields = ('order', 'text')
#     ordering = ('order',)


# class AboutStatInline(admin.TabularInline):
#     model = AboutStat
#     extra = 1
#     fields = ('order', 'label', 'value')
#     ordering = ('order',)


# # -------- Admin classes --------
# class TenantUserAdmin(admin.ModelAdmin):
#     list_display = ('user', 'organization_slug', 'is_tenant_admin', 'created_at')
#     list_filter = ('organization_slug', 'is_tenant_admin')
#     search_fields = ('user__username', 'organization_slug')
#     ordering = ('organization_slug',)


# class HeroAdmin(ScopedTenantAdmin):
#     list_display = ('organization_slug', 'title', 'tag', 'order')
#     list_editable = ('order',)
#     search_fields = ('title', 'tag')


# class AboutAdmin(ScopedTenantAdmin):
#     list_display = ('organization_slug', 'heading')
#     inlines = (AboutParagraphInline, AboutStatInline)
#     search_fields = ('heading',)


# class SponsersAdmin(ScopedTenantAdmin):
#     list_display = ('organization_slug', 'name', 'order')
#     list_editable = ('order',)
#     search_fields = ('name',)


# class GalleryAdmin(ScopedTenantAdmin):
#     list_display = ('organization_slug', 'thumbnail', 'title', 'category', 'order')
#     list_filter = ('category',)
#     list_editable = ('order',)
#     search_fields = ('title', 'description')

#     @admin.display(description='Preview')
#     def thumbnail(self, obj):
#         if obj.image:
#             return format_html(
#                 '<img src="{}" style="height:40px;border-radius:4px;" />',
#                 obj.image,
#             )
#         return '—'


# class TeamAdmin(ScopedTenantAdmin):
#     list_display = ('organization_slug', 'name', 'role', 'country', 'order')
#     list_filter = ('role',)
#     list_editable = ('order',)
#     search_fields = ('name', 'real_name')


# class EventsAdmin(ScopedTenantAdmin):
#     # list_display = ('organization_slug', 'title', 'status', 'category', 'date', 'order')
#     list_display = ('organization_slug', 'title', 'category', 'date', 'order')
#     list_filter = ('status', 'category')
#     list_editable = ('order',)
#     search_fields = ('title', 'location')


# class VideosAdmin(ScopedTenantAdmin):
#     list_display = ('organization_slug', 'category', 'youtube_url', 'order')
#     list_filter = ('category',)
#     list_editable = ('order',)
#     search_fields = ('youtube_url',)


# # -------- Register --------
# # tenant_admin_site.register(TenantUser, TenantUserAdmin)
# tenant_admin_site.register(Hero,       HeroAdmin)
# tenant_admin_site.register(About,      AboutAdmin)
# tenant_admin_site.register(Sponsers,   SponsersAdmin)
# tenant_admin_site.register(Gallery,    GalleryAdmin)
# tenant_admin_site.register(Team,       TeamAdmin)
# tenant_admin_site.register(Events,     EventsAdmin)
# tenant_admin_site.register(Videos,     VideosAdmin)



# ============== [ New Updated code FROM IMAGE URL to IMAGE FILE ] ==================
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
        # Hide organization_slug from tenant users (auto-assigned on save).
        # Platform superusers keep it so they can manage cross-tenant data.
        slug = get_user_org_slug(request)
        if slug and hasattr(self.model, 'organization_slug'):
            if 'organization_slug' not in exclude:
                exclude.append('organization_slug')
        return exclude

    def get_readonly_fields(self, request, obj=None):
        readonly = list(super().get_readonly_fields(request, obj))
        # Platform superuser (no tenant profile) can edit organization_slug
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


def _active_image_preview(obj, field_name='image'):
    """
    Renders a thumbnail of whichever image is active
    (uploaded file wins over URL) plus a small label.
    """
    value = getattr(obj, field_name, '') or ''
    if not value:
        return '— no image —'

    source = 'unknown'
    if getattr(obj, 'image_file', None):
        source = 'uploaded file'
    elif getattr(obj, 'image_url', None):
        source = 'URL'
    elif getattr(obj, 'logo_file', None):
        source = 'uploaded file'
    elif getattr(obj, 'logo_url', None):
        source = 'URL'

    return format_html(
        '<img src="{}" style="height:60px;border-radius:4px;object-fit:cover;" />'
        '<div style="font-size:11px;color:#666;margin-top:4px;">Serving: <b>{}</b></div>',
        value, source,
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
    list_display = ('organization_slug', 'thumbnail', 'title', 'tag', 'order')
    list_editable = ('order',)
    search_fields = ('title', 'tag')
    readonly_fields = ('active_image',)

    # NOTE: do NOT list 'organization_slug' here.
    # Tenant users get it excluded automatically by ScopedTenantAdmin.get_exclude();
    # platform superusers get it added automatically.
    fields = (
        'image_url', 'image_file', 'active_image',
        'title', 'subtitle', 'tag', 'order',
    )

    @admin.display(description='Preview')
    def thumbnail(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="height:40px;border-radius:4px;object-fit:cover;" />',
                obj.image,
            )
        return '—'

    @admin.display(description='Active image')
    def active_image(self, obj):
        return _active_image_preview(obj, 'image')


class AboutAdmin(ScopedTenantAdmin):
    list_display = ('organization_slug', 'heading')
    inlines = (AboutParagraphInline, AboutStatInline)
    search_fields = ('heading',)


class SponsersAdmin(ScopedTenantAdmin):
    list_display = ('organization_slug', 'thumbnail', 'name', 'order')
    list_editable = ('order',)
    search_fields = ('name',)
    readonly_fields = ('active_logo',)

    fields = (
        'name',
        'logo_url', 'logo_file', 'active_logo',
        'order',
    )

    @admin.display(description='Preview')
    def thumbnail(self, obj):
        if obj.logo:
            return format_html(
                '<img src="{}" style="height:40px;border-radius:4px;object-fit:contain;background:#fff;padding:2px;" />',
                obj.logo,
            )
        return '—'

    @admin.display(description='Active logo')
    def active_logo(self, obj):
        return _active_image_preview(obj, 'logo')


class GalleryAdmin(ScopedTenantAdmin):
    list_display = ('organization_slug', 'thumbnail', 'title', 'category', 'order')
    list_filter = ('category',)
    list_editable = ('order',)
    search_fields = ('title', 'description')
    readonly_fields = ('active_image',)

    fields = (
        'title', 'category',
        'image_url', 'image_file', 'active_image',
        'description', 'aspect_ratio', 'order',
    )

    @admin.display(description='Preview')
    def thumbnail(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="height:40px;border-radius:4px;object-fit:cover;" />',
                obj.image,
            )
        return '—'

    @admin.display(description='Active image')
    def active_image(self, obj):
        return _active_image_preview(obj, 'image')


class TeamAdmin(ScopedTenantAdmin):
    list_display = ('organization_slug', 'thumbnail', 'name', 'role', 'country', 'order')
    list_filter = ('role',)
    list_editable = ('order',)
    search_fields = ('name', 'real_name')
    readonly_fields = ('active_image',)

    fields = (
        'name', 'real_name', 'role',
        'image_url', 'image_file', 'active_image',
        'instagram', 'tiktok', 'youtube', 'country', 'order',
    )

    @admin.display(description='Preview')
    def thumbnail(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="height:40px;width:40px;border-radius:50%;object-fit:cover;" />',
                obj.image,
            )
        return '—'

    @admin.display(description='Active image')
    def active_image(self, obj):
        return _active_image_preview(obj, 'image')


class EventsAdmin(ScopedTenantAdmin):
    list_display = ('organization_slug', 'thumbnail', 'title', 'category', 'date', 'order')
    list_filter = ('status', 'category')
    list_editable = ('order',)
    search_fields = ('title', 'location')
    readonly_fields = ('active_image',)

    fields = (
        'title', 'description',
        'image_url', 'image_file', 'active_image',
        'date', 'location', 'prize_pool', 'status', 'category', 'order',
    )

    @admin.display(description='Preview')
    def thumbnail(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="height:40px;border-radius:4px;object-fit:cover;" />',
                obj.image,
            )
        return '—'

    @admin.display(description='Active image')
    def active_image(self, obj):
        return _active_image_preview(obj, 'image')


class VideosAdmin(ScopedTenantAdmin):
    list_display = ('organization_slug', 'category', 'youtube_url', 'order')
    list_filter = ('category',)
    list_editable = ('order',)
    search_fields = ('youtube_url',)


# -------- Register --------
tenant_admin_site.register(Hero,       HeroAdmin)
tenant_admin_site.register(About,      AboutAdmin)
tenant_admin_site.register(Sponsers,   SponsersAdmin)
tenant_admin_site.register(Gallery,    GalleryAdmin)
tenant_admin_site.register(Team,       TeamAdmin)
tenant_admin_site.register(Events,     EventsAdmin)
tenant_admin_site.register(Videos,     VideosAdmin)