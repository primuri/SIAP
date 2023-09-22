from rest_framework import viewsets
from .models import OrganoColegiado, Integrante, Convocatoria, Agenda, Acta, Sesion, Invitado, Seguimiento, Acuerdo, Participante
from .serializers import OrganoColegiadoSerializer, IntegranteSerializer, ConvocatoriaSerializer, AgendaSerializer, ActaSerializer, SesionSerializer, InvitadoSerializer, SeguimientoSerializer, AcuerdoSerializer, ParticipanteSerializer

class OrganoColegiadoViewSet(viewsets.ModelViewSet):
    queryset = OrganoColegiado.objects.all()
    serializer_class = OrganoColegiadoSerializer

class IntegranteViewSet(viewsets.ModelViewSet):
    queryset = Integrante.objects.all()
    serializer_class = IntegranteSerializer

class ConvocatoriaViewSet(viewsets.ModelViewSet):
    queryset = Convocatoria.objects.all()
    serializer_class = ConvocatoriaSerializer

class AgendaViewSet(viewsets.ModelViewSet):
    queryset = Agenda.objects.all()
    serializer_class = AgendaSerializer

class ActaViewSet(viewsets.ModelViewSet):
    queryset = Acta.objects.all()
    serializer_class = ActaSerializer

class SesionViewSet(viewsets.ModelViewSet):
    queryset = Sesion.objects.all()
    serializer_class = SesionSerializer

class InvitadoViewSet(viewsets.ModelViewSet):
    queryset = Invitado.objects.all()
    serializer_class = InvitadoSerializer

class SeguimientoViewSet(viewsets.ModelViewSet):
    queryset = Seguimiento.objects.all()
    serializer_class = SeguimientoSerializer

class AcuerdoViewSet(viewsets.ModelViewSet):
    queryset = Acuerdo.objects.all()
    serializer_class = AcuerdoSerializer

class ParticipanteViewSet(viewsets.ModelViewSet):
    queryset = Participante.objects.all()
    serializer_class = ParticipanteSerializer
