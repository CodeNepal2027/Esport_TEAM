# Backend/Client/models.py

from django.conf import settings
from django.db import models


# ============================================
# TENANT USER — links auth.User → organization_slug
# ============================================
class TenantUser(models.Model):
    """
    Lives in the tenant DB.
    Links a Django user to the organization_slug they can manage.
    """
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='tenant_profile',
        verbose_name="User Account",
        help_text="The Django user account linked to this tenant profile."
    )
    organization_slug = models.SlugField(
        max_length=100,
        db_index=True,
        verbose_name="Organization Slug",
        help_text="Unique identifier for the tenant organization (e.g., 'cloud9', 'fnatic')."
    )
    is_tenant_admin = models.BooleanField(
        default=True,
        verbose_name="Tenant Admin Status",
        help_text="Designates whether this user has full administrative privileges for this tenant."
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Created At",
        help_text="Timestamp when this tenant user profile was created."
    )

    class Meta:
        db_table = 'client_tenant_user'
        verbose_name = "Tenant User Profile"
        verbose_name_plural = "Tenant User Profiles"

    def __str__(self):
        return f'{self.user.username} → {self.organization_slug}'


# ============================================
# CONTENT MODELS
# ============================================
class Hero(models.Model):
    organization_slug = models.SlugField(
        max_length=100,
        db_index=True,
        verbose_name="Organization Slug",
        help_text="Unique identifier for the organization (e.g., 'cloud9')."
    )
    image = models.URLField(
        max_length=500,
        verbose_name="Banner Image URL",
        help_text="Direct link to the slide image (e.g., 'https://example.com/banner.jpg')."
    )
    title = models.CharField(
        max_length=200,
        verbose_name="Main Headline",
        help_text="Primary slide heading. Example: '#RISE AS ONE', 'DOMINATE'."
    )
    subtitle = models.CharField(
        max_length=200,
        blank=True,
        verbose_name="Subtitle",
        help_text="Secondary tag text below title. Example: 'Welcome to the battlefield', 'Train. Kill. Repeat.'"
    )
    tag = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Badge Tag",
        help_text="Small category or season badge above title. Example: 'SEASON 2026', 'ESPORT PRO'."
    )
    order = models.PositiveIntegerField(
        default=0,
        verbose_name="Display Order",
        help_text="Determines slide sequence. Lower numbers appear first (e.g., 0, 1, 2)."
    )

    class Meta:
        db_table = 'client_hero'
        ordering = ['order', 'id']
        verbose_name = "Hero Slide"
        verbose_name_plural = "Hero Slides"

    def __str__(self):
        return f'{self.organization_slug} — {self.title}'


class About(models.Model):
    organization_slug = models.SlugField(
        max_length=100,
        db_index=True,
        verbose_name="Organization Slug",
        help_text="Unique identifier for the organization (e.g., 'cloud9')."
    )
    heading = models.CharField(
        max_length=255,
        default='Professional Esports Organizations',
        verbose_name="Section Heading",
        help_text="Main title of the About page section. Example: 'Professional Esports Organization'."
    )
    mission = models.TextField(
        blank=True,
        verbose_name="Mission Statement",
        help_text="Core mission statement summarizing team goals."
    )
    vision = models.TextField(
        blank=True,
        verbose_name="Vision Statement",
        help_text="Long-term vision for the organization."
    )

    class Meta:
        db_table = 'client_about'
        verbose_name = "About Section"
        verbose_name_plural = "About Sections"

    def __str__(self):
        return f'{self.organization_slug} — About'


class AboutParagraph(models.Model):
    about = models.ForeignKey(
        About,
        on_delete=models.CASCADE,
        related_name='paragraphs',
        verbose_name="About Section",
        help_text="Select the parent About section this paragraph belongs to."
    )
    text = models.TextField(
        verbose_name="Paragraph Content",
        help_text="Detailed description paragraph introducing the organization."
    )
    order = models.PositiveIntegerField(
        default=0,
        verbose_name="Display Order",
        help_text="Controls paragraph ordering. Lower numbers appear first (e.g., 0, 1, 2)."
    )

    class Meta:
        db_table = 'client_about_paragraph'
        ordering = ['order', 'id']
        verbose_name = "About Paragraph"
        verbose_name_plural = "About Paragraphs"

    def __str__(self):
        return f"Paragraph {self.order} for {self.about.organization_slug}"


