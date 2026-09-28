# Backend/Utils/limits.py
"""
Per-model content retention caps.

On every new row for a tenant, the oldest rows beyond the cap are deleted.
Change LIMITS below to adjust. Applies globally to all tenants.

NOTE: Uses row `id` (autoincrement) to decide "newest". Simpler and safer
than using `order`, because admins may set arbitrary `order` values.
Every new upload gets a higher id, so newest == highest id.
"""


# Global caps. Change these numbers and every tenant gets the new limits.
LIMITS = {
    'hero':       5,
    'about_para': 3,
    'about_stat': 5,
    'events':    15,
    'team':      20,
    'videos':    12,
    'gallery':   25,
}


def trim(model, slug, keep):
    """
    Keep only the newest `keep` rows for `slug`. Delete the rest.

    - "Newest" = highest `id`.
    - Safe to call on every save (cheap if row count <= keep).
    - Deletes cascade to any FK-linked rows automatically.
    - The post_delete signal on each model cleans up image files.
    """
    if not slug or not keep or keep <= 0:
        return

    qs = model.objects.using('tenant').filter(organization_slug=slug)

    # Fast path: if we're already under the cap, do nothing.
    if qs.count() <= keep:
        return

    # Keep only the newest `keep` ids
    keep_ids = list(
        qs.order_by('-id').values_list('id', flat=True)[:keep]
    )

    if keep_ids:
        qs.exclude(id__in=keep_ids).delete()