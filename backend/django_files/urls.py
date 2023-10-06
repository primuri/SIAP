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
    path('signup', views.signup, name='signup'),
    path('login', views.login, name='login'),
    path('test_token', views.test_token, name='test_token'),
    path('obtener_usuarios', views.get_users, name='obtener_usuarios'),
    path('usuario/<int:id>/', views.get_user_by_id, name='get_user_by_id'),
    path('actualizar_usuario/<int:id>/', views.update_user, name='actualizar_usuario'),
    path('eliminar_usuario/<int:id>/', views.delete_user, name='eliminar_usuario'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)