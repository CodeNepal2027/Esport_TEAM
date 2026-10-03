# Backend/Client/vary_middleware.py
"""
Tenant-aware Vary middleware.

Why this exists
---------------
HTTP caches (Django's per-site cache, LiteSpeed on cPanel, Cloudflare,
the browser's back/forward cache) decide "is this the same request?"
based on the URL plus whatever headers are listed in the response's
`Vary` header.

For a multi-tenant API, two different tenants can make requests that
look identical to a cache if the only difference is in a header
(X-Tenant, Host, Cookie, Authorization). Without `Vary`, the cache
may serve tenant A's response to tenant B.

This middleware declares which request headers the response depends
on, so no cache can confuse two tenants.

It is safe to use together with ConditionalGetMiddleware and with
the existing TenantAdminUserMiddleware. It does not touch the body
of the response — only the headers.
"""

from django.utils.cache import patch_vary_headers


# Every header that could change which tenant a response belongs to.
# Add here if you add new tenant-resolution mechanisms later.
TENANT_VARY_HEADERS = (
    'Host',           # tenant resolved from hostname / subdomain
    'X-Tenant',       # explicit tenant header
    'Cookie',         # session / auth may carry tenant context
    'Authorization',  # JWT may carry tenant context
    'Accept-Language',  # locale-specific content
)


class VaryByTenantMiddleware:
    """
    Add tenant-affecting headers to the response's `Vary` header.

    Placement in settings.MIDDLEWARE:
        ...
        'django.middleware.common.CommonMiddleware',
        'Client.vary_middleware.VaryByTenantMiddleware',   # ← here
        'django.middleware.csrf.CsrfViewMiddleware',
        ...

    Must run AFTER CommonMiddleware (so the request path has been
    normalized) and BEFORE any caching middleware, so the Vary
    header is present when the response is stored or matched.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        # Merge (not overwrite) with any Vary entries Django already set.
        patch_vary_headers(response, TENANT_VARY_HEADERS)

        return response