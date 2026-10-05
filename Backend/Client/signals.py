# # Backend/Client/signals.py
# """
# Delete image files from disk when their DB row is deleted.

# Without this, the trim helper removes the row but leaves the file behind,
# slowly accumulating orphaned images in media/ (or S3).

# Safe because upload paths use UUIDs — no two rows share a file.
# """

# from django.db.models.signals import post_delete
# from django.dispatch import receiver

# from Client.models import Hero, Sponsers, Gallery, Team, Events


# def _delete_file(field_file):
#     """Delete the underlying file if it exists. Never raises."""
#     if not field_file:
#         return
#     try:
#         field_file.delete(save=False)
#     except Exception:
#         pass   # missing file, storage error, etc. — don't break the delete


# @receiver(post_delete, sender=Hero)
# def _hero_delete_file(sender, instance, **kwargs):
#     _delete_file(instance.image_file)


# @receiver(post_delete, sender=Sponsers)
# def _sponsors_delete_file(sender, instance, **kwargs):
#     _delete_file(instance.logo_file)


# @receiver(post_delete, sender=Gallery)
# def _gallery_delete_file(sender, instance, **kwargs):
#     _delete_file(instance.image_file)


# @receiver(post_delete, sender=Team)
# def _team_delete_file(sender, instance, **kwargs):
#     _delete_file(instance.image_file)


# @receiver(post_delete, sender=Events)
# def _events_delete_file(sender, instance, **kwargs):
#     _delete_file(instance.image_file)




# ============= [ On replace image delete old image from disk (2026/10/05) ]
# Backend/Client/signals.py
"""
Delete image files from disk when:
    1. A row is deleted (post_delete)
    2. A FileField is replaced with a new upload (pre_save)

Django's FileField leaves the old file on disk forever when you upload
a replacement. register_file_cleanup() fixes that.

Safe because upload paths use UUIDs — no two rows share a file.
"""

from Utils.file_cleanup import register_file_cleanup
from Client.models import Hero, Sponsers, Gallery, Team, Events


def register_client_file_cleanup():
    """Wire up file cleanup for all Client models that hold files."""
    register_file_cleanup(Hero,     ['image_file'])
    register_file_cleanup(Sponsers, ['logo_file'])
    register_file_cleanup(Gallery,  ['image_file'])
    register_file_cleanup(Team,     ['image_file'])
    register_file_cleanup(Events,   ['image_file'])