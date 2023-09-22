from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PropuestaProyectoViewSet, VigenciaViewSet, ColaboradorPrincipalViewSet, DocumentoAsociadoViewSet

router = DefaultRouter()
router.register(r'propuesta_proyecto', PropuestaProyectoViewSet)
router.register(r'vigencia', VigenciaViewSet)
router.register(r'colaborador_principal', ColaboradorPrincipalViewSet)
router.register(r'documento_asociado', DocumentoAsociadoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]