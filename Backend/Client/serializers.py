# # Backend/Client/serializers.py

# from rest_framework import serializers
# from .models import (
#     TenantUser, Hero, About, AboutParagraph, AboutStat,
#     Sponsers, Gallery, Team, Events, Videos,
# )


# class TenantUserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = TenantUser
#         fields = ['id', 'user', 'organization_slug', 'is_tenant_admin', 'created_at']
#         read_only_fields = ['id', 'created_at']


# class HeroSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Hero
#         fields = ['id', 'organization_slug', 'image', 'title',
#                   'subtitle', 'tag', 'order']
#         read_only_fields = ['id']


# class AboutParagraphSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = AboutParagraph
#         fields = ['id', 'text', 'order']
#         read_only_fields = ['id']


# class AboutStatSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = AboutStat
#         fields = ['id', 'label', 'value', 'order']
#         read_only_fields = ['id']


# class AboutSerializer(serializers.ModelSerializer):
#     paragraphs = AboutParagraphSerializer(many=True, read_only=True)
#     stats = AboutStatSerializer(many=True, read_only=True)

#     class Meta:
#         model = About
#         fields = ['id', 'organization_slug', 'heading', 'paragraphs',
#                   'stats', 'mission', 'vision']
#         read_only_fields = ['id']


# class SponsersSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Sponsers
#         fields = ['id', 'organization_slug', 'name', 'logo', 'order']
#         read_only_fields = ['id']


# class GallerySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Gallery
#         fields = ['id', 'organization_slug', 'title', 'category',
#                   'image', 'description', 'aspect_ratio', 'order']
#         read_only_fields = ['id']


# class TeamSerializer(serializers.ModelSerializer):
#     realName = serializers.CharField(source='real_name', required=False, allow_blank=True)

#     class Meta:
#         model = Team
#         fields = ['id', 'organization_slug', 'name', 'realName', 'role',
#                   'image', 'instagram', 'tiktok', 'youtube', 'country', 'order']
#         read_only_fields = ['id']


# class EventsSerializer(serializers.ModelSerializer):
#     prizePool = serializers.CharField(source='prize_pool', required=False, allow_blank=True)

#     class Meta:
#         model = Events
#         fields = ['id', 'organization_slug', 'title', 'description', 'image',
#                   'date', 'location', 'prizePool', 'status', 'category', 'order']
#         read_only_fields = ['id']


# class VideosSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Videos
#         fields = ['id', 'organization_slug', 'youtube_url', 'category', 'order']
#         read_only_fields = ['id']



# ============== [ New Updated code FROM IMAGE URL to IMAGE FILE ] ==================
# Backend/Client/serializers.py

from rest_framework import serializers
from Client.models import (
    TenantUser, Hero, About, AboutParagraph, AboutStat,
    Sponsers, Gallery, Team, Events, Videos,
)


def _absolute(request, url):
    """
    Turn a relative /media/... URL into an absolute one.

    - If already absolute (http:// or https://), returns as-is.
    - If a request is available, uses request.build_absolute_uri().
    - Falls back to returning the raw value when neither applies.
    """
    if not url:
        return ''
    if url.startswith(('http://', 'https://')):
        return url
    if request:
        return request.build_absolute_uri(url)
    return url


class TenantUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = TenantUser
        fields = ['id', 'user', 'organization_slug', 'is_tenant_admin', 'created_at']
        read_only_fields = ['id', 'created_at']


class HeroSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Hero
        fields = [
            'id', 'organization_slug',
            'image',                    # computed (read-only)
            'image_url', 'image_file',  # write targets
            'title', 'subtitle', 'tag', 'order',
        ]
        read_only_fields = ['id', 'image']
        extra_kwargs = {
            'image_url':  {'required': False, 'allow_blank': True},
            'image_file': {'required': False, 'allow_null': True},
        }

    def get_image(self, obj):
        return _absolute(self.context.get('request'), obj.image)


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
    logo = serializers.SerializerMethodField()

    class Meta:
        model = Sponsers
        fields = [
            'id', 'organization_slug', 'name',
            'logo',                   # computed (read-only)
            'logo_url', 'logo_file',  # write targets
            'order',
        ]
        read_only_fields = ['id', 'logo']
        extra_kwargs = {
            'logo_url':  {'required': False, 'allow_blank': True},
            'logo_file': {'required': False, 'allow_null': True},
        }

    def get_logo(self, obj):
        return _absolute(self.context.get('request'), obj.logo)


class GallerySerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Gallery
        fields = [
            'id', 'organization_slug', 'title', 'category',
            'image',                    # computed (read-only)
            'image_url', 'image_file',  # write targets
            'description', 'aspect_ratio', 'order',
        ]
        read_only_fields = ['id', 'image']
        extra_kwargs = {
            'image_url':  {'required': False, 'allow_blank': True},
            'image_file': {'required': False, 'allow_null': True},
        }

    def get_image(self, obj):
        return _absolute(self.context.get('request'), obj.image)


class TeamSerializer(serializers.ModelSerializer):
    realName = serializers.CharField(source='real_name', required=False, allow_blank=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Team
        fields = [
            'id', 'organization_slug', 'name', 'realName', 'role',
            'image',                    # computed (read-only)
            'image_url', 'image_file',  # write targets
            'instagram', 'tiktok', 'youtube', 'country', 'order',
        ]
        read_only_fields = ['id', 'image']
        extra_kwargs = {
            'image_url':  {'required': False, 'allow_blank': True},
            'image_file': {'required': False, 'allow_null': True},
        }

    def get_image(self, obj):
        return _absolute(self.context.get('request'), obj.image)


class EventsSerializer(serializers.ModelSerializer):
    prizePool = serializers.CharField(source='prize_pool', required=False, allow_blank=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Events
        fields = [
            'id', 'organization_slug', 'title', 'description',
            'image',                    # computed (read-only)
            'image_url', 'image_file',  # write targets
            'date', 'location', 'prizePool', 'status', 'category', 'order',
        ]
        read_only_fields = ['id', 'image']
        extra_kwargs = {
            'image_url':  {'required': False, 'allow_blank': True},
            'image_file': {'required': False, 'allow_null': True},
        }

    def get_image(self, obj):
        return _absolute(self.context.get('request'), obj.image)


class VideosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Videos
        fields = ['id', 'organization_slug', 'youtube_url', 'category', 'order']
        read_only_fields = ['id']