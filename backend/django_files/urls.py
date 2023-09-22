from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('informe/', include('informe.urls')),
    path('organo_colegiado/', include('organo_colegiado.urls')),
    path('personas/', include('personas.urls')),
    path('presupuesto/', include('presupuesto.urls')),
    path('producto/', include('producto.urls')),
    path('version_proyecto/', include('version_proyecto.urls')),
    path('propuesta_proyecto/', include('propuesta_proyecto.urls')),
]
