# Backend/Client/startup_trim.py
"""
Self-healing retention sweep.

Runs on every server startup / migrate (via Django's post_migrate signal).
Auto-discovers tenants from the data itself — no slug is ever hardcoded.
Add a new org tomorrow, restart the server, it's covered automatically.

Works alongside the on-save trim in models.py:
    - on-save trim   → prevents new uploads from exceeding the cap
    - startup trim   → cleans up any drift on every boot / migrate
"""

import logging

from django.db.models.signals import post_migrate
from django.dispatch import receiver

logger = logging.getLogger(__name__)


def _discover_tenants():
    """
    Return the set of every organization_slug that has at least one row
    in any content table. Add new models to the tuple below and they'll
    be discovered automatically.
    """
    from Client.models import (
        Hero, Gallery, Team, Events, Videos, About, Sponsers,
    )

    slugs = set()
    for model in (Hero, Gallery, Team, Events, Videos, About, Sponsers):
        try:
            values = (
                model.objects.using('tenant')
                     .values_list('organization_slug', flat=True)
                     .distinct()
            )
            for s in values:
                if s:
                    slugs.add(s)
        except Exception as e:
            logger.warning(
                f"[startup_trim] could not list slugs from "
                f"{model.__name__}: {e}"
            )
    return slugs


def _trim_all():
    """
    Sweep every tenant. Returns total rows deleted.
    Safe to call many times — no-op if nothing is over the limit.
    """
    try:
        from Client.models import (
            Hero, Gallery, Team, Events, Videos,
            About, AboutParagraph, AboutStat,
        )
        from Utils.limits import LIMITS
    except Exception as e:
        logger.warning(f"[startup_trim] import failed: {e}")
        return 0

    slugs = _discover_tenants()
    if not slugs:
        return 0

    total_deleted = 0

    # Top-level sections — one sweep per section per tenant
    TOP_LEVEL = (
        (Hero,     'hero'),
        (Gallery,  'gallery'),
        (Team,     'team'),
        (Events,   'events'),
        (Videos,   'videos'),
    )

    for slug in slugs:
        try:
            for model, key in TOP_LEVEL:
                qs = model.objects.using('tenant').filter(organization_slug=slug)
                keep = LIMITS[key]
                if qs.count() <= keep:
                    continue
                keep_ids = list(
                    qs.order_by('-id').values_list('id', flat=True)[:keep]
                )
                if keep_ids:
                    deleted, _ = qs.exclude(id__in=keep_ids).delete()
                    total_deleted += deleted

            # Nested: About → paragraphs + stats
            about = (
                About.objects.using('tenant')
                    .filter(organization_slug=slug)
                    .first()
            )
            if about:
                for model, key in (
                    (AboutParagraph, 'about_para'),
                    (AboutStat,      'about_stat'),
                ):
                    qs = model.objects.using('tenant').filter(about_id=about.id)
                    keep = LIMITS[key]
                    if qs.count() <= keep:
                        continue
                    keep_ids = list(
                        qs.order_by('-id').values_list('id', flat=True)[:keep]
                    )
                    if keep_ids:
                        deleted, _ = qs.exclude(id__in=keep_ids).delete()
                        total_deleted += deleted

        except Exception as e:
            logger.warning(f"[startup_trim] tenant {slug}: {e}")

    if total_deleted:
        logger.info(
            f"[startup_trim] trimmed {total_deleted} rows "
            f"across {len(slugs)} tenants"
        )
    return total_deleted


@receiver(post_migrate)
def _run_startup_trim(sender, **kwargs):
    """Trigger a full sweep on every `migrate` / server start."""
    if sender.name != 'Client':
        return
    _trim_all()