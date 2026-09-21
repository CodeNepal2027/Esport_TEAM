# Backend/Master/models.py

from django.db import models


class Organization(models.Model):
    """
    MASTER DB — full public org identity + subscription.
    Readable by anyone (frontend needs theme, name, colors).
    Writable only by staff.
    """

    # ----- Identity -----
    slug = models.SlugField(unique=True, max_length=100, help_text="Esport tag url in small eg:- drs, t2k, horra, asl,..etc  ")
    org_domain = models.CharField(max_length=255, unique=True, blank=True, null=True, help_text="domain name. eg:- https://t2kesports.com.np")
    api_url = models.URLField(max_length=500, blank=True, null=True, help_text="Master DB Backend API Url. eg:- https://optech-esports.com/api/master/organizations/")

    # ----- Team / Brand (PUBLIC) -----
    team_tag = models.CharField(max_length=50, default='TEAM', help_text="eg:- t2k, drs, horra, ..etc")
    team_name = models.CharField(max_length=255, default='Esports Team', help_text="eg:- Trained To Kill, Horra Esports, Abrupt Slayers, ..etc")
    team_logo_url = models.URLField(max_length=500, blank=True, null=True)
    color_code_1 = models.CharField(max_length=20, default='#1271ff')
    color_code_2 = models.CharField(max_length=20, default='#003c67')

    # ----- Subdomains -----
    org_shop = models.URLField(max_length=500, blank=True, null=True, help_text="shop site url. eg:- https://shop.optech-esports.com.np/")
    org_achievements = models.URLField(max_length=500, blank=True, null=True, help_text="achivement site url .eg:- eg:- https://achivement.optech-esports.com.np/")

    # ----- Socials -----
    org_youtube_link = models.URLField(max_length=500, blank=True, null=True)
    org_tiktok_link = models.URLField(max_length=500, blank=True, null=True)
    org_instagram_link = models.URLField(max_length=500, blank=True, null=True)
    org_discord_link = models.URLField(max_length=500, blank=True, null=True)
    org_twitter_link = models.URLField(max_length=500, blank=True, null=True)

    # ----- Contact / Address -----
    org_country = models.CharField(max_length=100, blank=True, null=True)
    org_address = models.CharField(max_length=255, blank=True, null=True)
    org_working_day = models.CharField(max_length=100, blank=True, null=True)
    org_working_hour = models.CharField(max_length=100, blank=True, null=True)
    org_email = models.EmailField(blank=True, null=True)
    org_whatsapp = models.CharField(max_length=50, blank=True, null=True)
    org_phone_1 = models.CharField(max_length=50, blank=True, null=True)
    org_phone_2 = models.CharField(max_length=50, blank=True, null=True)

    # ----- Subscription / Platform (staff-only view later) -----
    subscription_tier = models.CharField(max_length=50, default='pro')
    subscription_status = models.CharField(max_length=50, default='active')
    feature_flags = models.JSONField(default=dict, blank=True)

    # ----- Meta -----
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'master_organization'
        ordering = ['slug']

    def __str__(self):
        return f'{self.slug} — {self.team_name}'