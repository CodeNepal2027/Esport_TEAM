
# # ====================== [3.New Updated model with IMAGE COMPRESSOR utils function]===============
# # Backend/Client/models.py

# from django.conf import settings
# from django.db import models

# from Client.upload_paths import (
#     hero_upload_to,
#     sponsors_upload_to,
#     gallery_upload_to,
#     team_upload_to,
#     events_upload_to,
# )

# from Utils.image_compressor import compress_field_on_save


# # ============================================
# # TENANT USER
# # ============================================
# class TenantUser(models.Model):
#     user = models.OneToOneField(
#         settings.AUTH_USER_MODEL,
#         on_delete=models.CASCADE,
#         related_name='tenant_profile',
#         verbose_name="User Account",
#     )
#     organization_slug = models.SlugField(
#         max_length=100, db_index=True,
#         verbose_name="Organization Slug",
#     )
#     is_tenant_admin = models.BooleanField(
#         default=True,
#         verbose_name="Tenant Admin Status",
#     )
#     created_at = models.DateTimeField(
#         auto_now_add=True,
#         verbose_name="Created At",
#     )

#     class Meta:
#         db_table = 'client_tenant_user'
#         verbose_name = "Tenant User Profile"
#         verbose_name_plural = "Tenant User Profiles"

#     def __str__(self):
#         return f'{self.user.username} → {self.organization_slug}'


# # ============================================
# # HERO
# # ============================================
# class Hero(models.Model):
#     organization_slug = models.SlugField(max_length=100, db_index=True)
#     image_url = models.URLField(max_length=500, blank=True, null=True)
#     image_file = models.ImageField(
#         upload_to=hero_upload_to, blank=True, null=True,
#         verbose_name="Banner Image Upload",
#         help_text=(
#             "Recommended: 1920×1080 (16:9) or larger, up to 2560×1440. "
#             "Format: JPG or PNG. Max 5 MB. "
#             "Keep the main subject near the center — edges may be cropped on wider screens. "
#             "Auto-compressed to ~200 KB."
#         ),
#     )
#     title = models.CharField(max_length=200)
#     subtitle = models.CharField(max_length=200, blank=True)
#     tag = models.CharField(max_length=100, blank=True)
#     order = models.PositiveIntegerField(default=0)

#     class Meta:
#         db_table = 'client_hero'
#         ordering = ['order', 'id']

#     @property
#     def image(self):
#         if self.image_file:
#             return self.image_file.url
#         if self.image_url:
#             return self.image_url
#         return ''

#     def save(self, *args, **kwargs):
#         # Compress fresh uploads (200 KB target for full-width banners)
#         self.image_file = compress_field_on_save(self.image_file, target_kb=80)
#         super().save(*args, **kwargs)

#     def __str__(self):
#         return f'{self.organization_slug} — {self.title}'


# # ============================================
# # ABOUT
# # ============================================
# class About(models.Model):
#     organization_slug = models.SlugField(max_length=100, db_index=True)
#     heading = models.CharField(max_length=255, default='Professional Esports Organizations')
#     mission = models.TextField(blank=True)
#     vision = models.TextField(blank=True)

#     class Meta:
#         db_table = 'client_about'
#         verbose_name = "About Section"
#         verbose_name_plural = "About Sections"

#     def __str__(self):
#         return f'{self.organization_slug} — About'


# class AboutParagraph(models.Model):
#     about = models.ForeignKey(About, on_delete=models.CASCADE, related_name='paragraphs')
#     text = models.TextField()
#     order = models.PositiveIntegerField(default=0)

#     class Meta:
#         db_table = 'client_about_paragraph'
#         ordering = ['order', 'id']

#     def __str__(self):
#         return f"Paragraph {self.order} for {self.about.organization_slug}"


# class AboutStat(models.Model):
#     about = models.ForeignKey(About, on_delete=models.CASCADE, related_name='stats')
#     label = models.CharField(max_length=100)
#     value = models.CharField(max_length=50)
#     order = models.PositiveIntegerField(default=0)

