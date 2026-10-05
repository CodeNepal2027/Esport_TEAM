# Backend/Utils/file_cleanup.py
"""
Auto-delete old files when a FileField is replaced or a row is deleted.

Django's FileField does NOT delete the previous file when a new one
is uploaded, and post_delete doesn't clean files either. This utility
installs both hooks via register_file_cleanup(Model, [field_names]).
"""

import logging

from django.db import router
from django.db.models.signals import pre_save, post_delete
from django.core.files.storage import default_storage

logger = logging.getLogger(__name__)


# ============================================
# LOW-LEVEL
# ============================================
def delete_field_file(field_file):
    """
    Delete a file from storage.

    Accepts either a FieldFile/ImageFieldFile or a raw name string.
    Never raises.
    """
    if not field_file:
        return

    name = getattr(field_file, "name", field_file)
    storage = getattr(field_file, "storage", None) or default_storage

    if not name:
        return

    try:
        if storage.exists(name):
            storage.delete(name)
    except Exception as e:
        logger.warning(f"[file_cleanup] failed to delete {name!r}: {e}")


def _fetch_old_name(sender, pk, field_name):
    """Return the previously stored file name (str) or None."""
    try:
        db = router.db_for_read(sender)
        return (
            sender._base_manager
            .using(db)
            .filter(pk=pk)
            .values_list(field_name, flat=True)
            .first()
        )
    except Exception as e:
        logger.warning(f"[file_cleanup] could not fetch old {field_name}: {e}")
        return None


# ============================================
# SIGNAL HANDLERS
# ============================================
def _on_post_delete(sender, instance, **kwargs):
    for field_name in getattr(sender, '_file_cleanup_fields', []):
        delete_field_file(getattr(instance, field_name, None))


def _on_pre_save(sender, instance, **kwargs):
    field_names = getattr(sender, '_file_cleanup_fields', [])
    if not instance.pk or not field_names:
        return

    for field_name in field_names:
        new_value = getattr(instance, field_name, None)
        new_name = getattr(new_value, "name", None)
        old_name = _fetch_old_name(sender, instance.pk, field_name)

        # Nothing stored before → nothing to clean.
        if not old_name:
            continue

        # Field replaced (new name different) OR cleared (new is empty).
        if old_name != new_name:
            delete_field_file(old_name)


# ============================================
# PUBLIC
# ============================================
def register_file_cleanup(model, field_names):
    """Install pre_save + post_delete cleanup hooks. Idempotent."""
    if not field_names:
        return
    if getattr(model, '_file_cleanup_registered', False):
        return

    model._file_cleanup_fields = list(field_names)
    model._file_cleanup_registered = True

    pre_save.connect(
        _on_pre_save,
        sender=model,
        dispatch_uid=f'file_cleanup_pre_save_{model._meta.label_lower}',
        weak=False,
    )
    post_delete.connect(
        _on_post_delete,
        sender=model,
        dispatch_uid=f'file_cleanup_post_delete_{model._meta.label_lower}',
        weak=False,
    )