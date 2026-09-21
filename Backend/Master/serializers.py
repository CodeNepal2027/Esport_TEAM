# Backend/Master/serializers.py

from rest_framework import serializers
from .models import Organization


class OrganizationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = [
            'id', 'slug', 'org_domain', 'api_url',
            'team_tag', 'team_name', 'team_logo_url',
            'color_code_1', 'color_code_2',
            'org_shop', 'org_achievements',
            'org_youtube_link', 'org_tiktok_link', 'org_instagram_link',
            'org_discord_link', 'org_twitter_link',
            'org_country', 'org_address',
            'org_working_day', 'org_working_hour',
            'org_email', 'org_whatsapp',
            'org_phone_1', 'org_phone_2',
            'subscription_tier', 'subscription_status',
            'feature_flags',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']