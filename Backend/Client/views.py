# Backend/Client/views.py

from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response

from .models import Hero, About, Sponsers, Gallery, Team, Events, Videos
from .serializers import (
    HeroSerializer, AboutSerializer, SponsersSerializer,
    GallerySerializer, TeamSerializer, EventsSerializer, VideosSerializer,
)


# Backend/Client/views.py

from django.conf import settings


def _normalize_host(value):
    if not value:
        return ''
    host = value.strip().lower()
    host = host.replace('https://', '').replace('http://', '')
    host = host.split('/')[0]
    host = host.replace('www.', '')
    return host


def _resolve_slug(request):
    """
    Priority:
        1. X-Tenant header
        2. ?slug=
        3. ?host= / ?domain=
        4. HTTP_HOST
        5. DEFAULT_TENANT_SLUG (from settings/env)
    """
    # 1. Header
    slug = request.headers.get('X-Tenant')
    if slug:
        return slug.strip().lower()

    # 2. Explicit slug param
    slug = request.GET.get('slug')
    if slug:
        return slug.strip().lower()

    # 3. host / domain params
    host = _normalize_host(
        request.GET.get('host')
        or request.GET.get('domain')
        or ''
    )

    # 4. Real HTTP_HOST
    if not host:
        host = _normalize_host(request.META.get('HTTP_HOST', ''))

    # 5. Fallback for localhost / bare IP
    if not host or host in ('localhost', '127.0.0.1', '0.0.0.0'):
        return getattr(settings, 'DEFAULT_TENANT_SLUG', None)

    if host.replace('.', '').isdigit():
        return getattr(settings, 'DEFAULT_TENANT_SLUG', None)

    # 6. First segment
    first = host.split('.')[0]
    if first in ('www', 'localhost'):
        return getattr(settings, 'DEFAULT_TENANT_SLUG', None)
    return first


# ============================================
# PUBLIC — section endpoints
# ============================================
@api_view(['GET'])
@permission_classes([AllowAny])
def hero_view(request):
    slug = _resolve_slug(request)
    qs = Hero.objects.filter(organization_slug=slug).order_by('order', 'id')
    return Response({'slides': HeroSerializer(qs, many=True).data})


@api_view(['GET'])
@permission_classes([AllowAny])
def about_view(request):
    slug = _resolve_slug(request)
    about = About.objects.filter(organization_slug=slug).first()
    if not about:
        return Response({})
    return Response(AboutSerializer(about).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def sponsors_view(request):
    slug = _resolve_slug(request)
    qs = Sponsers.objects.filter(organization_slug=slug).order_by('order', 'id')
    return Response(SponsersSerializer(qs, many=True).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def gallery_view(request):
    slug = _resolve_slug(request)
    qs = Gallery.objects.filter(organization_slug=slug)
    cat = request.GET.get('category')
    if cat and cat != 'all':
        qs = qs.filter(category=cat)
    qs = qs.order_by('order', 'id')
    return Response(GallerySerializer(qs, many=True).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def team_view(request):
    slug = _resolve_slug(request)
    qs = Team.objects.filter(organization_slug=slug).order_by('order', 'id')
    return Response(TeamSerializer(qs, many=True).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def events_view(request):
    slug = _resolve_slug(request)
    qs = Events.objects.filter(organization_slug=slug)
    st = request.GET.get('status')
    cat = request.GET.get('category')
    if st and st != 'all':
        qs = qs.filter(status=st)
    if cat and cat != 'all':
        qs = qs.filter(category=cat)
    qs = qs.order_by('order', 'id')
    return Response(EventsSerializer(qs, many=True).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def videos_view(request):
    slug = _resolve_slug(request)
    qs = Videos.objects.filter(organization_slug=slug)
    cat = request.GET.get('category')
    if cat and cat != 'all':
        qs = qs.filter(category=cat)
    qs = qs.order_by('order', 'id')
    return Response(VideosSerializer(qs, many=True).data)


# ============================================
# ADMIN CRUD — ViewSets
# ============================================
class _ScopedViewSet(viewsets.ModelViewSet):
    """
    Staff-only CRUD, scoped by ?slug= for filtering.
    """
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        qs = super().get_queryset()
        slug = self.request.query_params.get('slug')
        if slug:
            qs = qs.filter(organization_slug=slug)
        return qs


class HeroViewSet(_ScopedViewSet):
    queryset = Hero.objects.all()
    serializer_class = HeroSerializer


class AboutViewSet(_ScopedViewSet):
    queryset = About.objects.all()
    serializer_class = AboutSerializer


class SponsersViewSet(_ScopedViewSet):
    queryset = Sponsers.objects.all()
    serializer_class = SponsersSerializer


class GalleryViewSet(_ScopedViewSet):
    queryset = Gallery.objects.all()
    serializer_class = GallerySerializer


class TeamViewSet(_ScopedViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer


class EventsViewSet(_ScopedViewSet):
    queryset = Events.objects.all()
    serializer_class = EventsSerializer


class VideosViewSet(_ScopedViewSet):
    queryset = Videos.objects.all()
    serializer_class = VideosSerializer