#     class Meta:
#         db_table = 'client_about_stat'
#         ordering = ['order', 'id']

#     def __str__(self):
#         return f"{self.label}: {self.value}"


# # ============================================
# # SPONSORS
# # ============================================
# class Sponsers(models.Model):
#     organization_slug = models.SlugField(max_length=100, db_index=True)
#     name = models.CharField(max_length=100)
#     logo_url = models.URLField(max_length=500, blank=True, null=True)
#     logo_file = models.ImageField(
#         upload_to=sponsors_upload_to, blank=True, null=True,
#         verbose_name="Sponsor Logo Upload",
#         help_text=(
#             "Recommended: 400×400 (square) with transparent background. "
#             "Format: PNG (transparency preserved) or JPG. Max 5 MB. "
#             "Auto-compressed to ~30 KB, transparency kept."
#         ),

#     )
#     order = models.PositiveIntegerField(default=0)

#     class Meta:
#         db_table = 'client_sponsor'
#         ordering = ['order', 'id']

#     @property
#     def logo(self):
#         if self.logo_file:
#             return self.logo_file.url
#         if self.logo_url:
#             return self.logo_url
#         return ''

#     def save(self, *args, **kwargs):
#         # 30 KB target, keep PNG (transparency matters for logos)
#         self.logo_file = compress_field_on_save(
#             self.logo_file, target_kb=30, keep_png=True
#         )
#         super().save(*args, **kwargs)

#     def __str__(self):
#         return f"{self.name} ({self.organization_slug})"


# # ============================================
# # GALLERY
# # ============================================
# class Gallery(models.Model):
#     organization_slug = models.SlugField(max_length=100, db_index=True)
#     title = models.CharField(max_length=200)
#     category = models.CharField(max_length=50)
#     image_url = models.URLField(max_length=500, blank=True, null=True)
#     image_file = models.ImageField(
#         upload_to=gallery_upload_to, blank=True, null=True,
#         verbose_name="Image Upload",
#         help_text=(
#             "Recommended: 1600×1200 (4:3 landscape) or 1200×1600 (3:4 portrait). "
#             "Square 1200×1200 also works. "
#             "Format: JPG or PNG. Max 5 MB. "
#             "Auto-compressed to ~150 KB."
#         ),
#     )
#     description = models.TextField(blank=True)
#     aspect_ratio = models.CharField(max_length=10, default='4/3')
#     order = models.PositiveIntegerField(default=0)

#     class Meta:
#         db_table = 'client_gallery'
#         ordering = ['order', 'id']

#     @property
#     def image(self):
#         if self.image_file:
#             return self.image_file.url
#         if self.image_url:
#             return self.image_url
#         return ''

#     def save(self, *args, **kwargs):
#         # 150 KB for photos
#         self.image_file = compress_field_on_save(self.image_file, target_kb=75)
#         super().save(*args, **kwargs)

#     def __str__(self):
#         return f"{self.title} ({self.category})"


# # ============================================
# # TEAM
# # ============================================
# class Team(models.Model):
#     organization_slug = models.SlugField(max_length=100, db_index=True)
#     name = models.CharField(max_length=100)
#     real_name = models.CharField(max_length=200, blank=True)
#     role = models.CharField(max_length=100)
#     image_url = models.URLField(max_length=500, blank=True, null=True)
#     image_file = models.ImageField(
#         upload_to=team_upload_to, blank=True, null=True,
#         verbose_name="Profile Picture Upload",
#         help_text=(
#             "Recommended: 800×800 (square). "
#             "Format: JPG or PNG. Max 5 MB. "
#             "Face should be centered — card crops to a square. "
#             "Auto-compressed to ~80 KB."
#         ),
#     )
#     instagram = models.URLField(max_length=500, blank=True)
#     tiktok = models.URLField(max_length=500, blank=True)
#     youtube = models.URLField(max_length=500, blank=True)
#     country = models.CharField(max_length=20, blank=True)
#     order = models.PositiveIntegerField(default=0)