class AboutStat(models.Model):
    about = models.ForeignKey(
        About,
        on_delete=models.CASCADE,
        related_name="stats",
        verbose_name="About Section",
        help_text="Select the parent About section this statistic belongs to.",
    )
    label = models.CharField(
        max_length=100,
        verbose_name="Metric Label",
        help_text="Category or title of this stat. Example: 'Founded', 'Trophies', 'Win Rate'.",
    )
    value = models.CharField(
        max_length=50,
        verbose_name="Metric Value",
        help_text="Count or score for this stat. Example: '2019', '50+', '87%'.",
    )
    order = models.PositiveIntegerField(
        default=0,
        verbose_name="Display Order",
        help_text="Controls display sequence. Lower numbers appear first (e.g., 0, 1, 2).",
    )

    class Meta:
        db_table = "client_about_stat"
        ordering = ["order", "id"]
        verbose_name = "About Statistic"
        verbose_name_plural = "About Statistics"

    def __str__(self):
        return f"{self.label}: {self.value}"


class Sponsers(models.Model):
    organization_slug = models.SlugField(
        max_length=100,
        db_index=True,
        verbose_name="Organization Slug",
        help_text="Unique identifier for the organization (e.g., 'cloud9')."
    )
    name = models.CharField(
        max_length=100,
        verbose_name="Sponsor Name",
        help_text="Brand name of the partner or sponsor. Example: 'adidas', 'Nike'."
    )
    logo = models.URLField(
        max_length=500,
        verbose_name="Sponsor Logo URL",
        help_text="Direct link to transparent PNG or SVG logo."
    )
    order = models.PositiveIntegerField(
        default=0,
        verbose_name="Display Order",
        help_text="Controls display order in sponsor grid. Lower numbers appear first."
    )

    class Meta:
        db_table = 'client_sponsor'
        ordering = ['order', 'id']
        verbose_name = "Sponsor"
        verbose_name_plural = "Sponsors"

    def __str__(self):
        return f"{self.name} ({self.organization_slug})"


class Gallery(models.Model):
    organization_slug = models.SlugField(
        max_length=100,
        db_index=True,
        verbose_name="Organization Slug",
        help_text="Unique identifier for the organization (e.g., 'cloud9')."
    )
    title = models.CharField(
        max_length=200,
        verbose_name="Image Title",
        help_text="Short title describing the image content. Example: 'Team Victory'."
    )
    category = models.CharField(
        max_length=50,
        verbose_name="Category Filter",
        help_text="Filter grouping tag. Example: 'matches', 'training', 'bootcamp'."
    )
    image = models.URLField(
        max_length=500,
        verbose_name="Image URL",
        help_text="Direct link to full-resolution photo."
    )
    description = models.TextField(
        blank=True,
        verbose_name="Description",
        help_text="Brief summary or context of the photo. Example: 'Our team celebrating championship victory'."
    )
    aspect_ratio = models.CharField(
        max_length=10,
        default='4/3',
        verbose_name="Aspect Ratio",
        help_text="CSS Grid layout proportions. Example: '1/1' (square), '3/4' (portrait), '4/3' or '16/9' (landscape)."
    )
    order = models.PositiveIntegerField(
        default=0,
        verbose_name="Display Order",
        help_text="Position sequence in gallery layout. Lower numbers display first."
    )

    class Meta:
        db_table = 'client_gallery'
        ordering = ['order', 'id']
        verbose_name = "Gallery Item"
        verbose_name_plural = "Gallery Items"

    def __str__(self):
        return f"{self.title} ({self.category})"


