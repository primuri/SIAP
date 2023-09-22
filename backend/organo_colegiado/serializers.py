from rest_framework import serializers
from .models import OrganoColegiado, Integrante, Convocatoria, Agenda, Acta, Sesion, Invitado, Seguimiento, Acuerdo, Participante

class OrganoColegiadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganoColegiado
        fields = '__all__'

class IntegranteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Integrante
        fields = '__all__'

class ConvocatoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Convocatoria
        fields = '__all__'

class AgendaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agenda
        fields = '__all__'

class ActaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Acta
        fields = '__all__'

class SesionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sesion
        fields = '__all__'

class InvitadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invitado
        fields = '__all__'

class SeguimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seguimiento
        fields = '__all__'

class AcuerdoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Acuerdo
        fields = '__all__'

class ParticipanteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participante
        fields = '__all__'
