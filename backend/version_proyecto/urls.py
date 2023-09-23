from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import ProyectoViewSet, OficioViewSet, DocumentoViewSet, EvaluacionCCViewSet, PreguntaEvaluacionViewSet, PreguntaEvaluacionCCViewSet, EvaluacionViewSet, VersionProyectoViewSet, DesignacionAsistenteViewSet, ColaboradorSecundarioViewSet

router = DefaultRouter()
router.register(r'proyectos', ProyectoViewSet)
router.register(r'oficios', OficioViewSet)
router.register(r'documentos', DocumentoViewSet)
router.register(r'evaluacionescc', EvaluacionCCViewSet)
router.register(r'preguntasevaluacionescc', PreguntaEvaluacionCCViewSet)
router.register(r'preguntasevaluaciones', PreguntaEvaluacionViewSet)
router.register(r'evaluaciones', EvaluacionViewSet)
router.register(r'versionproyecto', VersionProyectoViewSet)
router.register(r'designacionasistente', DesignacionAsistenteViewSet)
router.register(r'colaboradorsecundario', ColaboradorSecundarioViewSet)

urlpatterns = [
    path('', include(router.urls)),
]