#     class Meta:
#         db_table = 'client_team'
#         ordering = ['order', 'id']

#     @property
#     def image(self):
#         if self.image_file:
#             return self.image_file.url
#         if self.image_url:
#             return self.image_url
#         return ''

#     def save(self, *args, **kwargs):
#         # 80 KB for headshots
#         self.image_file = compress_field_on_save(self.image_file, target_kb=50)
#         super().save(*args, **kwargs)

#     def __str__(self):
#         return f"{self.name} - {self.role}"


# # ============================================
# # EVENTS
# # ============================================
# class Events(models.Model):
#     organization_slug = models.SlugField(max_length=100, db_index=True)
#     title = models.CharField(max_length=200)
#     description = models.TextField()
#     image_url = models.URLField(max_length=500, blank=True, null=True)
#     image_file = models.ImageField(
#         upload_to=events_upload_to, blank=True, null=True,
#         verbose_name="Event Poster Upload",
#         help_text=(
#             "Recommended: 1600×900 (16:9) or 1600×1200 (4:3). "
#             "Format: JPG or PNG. Max 5 MB. "
#             "Auto-compressed to ~150 KB."
#         ),
#     )
#     date = models.CharField(max_length=100)
#     location = models.CharField(max_length=200)
#     prize_pool = models.CharField(max_length=100)
#     status = models.CharField(max_length=20)
#     category = models.CharField(max_length=50)
#     order = models.PositiveIntegerField(default=0)

#     class Meta:
#         db_table = 'client_event'
#         ordering = ['order', 'id']

#     @property
#     def image(self):
#         if self.image_file:
#             return self.image_file.url
#         if self.image_url:
#             return self.image_url
#         return ''

#     def save(self, *args, **kwargs):
#         # 150 KB for event posters
#         self.image_file = compress_field_on_save(self.image_file, target_kb=75)
#         super().save(*args, **kwargs)

#     def __str__(self):
#         return f"{self.title} ({self.status})"


# # ============================================
# # VIDEOS
# # ============================================
# class Videos(models.Model):
#     organization_slug = models.SlugField(max_length=100, db_index=True)
#     youtube_url = models.URLField(max_length=500)
#     category = models.CharField(max_length=50)
#     order = models.PositiveIntegerField(default=0)

#     class Meta:
#         db_table = 'client_video'
#         ordering = ['order', 'id']

#     def __str__(self):
#         return f"Video {self.id} [{self.category}]"




# ===================== [ Client Model.py with LIMIT STORAGE  ] =====================
# Backend/Client/models.py

from django.conf import settings
from django.db import models

from Client.upload_paths import (
    hero_upload_to,
    sponsors_upload_to,
    gallery_upload_to,
    team_upload_to,
    events_upload_to,
)

from Utils.image_compressor import compress_field_on_save
from Utils.limits import LIMITS          # ← keep for help_text only


# ============================================
# TENANT USER
# ============================================
class TenantUser(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='tenant_profile',
        verbose_name="User Account",
    )
    organization_slug = models.SlugField(
        max_length=100, db_index=True,
        verbose_name="Organization Slug",
    )
    is_tenant_admin = models.BooleanField(
        default=True,
        verbose_name="Tenant Admin Status",
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Created At",
    )

    class Meta:
        db_table = 'client_tenant_user'
        verbose_name = "Tenant User Profile"
        verbose_name_plural = "Tenant User Profiles"

    def __str__(self):
        return f'{self.user.username} → {self.organization_slug}'


