from django.contrib import admin
from django.urls import path, include
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('informe/', include('informe.urls')),
    path('organo_colegiado/', include('organo_colegiado.urls')),
    path('personas/', include('personas.urls')),
    path('presupuesto/', include('presupuesto.urls')),
    path('producto/', include('producto.urls')),
    path('version_proyecto/', include('version_proyecto.urls')),
    path('propuesta_proyecto/', include('propuesta_proyecto.urls')),
    path('signup', views.signup),
    path('login', views.login),
    path('test_token', views.test_token),
    path('obtener_usuarios', views.get_users),
    path('actualizar_usuario/<str:correo>/', views.update_user),
    path('eliminar_usuario/<str:correo>/', views.delete_user),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)