class Team(models.Model):
    organization_slug = models.SlugField(
        max_length=100,
        db_index=True,
        verbose_name="Organization Slug",
        help_text="Unique identifier for the organization (e.g., 'cloud9')."
    )
    name = models.CharField(
        max_length=100,
        verbose_name="Gamer Tag / In-Game Name",
        help_text="Official player alias. Example: 'Apex', 'Simple', 'Faker'."
    )
    real_name = models.CharField(
        max_length=200,
        blank=True,
        verbose_name="Real Full Name",
        help_text="Player's actual name. Example: 'John Doe'."
    )
    role = models.CharField(
        max_length=100,
        verbose_name="Player Role",
        help_text="Position inside team roster. Example: 'IGL (In-Game Leader)', 'Entry Fragger', 'Head Coach'."
    )
    image = models.URLField(
        max_length=500,
        verbose_name="Profile Picture URL",
        help_text="Direct link to headshot or jersey picture."
    )
    instagram = models.URLField(
        max_length=500,
        blank=True,
        verbose_name="Instagram URL",
        help_text="Full link to official Instagram profile."
    )
    tiktok = models.URLField(
        max_length=500,
        blank=True,
        verbose_name="TikTok URL",
        help_text="Full link to official TikTok account."
    )
    youtube = models.URLField(
        max_length=500,
        blank=True,
        verbose_name="YouTube URL",
        help_text="Full link to personal channel."
    )
    country = models.CharField(
        max_length=20,
        blank=True,
        verbose_name="Country Flag/Code",
        help_text="Country flag emoji or code. Example: '🇺🇸', 'NP', 'US'."
    )
    order = models.PositiveIntegerField(
        default=0,
        verbose_name="Display Order",
        help_text="Controls roster line-up placement. Lower numbers display first."
    )

    class Meta:
        db_table = 'client_team'
        ordering = ['order', 'id']
        verbose_name = "Team Member"
        verbose_name_plural = "Team Members"

    def __str__(self):
        return f"{self.name} - {self.role}"


class Events(models.Model):
    organization_slug = models.SlugField(
        max_length=100,
        db_index=True,
        verbose_name="Organization Slug",
        help_text="Unique identifier for the organization (e.g., 'cloud9')."
    )
    title = models.CharField(
        max_length=200,
        verbose_name="Event Name",
        help_text="Official tournament or event title. Example: 'World Championship 2026'."
    )
    description = models.TextField(
        verbose_name="Event Details",
        help_text="Detailed summary or schedule breakdown of the event."
    )
    image = models.URLField(
        max_length=500,
        verbose_name="Event Poster/Cover URL",
        help_text="Direct link to promo poster image."
    )
    date = models.CharField(
        max_length=100,
        verbose_name="Event Date / Timeframe",
        help_text="Formatted date range string. Example: 'Dec 15-20, 2026'."
    )
    location = models.CharField(
        max_length=200,
        verbose_name="Location / Venue",
        help_text="City/Venue or online region. Example: 'Seoul, South Korea', 'Online (ASIA)'."
    )
    prize_pool = models.CharField(
        max_length=100,
        verbose_name="Prize Pool",
        help_text="Total cash reward string. Example: '$2,000,000'."
    )
    status = models.CharField(
        max_length=20,
        verbose_name="Event Status",
        help_text="Current state. Example: 'upcoming', 'ongoing', 'completed'."
    )
    category = models.CharField(
        max_length=50,
        verbose_name="Event Type",
        help_text="Type of match or stage. Example: 'tournament', 'scrim', 'lan'."
    )
    order = models.PositiveIntegerField(
        default=0,
        verbose_name="Display Order",
        help_text="Controls listing order. Lower numbers appear first."
    )

    class Meta:
        db_table = 'client_event'
        ordering = ['order', 'id']
        verbose_name = "Event"
        verbose_name_plural = "Events"

    def __str__(self):
        return f"{self.title} ({self.status})"


class Videos(models.Model):
    organization_slug = models.SlugField(
        max_length=100,
        db_index=True,
        verbose_name="Organization Slug",
        help_text="Unique identifier for the organization (e.g., 'cloud9')."
    )
    youtube_url = models.URLField(
        max_length=500,
        verbose_name="YouTube Video Link",
        help_text="Direct link or embed URL. Example: 'https://youtu.be/sHtBOMbBLZM'."
    )
    category = models.CharField(
        max_length=50,
        verbose_name="Video Category",
        help_text="Grouping tag. Example: 'highlights', 'montage', 'interview'."
    )
    order = models.PositiveIntegerField(
        default=0,
        verbose_name="Display Order",
        help_text="Controls video playlist placement. Lower numbers appear first."
    )

    class Meta:
        db_table = 'client_video'
        ordering = ['order', 'id']
        verbose_name = "Video"
        verbose_name_plural = "Videos"

    def __str__(self):
        return f"Video {self.id} [{self.category}]"