# ============================================
# HERO
# ============================================
class Hero(models.Model):
    organization_slug = models.SlugField(max_length=100, db_index=True)
    image_url = models.URLField(max_length=500, blank=True, null=True)
    image_file = models.ImageField(
        upload_to=hero_upload_to, blank=True, null=True,
        verbose_name="Banner Image Upload",
        help_text=(
            "Recommended: 1920×1080 (16:9) or larger, up to 2560×1440. "
            "Format: JPG or PNG. Max 5 MB. "
            "Keep the main subject near the center — edges may be cropped on wider screens. "
            "Auto-compressed to ~200 KB. "
            f"Only the newest {LIMITS['hero']} slides are kept."
        ),
    )
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=200, blank=True)
    tag = models.CharField(max_length=100, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'client_hero'
        ordering = ['order', 'id']

    @property
    def image(self):
        if self.image_file:
            return self.image_file.url
        if self.image_url:
            return self.image_url
        return ''

    def save(self, *args, **kwargs):
        # Compress fresh uploads only
        self.image_file = compress_field_on_save(self.image_file, target_kb=80)
        super().save(*args, **kwargs)
        # NOTE: retention trim is handled by ScopedTenantAdmin.save_model()
        # so it only fires from the admin, with the correct slug set.

    def __str__(self):
        return f'{self.organization_slug} — {self.title}'


# ============================================
# ABOUT
# ============================================
class About(models.Model):
    organization_slug = models.SlugField(max_length=100, db_index=True)
    heading = models.CharField(max_length=255, default='Professional Esports Organizations')
    mission = models.TextField(blank=True)
    vision = models.TextField(blank=True)

    class Meta:
        db_table = 'client_about'
        verbose_name = "About Section"
        verbose_name_plural = "About Sections"

    def __str__(self):
        return f'{self.organization_slug} — About'


class AboutParagraph(models.Model):
    about = models.ForeignKey(About, on_delete=models.CASCADE, related_name='paragraphs')
    text = models.TextField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'client_about_paragraph'
        ordering = ['order', 'id']

    def __str__(self):
        return f"Paragraph {self.order} for {self.about.organization_slug}"


class AboutStat(models.Model):
    about = models.ForeignKey(About, on_delete=models.CASCADE, related_name='stats')
    label = models.CharField(max_length=100)
    value = models.CharField(max_length=50)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'client_about_stat'
        ordering = ['order', 'id']

    def __str__(self):
        return f"{self.label}: {self.value}"


# ============================================
# SPONSORS
# ============================================
class Sponsers(models.Model):
    organization_slug = models.SlugField(max_length=100, db_index=True)
    name = models.CharField(max_length=100)
    logo_url = models.URLField(max_length=500, blank=True, null=True)
    logo_file = models.ImageField(
        upload_to=sponsors_upload_to, blank=True, null=True,
        verbose_name="Sponsor Logo Upload",
        help_text=(
            "Recommended: 400×400 (square) with transparent background. "
            "Format: PNG (transparency preserved) or JPG. Max 5 MB. "
            "Auto-compressed to ~30 KB, transparency kept."
        ),
    )
    order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'client_sponsor'
        ordering = ['order', 'id']

    @property
    def logo(self):
        if self.logo_file:
            return self.logo_file.url
        if self.logo_url:
            return self.logo_url
        return ''

    def save(self, *args, **kwargs):
        self.logo_file = compress_field_on_save(
            self.logo_file, target_kb=30, keep_png=True
        )
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.organization_slug})"


# ============================================
# GALLERY
# ============================================
class Gallery(models.Model):
    organization_slug = models.SlugField(max_length=100, db_index=True)
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=50)
    image_url = models.URLField(max_length=500, blank=True, null=True)
    image_file = models.ImageField(
        upload_to=gallery_upload_to, blank=True, null=True,
        verbose_name="Image Upload",
        help_text=(
            "Recommended: 1600×1200 (4:3 landscape) or 1200×1600 (3:4 portrait). "
            "Square 1200×1200 also works. "
            "Format: JPG or PNG. Max 5 MB. "
            "Auto-compressed to ~150 KB. "
            f"Only the newest {LIMITS['gallery']} photos are kept."
        ),
    )
    description = models.TextField(blank=True)
    aspect_ratio = models.CharField(max_length=10, default='4/3')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'client_gallery'
        ordering = ['order', 'id']

    @property
    def image(self):
        if self.image_file:
            return self.image_file.url
        if self.image_url:
            return self.image_url
        return ''

    def save(self, *args, **kwargs):
        self.image_file = compress_field_on_save(self.image_file, target_kb=75)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.category})"


