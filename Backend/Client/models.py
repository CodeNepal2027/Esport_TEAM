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
    )
    organization_slug = models.SlugField(max_length=100, db_index=True)
    is_tenant_admin = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'client_tenant_user'

    def __str__(self):
        return f'{self.user.username} → {self.organization_slug}'


# ============================================
# CONTENT MODELS
# ============================================
class Hero(models.Model):
    organization_slug = models.SlugField(max_length=100, db_index=True)
    image = models.URLField(max_length=500)
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=200, blank=True)
    tag = models.CharField(max_length=100, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'client_hero'
        ordering = ['order', 'id']

    def __str__(self):
        return f'{self.organization_slug} — {self.title}'


class About(models.Model):
    organization_slug = models.SlugField(max_length=100, db_index=True)
    heading = models.CharField(max_length=255, default='Professional Esports Organizations')
    mission = models.TextField(blank=True)
    vision = models.TextField(blank=True)

    class Meta:
        db_table = 'client_about'

    def __str__(self):
        return f'{self.organization_slug} — About'


class AboutParagraph(models.Model):
    about = models.ForeignKey(About, on_delete=models.CASCADE, related_name='paragraphs')
    text = models.TextField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'client_about_paragraph'
        ordering = ['order', 'id']


class AboutStat(models.Model):
    about = models.ForeignKey(About, on_delete=models.CASCADE, related_name='stats')
    label = models.CharField(max_length=100)
    value = models.CharField(max_length=50)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'client_about_stat'
        ordering = ['order', 'id']


class Sponsers(models.Model):
    organization_slug = models.SlugField(max_length=100, db_index=True)
    name = models.CharField(max_length=100)
    logo = models.URLField(max_length=500)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'client_sponsor'
        ordering = ['order', 'id']


class Gallery(models.Model):
    organization_slug = models.SlugField(max_length=100, db_index=True)
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=50)
    image = models.URLField(max_length=500)
    description = models.TextField(blank=True)
    aspect_ratio = models.CharField(max_length=10, default='4/3')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'client_gallery'
        ordering = ['order', 'id']


class Team(models.Model):
    organization_slug = models.SlugField(max_length=100, db_index=True)
    name = models.CharField(max_length=100)
    real_name = models.CharField(max_length=200, blank=True)
    role = models.CharField(max_length=100)
    image = models.URLField(max_length=500)
    instagram = models.URLField(max_length=500, blank=True)
    tiktok = models.URLField(max_length=500, blank=True)
    youtube = models.URLField(max_length=500, blank=True)
    country = models.CharField(max_length=20, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'client_team'
        ordering = ['order', 'id']


class Events(models.Model):
    organization_slug = models.SlugField(max_length=100, db_index=True)
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.URLField(max_length=500)
    date = models.CharField(max_length=100)
    location = models.CharField(max_length=200)
    prize_pool = models.CharField(max_length=100)
    status = models.CharField(max_length=20)
    category = models.CharField(max_length=50)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'client_event'
        ordering = ['order', 'id']
    


class Videos(models.Model):
    organization_slug = models.SlugField(max_length=100, db_index=True)
    youtube_url = models.URLField(max_length=500)
    category = models.CharField(max_length=50)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'client_video'
        ordering = ['order', 'id']