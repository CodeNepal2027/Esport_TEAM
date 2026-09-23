# # Backend/Backend/urls.py
# """
# URL configuration for Backend project.

# The `urlpatterns` list routes URLs to views. For more information please see:
#     https://docs.djangoproject.com/en/6.1/topics/http/urls/
# Examples:
# Function views
#     1. Add an import:  from my_app import views
#     2. Add a URL to urlpatterns:  path('', views.home, name='home')
# Class-based views
#     1. Add an import:  from other_app.views import Home
#     2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
# Including another URLconf
#     1. Import the include() function: from django.urls import include, path
#     2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
# """
# from django.contrib import admin
# from django.urls import include, path

# from Client.admin_site import tenant_admin_site

# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path('tenant-admin/', tenant_admin_site.urls),
#     path('api/', include('api.urls')),
# ]





# ============== [ New Updated code FROM IMAGE URL to IMAGE FILE ] ==================
"""
URL configuration for Backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

from Client.admin_site import tenant_admin_site

urlpatterns = [
    path('admin/', admin.site.urls),
    path('tenant-admin/', tenant_admin_site.urls),
    path('api/', include('api.urls')),
]

# ============================================
# MEDIA FILES — serve uploads in development
# --------------------------------------------
# In DEBUG mode Django serves /media/... directly.
# In production, your web server (nginx / Caddy) or object storage
# (S3 / Cloudflare R2 / Backblaze B2) handles this URL prefix.
# ============================================
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

