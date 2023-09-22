from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import OrganoColegiadoViewSet, IntegranteViewSet, ConvocatoriaViewSet, AgendaViewSet, ActaViewSet, SesionViewSet, InvitadoViewSet, SeguimientoViewSet, AcuerdoViewSet, ParticipanteViewSet

router = DefaultRouter()
router.register(r'organo_colegiado', OrganoColegiadoViewSet)
router.register(r'integrante', IntegranteViewSet)
router.register(r'convocatoria', ConvocatoriaViewSet)
router.register(r'agenda', AgendaViewSet)
router.register(r'acta', ActaViewSet)
router.register(r'sesion', SesionViewSet)
router.register(r'invitado', InvitadoViewSet)
router.register(r'seguimiento', SeguimientoViewSet)
router.register(r'acuerdo', AcuerdoViewSet)
router.register(r'participante', ParticipanteViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
