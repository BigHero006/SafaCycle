"""
SafaCycle Backend URL Configuration
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def api_root(request):
    """API root endpoint."""
    return JsonResponse({
        'message': 'Welcome to SafaCycle Backend API',
        'version': '1.0',
        'status': 'active',
        'endpoints': {
            'admin': '/admin/',
            'api': '/api/v1/',
            'auth': '/api/v1/auth/',
            'waste': '/api/v1/waste/',
            'notifications': '/api/v1/notifications/',
        }
    })

urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include('authentication.urls')),
    path('api/v1/waste/', include('waste_management.urls')),
    path('api/v1/notifications/', include('notifications.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
