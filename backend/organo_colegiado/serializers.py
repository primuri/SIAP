from rest_framework import serializers
from personas.models import Academico, PersonaExterna
from propuesta_proyecto.models import Vigencia
from version_proyecto.models import Documento, Oficio
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
    id_organo_colegiado_fk = serializers.PrimaryKeyRelatedField(queryset=OrganoColegiado.objects.all())
    id_oficio_fk = serializers.PrimaryKeyRelatedField(queryset=Oficio.objects.all())
    id_vigencia_fk = serializers.PrimaryKeyRelatedField(queryset=Vigencia.objects.all())

    class Meta:
        model = Integrante
        fields = '__all__'

    def to_representation(self, instance):
        rep = super(IntegranteSerializer, self).to_representation(instance)
        rep['id_organo_colegiado_fk'] = OrganoColegiadoSerializer(instance.id_organo_colegiado_fk).data
        rep['id_oficio_fk'] = OficioSerializer(instance.id_oficio_fk).data
        rep['id_vigencia_fk'] = VigenciaSerializer(instance.id_vigencia_fk).data
        return rep
    
class ConvocatoriaSerializer(serializers.ModelSerializer):
    id_documento_convocatoria_fk = serializers.PrimaryKeyRelatedField(queryset=Documento.objects.all())

    class Meta:
        model = Convocatoria
        fields = '__all__'

    def to_representation(self, instance):
        rep = super(ConvocatoriaSerializer, self).to_representation(instance)
        rep['id_documento_convocatoria_fk'] = DocumentoSerializer(instance.id_documento_convocatoria_fk).data
        return rep

class AgendaSerializer(serializers.ModelSerializer):
    id_convocatoria_fk = serializers.PrimaryKeyRelatedField(queryset=Convocatoria.objects.all())

    class Meta:
        model = Agenda
        fields = '__all__'

    def to_representation(self, instance):
        rep = super(AgendaSerializer, self).to_representation(instance)
        rep['id_convocatoria_fk'] = ConvocatoriaSerializer(instance.id_convocatoria_fk).data
        return rep

class ActaSerializer(serializers.ModelSerializer):
    id_documento_acta_fk = serializers.PrimaryKeyRelatedField(queryset=Documento.objects.all())

    class Meta:
        model = Acta
        fields = '__all__'

    def to_representation(self, instance):
        rep = super(ActaSerializer, self).to_representation(instance)
        rep['id_documento_acta_fk'] = DocumentoSerializer(instance.id_documento_acta_fk).data
        return rep

class SesionSerializer(serializers.ModelSerializer):
    id_organo_colegiado_fk = serializers.PrimaryKeyRelatedField(queryset=OrganoColegiado.objects.all())
    id_agenda_fk = serializers.PrimaryKeyRelatedField(queryset=Agenda.objects.all())
    id_acta_fk = serializers.PrimaryKeyRelatedField(queryset=Acta.objects.all())

    class Meta:
        model = Sesion
        fields = '__all__'

    def to_representation(self, instance):
        rep = super(SesionSerializer, self).to_representation(instance)
        rep['id_organo_colegiado_fk'] = OrganoColegiadoSerializer(instance.id_organo_colegiado_fk).data
        rep['id_agenda_fk'] = AgendaSerializer(instance.id_agenda_fk).data
        rep['id_acta_fk'] = ActaSerializer(instance.id_acta_fk).data
        return rep


class InvitadoSerializer(serializers.ModelSerializer):
    id_persona_externa_fk = serializers.PrimaryKeyRelatedField(queryset=PersonaExterna.objects.all())
    id_sesion_fk = serializers.PrimaryKeyRelatedField(queryset=Sesion.objects.all())

    class Meta:
        model = Invitado
        fields = '__all__'

    def to_representation(self, instance):
        rep = super(InvitadoSerializer, self).to_representation(instance)
        rep['id_persona_externa_fk'] = PersonaExternaSerializer(instance.id_persona_externa_fk).data
        rep['id_sesion_fk'] = SesionSerializer(instance.id_sesion_fk).data
        return rep

class SeguimientoSerializer(serializers.ModelSerializer):
    id_documento_seguimiento_fk = serializers.PrimaryKeyRelatedField(queryset=Documento.objects.all())

    class Meta:
        model = Seguimiento
        fields = '__all__'

    def to_representation(self, instance):
        rep = super(SeguimientoSerializer, self).to_representation(instance)
        rep['id_documento_seguimiento_fk'] = DocumentoSerializer(instance.id_documento_seguimiento_fk).data
        return rep

class AcuerdoSerializer(serializers.ModelSerializer):
    id_seguimiento_fk = serializers.PrimaryKeyRelatedField(queryset=Seguimiento.objects.all())
    id_oficio_fk = serializers.PrimaryKeyRelatedField(queryset=Oficio.objects.all())
    id_sesion_fk = serializers.PrimaryKeyRelatedField(queryset=Sesion.objects.all())
    id_documento_acuerdo_fk = serializers.PrimaryKeyRelatedField(queryset=Documento.objects.all())
    
    class Meta:
        model = Acuerdo
        fields = '__all__'

    def to_representation(self, instance):
        rep = super(AcuerdoSerializer, self).to_representation(instance)
        rep['id_seguimiento_fk'] = SeguimientoSerializer(instance.id_seguimiento_fk).data
        rep['id_oficio_fk'] = OficioSerializer(instance.id_oficio_fk).data
        rep['id_sesion_fk'] = SesionSerializer(instance.id_sesion_fk).data
        rep['id_documento_acuerdo_fk'] = DocumentoSerializer(instance.id_documento_acuerdo_fk).data
        return rep


class ParticipanteSerializer(serializers.ModelSerializer):
    id_nombre_completo_fk = NombreCompletoSerializer() 
    id_sesion_fk =  SesionSerializer()
    class Meta:
        model = Participante
        fields = '__all__'