# ============================================
# TEAM
# ============================================
class Team(models.Model):
    organization_slug = models.SlugField(max_length=100, db_index=True)
    name = models.CharField(max_length=100)
    real_name = models.CharField(max_length=200, blank=True)
    role = models.CharField(max_length=100)
    image_url = models.URLField(max_length=500, blank=True, null=True)
    image_file = models.ImageField(
        upload_to=team_upload_to, blank=True, null=True,
        verbose_name="Profile Picture Upload",
        help_text=(
            "Recommended: 800×800 (square). "
            "Format: JPG or PNG. Max 5 MB. "
            "Face should be centered — card crops to a square. "
            "Auto-compressed to ~80 KB. "
            f"Only the newest {LIMITS['team']} members are kept."
        ),
    )
    instagram = models.URLField(max_length=500, blank=True)
    tiktok = models.URLField(max_length=500, blank=True)
    youtube = models.URLField(max_length=500, blank=True)
    country = models.CharField(max_length=20, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'client_team'
        ordering = ['order', 'id']

    @property
    def image(self):
        if self.image_file:
            return self.image_file.url
        if self.image_url:
            return self.image_url
        return ''

    def save(self, *args, **kwargs):
        self.image_file = compress_field_on_save(self.image_file, target_kb=50)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} - {self.role}"


# ============================================
# EVENTS
# ============================================
class Events(models.Model):
    organization_slug = models.SlugField(max_length=100, db_index=True)
    title = models.CharField(max_length=200)
    description = models.TextField()
    image_url = models.URLField(max_length=500, blank=True, null=True)
    image_file = models.ImageField(
        upload_to=events_upload_to, blank=True, null=True,
        verbose_name="Event Poster Upload",
        help_text=(
            "Recommended: 1600×900 (16:9) or 1600×1200 (4:3). "
            "Format: JPG or PNG. Max 5 MB. "
            "Auto-compressed to ~150 KB. "
            f"Only the newest {LIMITS['events']} events are kept."
        ),
    )
    date = models.CharField(
        max_length=100,
        verbose_name="Event Date / Timeframe",
        help_text=(
            "Formatted date string. Pick ONE of these formats exactly: "
            "(1) Single day — 'Dec 15, 2026'. "
            "(2) Same-month range — 'Dec 15-20, 2026'. "
            "(3) Full range — 'Dec 15, 2026 - Dec 20, 2026'. "
            "Months must be English 3-letter abbreviations "
            "(Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec). "
            "The system auto-detects event status (upcoming / ongoing / completed) "
            "from this date — do not type the status manually."
        ),
    )
    location = models.CharField(max_length=200)
    prize_pool = models.CharField(max_length=100)
    status = models.CharField(
        max_length=20,
        default='upcoming',
        verbose_name="Event Status",
        help_text=(
            "Auto-computed from the Date field by the frontend. "
            "Whatever you type here is ignored if a valid Date is set."
        ),
    )
    category = models.CharField(max_length=50)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'client_event'
        ordering = ['order', 'id']

    @property
    def image(self):
        if self.image_file:
            return self.image_file.url
        if self.image_url:
            return self.image_url
        return ''

    def save(self, *args, **kwargs):
        self.image_file = compress_field_on_save(self.image_file, target_kb=75)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.status})"


# ============================================
# VIDEOS
# ============================================
class Videos(models.Model):
    organization_slug = models.SlugField(max_length=100, db_index=True)
    youtube_url = models.URLField(max_length=500)
    category = models.CharField(max_length=50)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'client_video'
        ordering = ['order', 'id']

    def __str__(self):
        return f"Video {self.id} [{self.category}]"