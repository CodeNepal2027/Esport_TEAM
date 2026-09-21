# Esport_TEAM Backend Context

Project: Django backend for a multi-tenant esports template.
Frontend lives in `Frontend/`; backend lives in `Backend/`.

Core idea:
- `default` = master DB (Optech / org registry)
- `tenant` = client DB (per org config/content)
- local dev currently uses SQLite to avoid PostgreSQL dependency

## Key files
- `Backend/Backend/settings.py`
- `Backend/Backend/urls.py`
- `Backend/api/urls.py`
- `Backend/Home/models.py`
- `Backend/Home/views.py`
- `Frontend/src/config/org_config.jsx`
- `Frontend/src/home/Home_API_Fetches.jsx`

## API contract expected by frontend
`/api/resolve-host?host=drsesports.com`
```json
{
  "slug": "drs",
  "domain": "drsesports.com",
  "tier": "pro",
  "status": "active",
  "api_url": "http://127.0.0.1:8000/api",
  "feature_flags": {}
}
```

`/api/config`
```json
{
  "team_tag": "DRS",
  "team_name": "DRS Gaming",
  "team_logo_url": "",
  "color_code_1": "#1577ef",
  "color_code_2": "#FFFFFF",
  "org_domain": "drsesports.com",
  "subscription_tier": "pro",
  "subscription_status": "active",
  "feature_flags": {}
}
```

`/api/hero`, `/api/about`, `/api/sponsors`, `/api/gallery`, `/api/team`, `/api/events`, `/api/videos`

## Important code
```python
# Backend/Backend/settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'master.sqlite3',
    },
    'tenant': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'tenant.sqlite3',
    },
}
```

```python
# Backend/Backend/urls.py
urlpatterns = [
    path('admin/', admin.site.urls),
    path('tenant-admin/', tenant_admin_home, name='tenant_admin'),
    path('api/', include('api.urls')),
]
```

```python
# Backend/api/urls.py
urlpatterns = [
    path('resolve-host', resolve_host, name='resolve_host'),
    path('config', get_config, name='tenant_config'),
    path('hero', hero_view, name='hero'),
    path('about', about_view, name='about'),
    path('sponsors', sponsors_view, name='sponsors'),
    path('gallery', gallery_view, name='gallery'),
    path('team', team_view, name='team'),
    path('events', events_view, name='events'),
    path('videos', videos_view, name='videos'),
]
```

```python
# Backend/Home/models.py
class Organization(models.Model):
    slug = models.CharField(max_length=100, unique=True)
    org_domain = models.CharField(max_length=255, unique=True, blank=True, null=True)
    subscription_tier = models.CharField(max_length=50, default='pro')
    subscription_status = models.CharField(max_length=50, default='active')
    api_url = models.URLField(max_length=500, blank=True, null=True)
    feature_flags = models.JSONField(default=dict, blank=True)
    team_tag = models.CharField(max_length=50, default='TEAM')
    team_name = models.CharField(max_length=255, default='Esports Team')
    team_logo_url = models.URLField(max_length=500, blank=True, null=True)
    color_code_1 = models.CharField(max_length=20, default='#1271ff')
    color_code_2 = models.CharField(max_length=20, default='#003c67')
```

## Current status
- backend app structure is set up
- `api` endpoints are mounted under `/api/`
- `/tenant-admin/` exists as a lightweight client admin page for adding org data to the `tenant` SQLite database
- `Organization` and `HomeContent` models exist
- frontend contract is mapped to backend endpoints
- local dev is using SQLite
- `default` is still for master/admin, `tenant` is for client org records

## Commands
```powershell
cd Backend
..\venv\Scripts\python manage.py makemigrations
..\venv\Scripts\python manage.py migrate
..\venv\Scripts\python manage.py migrate --database=tenant
..\venv\Scripts\python manage.py createsuperuser
..\venv\Scripts\python manage.py createsuperuser --database=tenant
..\venv\Scripts\python manage.py runserver
```

## Tenant admin page
Open this in browser:
```text
http://127.0.0.1:8000/tenant-admin/
```

This page is a lightweight client admin panel for saving organization records into the `tenant` SQLite database. It does not yet implement full authentication or role-based access.

## Rules for continuation
- keep SQLite for local dev
- keep master/tenant split in config
- use `/admin/` for master admin and `/tenant-admin/` for client org management during local development
- do not reintroduce PostgreSQL unless asked
- preserve the frontend API contract
- use `default` as master and `tenant` as client DB

## Short version for another AI
This is a Django backend for a multi-tenant esports template. The frontend expects `/api/resolve-host`, `/api/config`, and `/api/hero|about|sponsors|gallery|team|events|videos`. The app uses SQLite in local development, with `default` as master DB and `tenant` as client DB. A lightweight tenant admin page exists at `/tenant-admin/` for creating/updating client org records in the `tenant` SQLite DB, while `/admin/` is still reserved for the master site admin.
