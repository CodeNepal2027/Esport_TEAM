# Backend/api/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter

# Master
from Master.views import (
    resolve_host,
    get_config as master_get_config,
    OrganizationsViewSet as MasterOrganizationsViewSet,
)

# Client
from Client.views import (
    hero_view, about_view, sponsors_view, gallery_view,
    team_view, events_view, videos_view,
    HeroViewSet, AboutViewSet, SponsersViewSet,
    GalleryViewSet, TeamViewSet, EventsViewSet, VideosViewSet,
)


router = DefaultRouter()

# Master admin CRUD — public read + staff write
router.register(
    r'master/organizations',
    MasterOrganizationsViewSet,
    basename='master-organizations',
)

# Client admin CRUD
router.register(r'admin/hero',     HeroViewSet,     basename='client-hero')
router.register(r'admin/about',    AboutViewSet,    basename='client-about')
router.register(r'admin/sponsors', SponsersViewSet, basename='client-sponsors')
router.register(r'admin/gallery',  GalleryViewSet,  basename='client-gallery')
router.register(r'admin/team',     TeamViewSet,     basename='client-team')
router.register(r'admin/events',   EventsViewSet,   basename='client-events')
router.register(r'admin/videos',   VideosViewSet,   basename='client-videos')


urlpatterns = [
    # Public — master
    path('resolve-host', resolve_host,      name='resolve_host'),
    path('config',       master_get_config, name='tenant_config'),

    # Public — client content
    path('hero',     hero_view,     name='hero'),
    path('about',    about_view,    name='about'),
    path('sponsors', sponsors_view, name='sponsors'),
    path('gallery',  gallery_view,  name='gallery'),
    path('team',     team_view,     name='team'),
    path('events',   events_view,   name='events'),
    path('videos',   videos_view,   name='videos'),

    # Admin CRUD
    path('', include(router.urls)),
]