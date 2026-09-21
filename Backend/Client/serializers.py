# Backend/Client/serializers.py

from rest_framework import serializers
from .models import (
    TenantUser, Hero, About, AboutParagraph, AboutStat,
    Sponsers, Gallery, Team, Events, Videos,
)


class TenantUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = TenantUser
        fields = ['id', 'user', 'organization_slug', 'is_tenant_admin', 'created_at']
        read_only_fields = ['id', 'created_at']


class HeroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hero
        fields = ['id', 'organization_slug', 'image', 'title',
                  'subtitle', 'tag', 'order']
        read_only_fields = ['id']


class AboutParagraphSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutParagraph
        fields = ['id', 'text', 'order']
        read_only_fields = ['id']


class AboutStatSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutStat
        fields = ['id', 'label', 'value', 'order']
        read_only_fields = ['id']


class AboutSerializer(serializers.ModelSerializer):
    paragraphs = AboutParagraphSerializer(many=True, read_only=True)
    stats = AboutStatSerializer(many=True, read_only=True)

    class Meta:
        model = About
        fields = ['id', 'organization_slug', 'heading', 'paragraphs',
                  'stats', 'mission', 'vision']
        read_only_fields = ['id']


class SponsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sponsers
        fields = ['id', 'organization_slug', 'name', 'logo', 'order']
        read_only_fields = ['id']


class GallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = Gallery
        fields = ['id', 'organization_slug', 'title', 'category',
                  'image', 'description', 'aspect_ratio', 'order']
        read_only_fields = ['id']


class TeamSerializer(serializers.ModelSerializer):
    realName = serializers.CharField(source='real_name', required=False, allow_blank=True)

    class Meta:
        model = Team
        fields = ['id', 'organization_slug', 'name', 'realName', 'role',
                  'image', 'instagram', 'tiktok', 'youtube', 'country', 'order']
        read_only_fields = ['id']


class EventsSerializer(serializers.ModelSerializer):
    prizePool = serializers.CharField(source='prize_pool', required=False, allow_blank=True)

    class Meta:
        model = Events
        fields = ['id', 'organization_slug', 'title', 'description', 'image',
                  'date', 'location', 'prizePool', 'status', 'category', 'order']
        read_only_fields = ['id']


class VideosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Videos
        fields = ['id', 'organization_slug', 'youtube_url', 'category', 'order']
        read_only_fields = ['id']