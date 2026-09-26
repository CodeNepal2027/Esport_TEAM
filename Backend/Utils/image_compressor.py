# /Backend/Utils/image_compressor.py
"""
Versatile image compressor — universal, project-agnostic.

What it does
------------
Compresses an uploaded image to a target file size (in KB) WITHOUT changing
its pixel dimensions. Only the file size shrinks.

What it does NOT do
-------------------
- No resizing (dimensions stay exactly as uploaded)
- No domain assumptions (no 'hero', no 'team', no 'product' baked in)
- No hard-coded paths, no settings, no app names

Portability
-----------
- Core API returns raw bytes — works in Flask, FastAPI, plain Python scripts
- Django layer adds a ContentFile wrapper (auto-detected, optional)
- Zero config required — sensible defaults everywhere

Dependencies
------------
- Pillow (only). If your project already uses Django's ImageField, you have it.

Usage (Django)
--------------
    from Utils.image_compressor import compress_image

    # Simple
    result = compress_image(uploaded_file)

    # With target
    result = compress_image(uploaded_file, target_kb=100)

    # Preserve transparent PNGs
    result = compress_image(uploaded_file, target_kb=30, keep_png=True)

Usage (plain Python)
--------------------
    from Utils.image_compressor import compress_to_bytes

    data, ext = compress_to_bytes(open('photo.jpg', 'rb'), target_kb=120)
    open(f'photo_compressed{ext}', 'wb').write(data)

Author notes
------------
- Dimensions are preserved by design. If a target_kb is impossible to hit
  without resizing, the function returns the smallest JPEG it can produce
  at the original dimensions (down to min_quality). Never silently resizes.
- Handles: JPEG, PNG, WebP, GIF (first frame), BMP, TIFF.
- Fixes EXIF rotation so phone photos come out upright.
- Handles transparency by flattening onto white (unless keep_png=True).
- Returns None on invalid input rather than raising — caller decides fallback.
"""

from __future__ import annotations

import os
from io import BytesIO
from typing import Optional, Tuple, Union

from PIL import Image, ImageOps

# ------------------------------------------------------------------
# Optional Django integration — auto-detected
# ------------------------------------------------------------------
try:
    from django.core.files.base import ContentFile  # type: ignore
    _HAS_DJANGO = True
except Exception:
    ContentFile = None  # type: ignore
    _HAS_DJANGO = False


# ------------------------------------------------------------------
# Safety guard: reject decompression bombs
# 50 megapixels is generous for any normal web image.
# ------------------------------------------------------------------
Image.MAX_IMAGE_PIXELS = 50_000_000


# ------------------------------------------------------------------
# Accepted image extensions on output (informational — not enforced)
# ------------------------------------------------------------------
JPEG_EXT = '.jpg'
PNG_EXT = '.png'


# ==================================================================
# PUBLIC API — Universal, no domain knowledge
# ==================================================================

def compress_image(
    image_field,
    target_kb: int = 150,
    keep_png: bool = False,
    min_quality: int = 40,
    max_quality: int = 90,
    quality_step: int = 5,
) -> Optional['ContentFile']:
    """
    Compress an image to <= target_kb, preserving pixel dimensions.

    Returns a Django ContentFile named with the correct extension,
    or None if the input isn't a valid image.

    Requires Django (for ContentFile). For non-Django projects, use
    compress_to_bytes() instead.

    Args:
        image_field:  UploadedFile, ImageField, file-like, or path-holding object.
        target_kb:    Desired maximum file size in KB.
        keep_png:     If True, transparent PNGs stay PNG (resized only by
                      quality, not dimensions). If False, they're flattened
                      to white and saved as JPEG.
        min_quality:  Lowest JPEG quality to try before accepting the
                      smallest achievable size (never resizes).
        max_quality:  Starting JPEG quality.
        quality_step: Amount to decrement quality per attempt.
    """
    if not _HAS_DJANGO:
        raise RuntimeError(
            "compress_image() returns a Django ContentFile. "
            "Django isn't installed. Use compress_to_bytes() instead."
        )

    raw = compress_to_bytes(
        image_field,
        target_kb=target_kb,
        keep_png=keep_png,
        min_quality=min_quality,
        max_quality=max_quality,
        quality_step=quality_step,
    )
    if raw is None:
        return None

    data, ext = raw
    return ContentFile(data, name=_make_filename(image_field, ext))


