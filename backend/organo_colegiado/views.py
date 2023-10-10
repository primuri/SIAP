from rest_framework import viewsets
from .models import OrganoColegiado, Integrante, Convocatoria, Agenda, Acta, Sesion, Invitado, Seguimiento, Acuerdo, Participante
from .serializers import OrganoColegiadoSerializer, IntegranteSerializer, ConvocatoriaSerializer, AgendaSerializer, ActaSerializer, SesionSerializer, InvitadoSerializer, SeguimientoSerializer, AcuerdoSerializer, ParticipanteSerializer

from django_files.permisos import PermisoPorRol
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class OrganoColegiadoViewSet(viewsets.ModelViewSet):
    view_name = 'organos_colegiados'
    queryset = OrganoColegiado.objects.all()
    serializer_class = OrganoColegiadoSerializer


@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class IntegranteViewSet(viewsets.ModelViewSet):
    view_name = 'integrantes'
    queryset = Integrante.objects.all()
    serializer_class = IntegranteSerializer


@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class ConvocatoriaViewSet(viewsets.ModelViewSet):
    view_name = 'convocatorias'
    queryset = Convocatoria.objects.all()
    serializer_class = ConvocatoriaSerializer


@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class AgendaViewSet(viewsets.ModelViewSet):
    view_name = 'agendas'
    queryset = Agenda.objects.all()
    serializer_class = AgendaSerializer


@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class ActaViewSet(viewsets.ModelViewSet):
    view_name = 'actas'
    queryset = Acta.objects.all()
    serializer_class = ActaSerializer


@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class SesionViewSet(viewsets.ModelViewSet):
    view_name = 'sesiones'
    queryset = Sesion.objects.all()
    serializer_class = SesionSerializer


@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class InvitadoViewSet(viewsets.ModelViewSet):
    view_name = 'invitados'
    queryset = Invitado.objects.all()
    serializer_class = InvitadoSerializer


@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class SeguimientoViewSet(viewsets.ModelViewSet):
    view_name = 'seguimientos'
    queryset = Seguimiento.objects.all()
    serializer_class = SeguimientoSerializer


@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class AcuerdoViewSet(viewsets.ModelViewSet):
    view_name = 'acuerdos'
    queryset = Acuerdo.objects.all()
    serializer_class = AcuerdoSerializer


@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class ParticipanteViewSet(viewsets.ModelViewSet):
    view_name = 'participantes'
    queryset = Participante.objects.all()
    serializer_class = ParticipanteSerializer
