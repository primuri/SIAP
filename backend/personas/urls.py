from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NombreCompletoViewSet, AreaEspecialidadViewSet, UniversidadViewSet, AcademicoViewSet, TelefonoViewSet, TitulosViewSet, EvaluadorViewSet, AsistenteViewSet,  AutorViewSet, InstitucionViewSet, PersonaExternaViewSet


router = DefaultRouter()
router.register(r'nombre_completo', NombreCompletoViewSet)
router.register(r'area_especialidad', AreaEspecialidadViewSet)
router.register(r'universidad', UniversidadViewSet)
router.register(r'academico', AcademicoViewSet)
router.register(r'telefono', TelefonoViewSet)
router.register(r'titulos', TitulosViewSet)
router.register(r'evaluador', EvaluadorViewSet)
router.register(r'asistente', AsistenteViewSet)
router.register(r'autor', AutorViewSet)
router.register(r'institucion', InstitucionViewSet)
router.register(r'persona_externa', PersonaExternaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
