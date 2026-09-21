"""
Django settings for Backend project.

Master DB (Optech) + Tenant DB (per-org) setup.
Multi-tenant SaaS architecture with JWT + CORS.
"""

import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv

# ============================================
# ENV LOADER
# ============================================
BASE_DIR = Path(__file__).resolve().parent.parent

# Load .env from project root (BASE_DIR)
load_dotenv(BASE_DIR / '.env')


def env(key, default=None, cast=None):
    """Read env var, optionally cast to bool/int/list."""
    value = os.getenv(key, default)
    if value is None:
        return None
    if cast is bool:
        return str(value).lower() in {'1', 'true', 'yes', 'on'}
    if cast is int:
        return int(value)
    if cast is list:
        return [v.strip() for v in str(value).split(',') if v.strip()]
    return value


# ============================================
# CORE
# ============================================
SECRET_KEY = env('DJANGO_SECRET_KEY', 'django-insecure-fallback-change-me')
DEBUG = env('DJANGO_DEBUG', True, cast=bool)
ALLOWED_HOSTS = env('DJANGO_ALLOWED_HOSTS', 'localhost,127.0.0.1', cast=list)


# ============================================
# APPLICATIONS
# ============================================
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',

    # Local apps
    'Master',
    'Client',
    'api',
]


# ============================================
# MIDDLEWARE
# ============================================
MIDDLEWARE = [
    # CORS must be first
    'corsheaders.middleware.CorsMiddleware',

    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'Client.middleware.TenantAdminUserMiddleware', #<-- Tenant switch admin data in tenant db middleware
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


ROOT_URLCONF = 'Backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'Backend.wsgi.application'


# ============================================
# DATABASES — MASTER + TENANT
# ============================================
# default = MASTER (Optech registry + org branding)
# tenant  = CLIENT (per-org content: hero, about, gallery, team, events, videos)

DATABASES = {
    # --------------------------------------------------
    # MASTER (Optech platform)
    # --------------------------------------------------
    'default': {
        'ENGINE': env('MASTER_DB_ENGINE', 'django.db.backends.sqlite3'),
        'NAME': env('MASTER_DB_NAME', str(BASE_DIR / 'master.sqlite3')),
        'USER': env('MASTER_DB_USER', ''),
        'PASSWORD': env('MASTER_DB_PASSWORD', ''),
        'HOST': env('MASTER_DB_HOST', ''),
        'PORT': env('MASTER_DB_PORT', ''),
    },

    # --------------------------------------------------
    # TENANT (per-org content)
    # --------------------------------------------------
    'tenant': {
        'ENGINE': env('TENANT_DB_ENGINE', 'django.db.backends.sqlite3'),
        'NAME': env('TENANT_DB_NAME', str(BASE_DIR / 'tenant.sqlite3')),
        'USER': env('TENANT_DB_USER', ''),
        'PASSWORD': env('TENANT_DB_PASSWORD', ''),
        'HOST': env('TENANT_DB_HOST', ''),
        'PORT': env('TENANT_DB_PORT', ''),
    },
}

# --------------------------------------------------
# DATABASE ROUTERS — decide which DB each model uses
# --------------------------------------------------
DATABASE_ROUTERS = [
    'Master.routers.MasterRouter',
    'Client.routers.ClientRouter',
]


# ============================================
# AUTH BACKENDS — multi-DB admin login
# ============================================
AUTHENTICATION_BACKENDS = [
    # /admin/ — Django default admin reads from default (master) DB
    'django.contrib.auth.backends.ModelBackend',

    # /tenant-admin/ — client admin reads from tenant DB
    'Client.auth_backend.TenantAuthBackend',
]


# ============================================
# PASSWORD VALIDATION
# ============================================
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]


# ============================================
# I18N / TIMEZONE
# ============================================
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True


# ============================================
# STATIC / MEDIA
# ============================================
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

MEDIA_URL = 'media/'
MEDIA_ROOT = BASE_DIR / 'media'


# ============================================
# DEFAULT AUTO FIELD
# ============================================
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# ============================================
# DJANGO REST FRAMEWORK
# ============================================
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
        # Uncomment in dev only:
        'rest_framework.renderers.BrowsableAPIRenderer',
    ),
}


# ============================================
# SIMPLE JWT
# ============================================
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME':  timedelta(minutes=env('JWT_ACCESS_LIFETIME_MINUTES', 60, cast=int)),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=env('JWT_REFRESH_LIFETIME_DAYS', 7, cast=int)),
    'ROTATE_REFRESH_TOKENS':  True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,

    'ALGORITHM': 'HS256',
    'SIGNING_KEY': env('JWT_SIGNING_KEY', SECRET_KEY),
    'VERIFYING_KEY': None,

    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',

    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
    'JTI_CLAIM': 'jti',
}


# ============================================
# CORS
# ============================================
CORS_ALLOWED_ORIGINS = env(
    'CORS_ALLOWED_ORIGINS',
    'http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174,http://localhost:3000',
    cast=list,
)
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
    'x-tenant',           # custom header for tenant-aware requests
]


# ============================================
# CSRF (for admin / session auth)
# ============================================
CSRF_TRUSTED_ORIGINS = CORS_ALLOWED_ORIGINS


# ============================================
# EMAIL
# ============================================
EMAIL_BACKEND = env('EMAIL_BACKEND', 'django.core.mail.backends.console.EmailBackend')

if EMAIL_BACKEND.endswith('smtp.EmailBackend'):
    EMAIL_HOST = env('EMAIL_HOST', '')
    EMAIL_PORT = env('EMAIL_PORT', 587, cast=int)
    EMAIL_USE_TLS = env('EMAIL_USE_TLS', True, cast=bool)
    EMAIL_HOST_USER = env('EMAIL_HOST_USER', '')
    EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD', '')


# ============================================
# LOGGING (helpful for debugging multi-DB)
# ============================================
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {'class': 'logging.StreamHandler'},
    },
    'loggers': {
        'django.db.backends': {
            'level': 'INFO' if DEBUG else 'WARNING',
            'handlers': ['console'],
        },
    },
}