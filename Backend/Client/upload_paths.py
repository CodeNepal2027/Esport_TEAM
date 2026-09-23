# Backend/Client/upload_paths.py
"""
Tenant-scoped upload path helpers.

Every uploaded file goes to:

    <subfolder>/<tenant_slug>/<YYYY>/<MM>/<uuid>.<ext>

Example:
    hero/optech/2026/09/7c9a1b2e3f4d5e6f.jpg
    team/drs/2026/09/1f2a3b4c5d6e7f8a.webp

Design goals:
    - One folder per tenant → easy backups, deletions, quotas.
    - UUID filenames → no collisions, no guessable URLs.
    - Date subfolders → no single directory grows unbounded.
    - Works identically on local disk and S3/R2 (via django-storages).

NOTE: Each upload_to MUST be a top-level function (not a closure / factory)
    so Django's migration serializer can reference it by dotted path.
    That's why there are 5 near-identical functions below instead of
    a single factory. It's verbose but required.
"""

import os
import uuid
from django.utils import timezone


# Only these extensions are allowed — anything else is dropped
ALLOWED_IMAGE_EXTENSIONS = {
    '.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif',
}

MAX_SLUG_LENGTH = 60


def _safe_slug(value):
    """Turn an arbitrary organization_slug into a filesystem-safe segment."""
    if not value:
        return 'unknown'
    s = str(value).strip().lower()
    s = ''.join(c for c in s if c.isalnum() or c in ('-', '_'))
    s = s[:MAX_SLUG_LENGTH]
    return s or 'unknown'


def _safe_extension(filename):
    """Extract and whitelist the file extension. Empty string if not allowed."""
    ext = os.path.splitext(filename or '')[1].lower()
    return ext if ext in ALLOWED_IMAGE_EXTENSIONS else ''


def _build_path(instance, filename, subfolder):
    """
    Shared path builder. Called by every upload_to function below.
    Keeps logic in one place without using a closure at module level.
    """
    slug = _safe_slug(getattr(instance, 'organization_slug', None))
    ext = _safe_extension(filename)
    name = f"{uuid.uuid4().hex}{ext}"
    now = timezone.now()
    return f"{subfolder}/{slug}/{now:%Y}/{now:%m}/{name}"


# ============================================
# One function per subfolder — Django needs top-level
# functions it can reference by dotted path in migrations.
# ============================================

def hero_upload_to(instance, filename):
    return _build_path(instance, filename, 'hero')


def sponsors_upload_to(instance, filename):
    return _build_path(instance, filename, 'sponsors')


def gallery_upload_to(instance, filename):
    return _build_path(instance, filename, 'gallery')


def team_upload_to(instance, filename):
    return _build_path(instance, filename, 'team')


def events_upload_to(instance, filename):
    return _build_path(instance, filename, 'events')