def compress_to_bytes(
    image_field,
    target_kb: int = 150,
    keep_png: bool = False,
    min_quality: int = 40,
    max_quality: int = 90,
    quality_step: int = 5,
) -> Optional[Tuple[bytes, str]]:
    """
    Compress an image and return (bytes, extension).

    No Django required. Works in any Python project.

    Returns:
        (bytes, '.jpg') or (bytes, '.png') on success.
        None on invalid input.

    Dimensions are preserved — nothing is resized.
    """
    if not image_field:
        return None

    # Rewind if we were given an open file object
    try:
        image_field.seek(0)
    except (AttributeError, ValueError):
        pass

    # ---- Open + fully decode (so we fail early on corrupt files) ----
    try:
        img = Image.open(image_field)
        img.load()
    except Exception:
        return None

    # ---- Honor EXIF orientation (phone photos) ----
    try:
        img = ImageOps.exif_transpose(img)
    except Exception:
        pass

    # ---- Detect transparency ----
    has_alpha = img.mode in ('RGBA', 'LA') or (
        img.mode == 'P' and 'transparency' in img.info
    )

    # ---- Path A: keep PNG with transparency ----
    if keep_png and has_alpha:
        out = BytesIO()
        try:
            img.save(out, format='PNG', optimize=True)
        except Exception:
            pass  # fall through to JPEG if PNG save fails
        else:
            if (out.tell() / 1024) <= target_kb:
                return out.getvalue(), PNG_EXT
            # If PNG too large, fall through to JPEG (still same dimensions)

    # ---- Path B: JPEG at original dimensions ----
    # Convert to RGB. Flatten alpha onto white if present.
    if img.mode != 'RGB':
        if has_alpha:
            img = _flatten_on_white(img)
        else:
            try:
                img = img.convert('RGB')
            except Exception:
                return None

    quality = max_quality
    output = BytesIO()
    while quality >= min_quality:
        output.seek(0)
        output.truncate()
        try:
            img.save(
                output,
                format='JPEG',
                quality=quality,
                optimize=True,
                progressive=True,
            )
        except Exception:
            return None
        if (output.tell() / 1024) <= target_kb:
            break
        quality -= quality_step

    return output.getvalue(), JPEG_EXT


# ==================================================================
# INTERNAL HELPERS
# ==================================================================

def _flatten_on_white(img: Image.Image) -> Image.Image:
    """
    Composite a transparent image onto a white background.
    Dimensions preserved.
    """
    if img.mode not in ('RGBA', 'LA'):
        img = img.convert('RGBA')
    bg = Image.new('RGB', img.size, (255, 255, 255))
    bg.paste(img, mask=img.split()[-1])  # use alpha channel as mask
    return bg


def _make_filename(image_field, ext: str) -> str:
    """
    Build a safe filename with the correct extension.

    Handles:
      - missing .name
      - multi-dot filenames (my.team.photo.jpg → my.team.photo.jpg)
      - no extension (photo → photo.jpg)
      - weird paths (some/folder/photo.png → photo.jpg)
    """
    original = getattr(image_field, 'name', '') or 'image'
    base = os.path.basename(original)
    stem, _old_ext = os.path.splitext(base)
    if not stem:
        stem = 'image'
    return f'{stem}{ext}'


# ==================================================================
# OPTIONAL — Django mixin for auto-compress on save
# ==================================================================
# Use this if you want to compress on every model save without
# touching each serializer. It only compresses fresh uploads;
# already-saved files are left untouched.
#
#     from Utils.image_compressor import compress_field_on_save
#
#     class Hero(models.Model):
#         image_file = models.ImageField(upload_to='hero/')
#
#         def save(self, *args, **kwargs):
#             self.image_file = compress_field_on_save(self.image_file, target_kb=200)
#             super().save(*args, **kwargs)
# ==================================================================

def compress_field_on_save(field, target_kb: int = 150, keep_png: bool = False):
    """
    Helper for Django model save() hooks.

    - If `field` is a fresh upload (has .file or .read), compress it.
    - If `field` is already a saved FileField (has a path string), leave it.
    - If compression fails, return the original field (never break save).
    """
    if not field:
        return field

    # Fresh uploads have a file-like object; saved files are strings.
    if not hasattr(field, 'file') and not hasattr(field, 'read'):
        return field

    try:
        compressed = compress_image(field, target_kb=target_kb, keep_png=keep_png)
        return compressed or field
    except Exception:
        return field