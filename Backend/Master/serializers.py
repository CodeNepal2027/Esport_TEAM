# # Backend/Master/serializers.py

# from rest_framework import serializers
# from .models import Organization


# class OrganizationsSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Organization
#         fields = [
#             'id', 'slug', 'org_domain', 'api_url',
#             'team_tag', 'team_name', 'team_logo_url',
#             'color_code_1', 'color_code_2',
#             'org_shop', 'org_achievements',
#             'org_youtube_link', 'org_tiktok_link', 'org_instagram_link',
#             'org_discord_link', 'org_twitter_link',
#             'org_country', 'org_address',
#             'org_working_day', 'org_working_hour',
#             'org_email', 'org_whatsapp',
#             'org_phone_1', 'org_phone_2',
#             'subscription_tier', 'subscription_status',
#             'feature_flags',
#             'created_at', 'updated_at',
#         ]
#         read_only_fields = ['id', 'created_at', 'updated_at']





## ***************************** [ New Updated code FROM IMAGE URL to IMAGE FILE (2026/10/03) ] 
# Backend/Master/serializers.py

from rest_framework import serializers
from Master.models import Organization


def _absolute(request, url):
    """Turn a relative /media/... URL into an absolute one."""
    if not url:
        return ''
    if url.startswith(('http://', 'https://')):
        return url
    if request:
        return request.build_absolute_uri(url)
    return url


class OrganizationsSerializer(serializers.ModelSerializer):
    # Computed field exposed AS `team_logo_url` so the frontend never changes.
    team_logo_url = serializers.SerializerMethodField()

    class Meta:
        model = Organization
        fields = [
            'id', 'slug', 'org_domain', 'api_url',

            'team_tag', 'team_name',

            # Response key (read): computed logo (file wins, URL fallback)
            'team_logo_url',

            # Write targets for the admin API
            'team_logo_file',

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
        read_only_fields = ['id', 'team_logo_url', 'created_at', 'updated_at']
        extra_kwargs = {
            'team_logo_file': {'required': False, 'allow_null': True},
        }

    def get_team_logo_url(self, obj):
        return _absolute(self.context.get('request'), obj.logo)