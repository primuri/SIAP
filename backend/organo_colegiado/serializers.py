from rest_framework import serializers
from .models import OrganoColegiado, Integrante, Convocatoria, Agenda, Acta, Sesion, Invitado, Seguimiento, Acuerdo, Participante
from personas.serializers import AcademicoSerializer, NombreCompletoSerializer
from version_proyecto.serializers import OficioSerializer, DocumentoSerializer
from propuesta_proyecto.serializers import VigenciaSerializer
from personas.serializers import PersonaExternaSerializer

class OrganoColegiadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganoColegiado
        fields = '__all__'

class IntegranteSerializer(serializers.ModelSerializer):
    id_organo_colegiado_fk = OrganoColegiadoSerializer()
    id_academico_fk = AcademicoSerializer()
    id_oficio_nombramiento_fk = OficioSerializer()
    id_vigencia_fk = VigenciaSerializer()
    class Meta:
        model = Integrante
        fields = '__all__'

class ConvocatoriaSerializer(serializers.ModelSerializer):
    id_documento_convocatoria_fk = DocumentoSerializer()
    class Meta:
        model = Convocatoria
        fields = '__all__'

class AgendaSerializer(serializers.ModelSerializer):
    id_convocatoria_fk = ConvocatoriaSerializer()
    class Meta:
        model = Agenda
        fields = '__all__'

class ActaSerializer(serializers.ModelSerializer):
    id_documento_acta_fk = DocumentoSerializer()
    class Meta:
        model = Acta
        fields = '__all__'

class SesionSerializer(serializers.ModelSerializer):
    id_organo_colegiado_fk = OrganoColegiadoSerializer()
    id_agenda_fk = AgendaSerializer()
    id_acta_fk = ActaSerializer()
    class Meta:
        model = Sesion
        fields = '__all__'

class InvitadoSerializer(serializers.ModelSerializer):
    id_persona_externa_fk = PersonaExternaSerializer()
    id_sesion_fk = SesionSerializer()
    class Meta:
        model = Invitado
        fields = '__all__'

class SeguimientoSerializer(serializers.ModelSerializer):
    id_documento_seguimiento_fk = DocumentoSerializer()
    class Meta:
        model = Seguimiento
        fields = '__all__'

class AcuerdoSerializer(serializers.ModelSerializer):
    id_seguimiento_fk = SeguimientoSerializer()
    id_oficio_fk = OficioSerializer()
    id_sesion_fk = SesionSerializer()
    id_documento_acuerdo_fk = DocumentoSerializer()
    class Meta:
        model = Acuerdo
        fields = '__all__'

class ParticipanteSerializer(serializers.ModelSerializer):
    id_nombre_completo_fk = NombreCompletoSerializer() 
    id_sesion_fk =  SesionSerializer()
    class Meta:
        model = Participante
        fields = '__all__'
