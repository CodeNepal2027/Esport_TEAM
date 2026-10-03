# Backend/Master/upload_paths.py
"""
Upload path helper for the Master DB's Organization logo.

Where the file lands:
    master_logos/<slug>/<YYYY>/<MM>/<uuid>.<ext>

Same conventions as Client uploads:
    - UUID filename → no collisions, no guessable URLs
    - Slug-scoped folder → clean per-org storage
    - Date subfolders → no single directory grows unbounded
    - Top-level function (not closure) → migration-serializable
"""

import os
import uuid
from django.utils import timezone


ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif'}
MAX_SLUG_LENGTH = 60


def _safe_slug(value):
    if not value:
        return 'unknown'
    s = str(value).strip().lower()
    s = ''.join(c for c in s if c.isalnum() or c in ('-', '_'))
    return (s[:MAX_SLUG_LENGTH]) or 'unknown'


def _safe_ext(filename):
    ext = os.path.splitext(filename or '')[1].lower()
    return ext if ext in ALLOWED_EXTENSIONS else ''


def org_logo_upload_to(instance, filename):
    """Store uploaded org logos under master_logos/<slug>/YYYY/MM/<uuid>.<ext>."""
    slug = _safe_slug(getattr(instance, 'slug', None))
    ext = _safe_ext(filename)
    name = f"{uuid.uuid4().hex}{ext}"
    now = timezone.now()
    return f"master_logos/{slug}/{now:%Y}/{now:%m}/{name}"