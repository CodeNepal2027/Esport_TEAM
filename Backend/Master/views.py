# Backend/Master/views.py

from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.response import Response

from .models import Organization
from .serializers import OrganizationsSerializer


# ============================================
# HELPERS
# ============================================
def _normalize_host(value):
    if not value:
        return ''
    host = value.strip().lower()
    host = host.replace('https://', '').replace('http://', '')
    host = host.split('/')[0]
    host = host.replace('www.', '')
    return host


# ============================================
# PUBLIC — /api/resolve-host?host=drsesports.com
# ============================================
@api_view(['GET'])
@permission_classes([AllowAny])
def resolve_host(request):
    host = _normalize_host(
        request.GET.get('host') or request.GET.get('domain') or ''
    )
    if not host:
        return Response(
            {'error': 'Host is required'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    org = (
        Organization.objects.filter(org_domain=host).first()
        or Organization.objects.filter(slug=host.split('.')[0]).first()
    )

    if not org:
        return Response({
            'slug': 'demo',
            'domain': host,
            'tier': 'free',
            'status': 'active',
            'api_url': 'http://127.0.0.1:8000/api',
            'feature_flags': {},
        })

    return Response({
        'slug': org.slug,
        'domain': org.org_domain or host,
        'tier': org.subscription_tier,
        'status': org.subscription_status,
        'api_url': org.api_url or 'http://127.0.0.1:8000/api',
        'feature_flags': org.feature_flags or {},
    })


# ============================================
# PUBLIC — /api/config (branding for current host)
# ============================================
@api_view(['GET'])
@permission_classes([AllowAny])
def get_config(request):
    host = _normalize_host(
        request.GET.get('host')
        or request.GET.get('domain')
        or request.META.get('HTTP_HOST', '')
    )
    slug = request.GET.get('slug') or (host.split('.')[0] if host else None)

    org = (
        Organization.objects.filter(org_domain=host).first()
        or Organization.objects.filter(slug=slug).first()
    )

    if not org:
        return Response({
            'team_tag': 'OPTECH',
            'team_name': 'OPTECH Esports',
            'team_logo_url': '',
            'color_code_1': '#1271ff',
            'color_code_2': '#003c67',
            'org_shop': '',
            'org_achievements': '',
            'org_youtube_link': '',
            'org_tiktok_link': '',
            'org_instagram_link': '',
            'org_discord_link': '',
            'org_twitter_link': '',
            'org_country': '',
            'org_address': '',
            'org_working_day': '',
            'org_working_hour': '',
            'org_email': '',
            'org_whatsapp': '',
            'org_phone_1': '',
            'org_phone_2': '',
        })

    return Response(OrganizationsSerializer(org).data)


# ============================================
# ADMIN — public read + staff write
# ============================================
class OrganizationsViewSet(viewsets.ModelViewSet):
    queryset = Organization.objects.all().order_by('slug')
    serializer_class = OrganizationsSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'

    def get_queryset(self):
        qs = super().get_queryset()
        tier = self.request.query_params.get('tier')
        status_q = self.request.query_params.get('status')
        if tier:
            qs = qs.filter(subscription_tier=tier)
        if status_q:
            qs = qs.filter(subscription_status=status_q)
        return qs