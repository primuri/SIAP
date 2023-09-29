from rest_framework import serializers
from .models import PropuestaProyecto, Vigencia, ColaboradorPrincipal, DocumentoAsociado,Academico
from personas.serializers import AcademicoSerializer

class VigenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vigencia
        fields = '__all__'

class ColaboradorPrincipalSerializer(serializers.ModelSerializer):
    id_vigencia_fk =  serializers.PrimaryKeyRelatedField(queryset=Vigencia.objects.all())
    id_academico_fk =  serializers.PrimaryKeyRelatedField(queryset=Academico.objects.all())

    class Meta:
        model = ColaboradorPrincipal
        fields = '__all__'

    def to_representation(self, instance):
        rep = super(ColaboradorPrincipalSerializer, self).to_representation(instance)
        rep['id_vigencia_fk'] = VigenciaSerializer(instance.id_vigencia_fk).data
        rep['id_academico_fk'] = AcademicoSerializer(instance.id_academico_fk).data
        return rep
    
class PropuestaProyectoSerializer(serializers.ModelSerializer):
    id_colaborador_principal_fk = serializers.PrimaryKeyRelatedField(queryset=ColaboradorPrincipal.objects.all())

    class Meta:
        model = PropuestaProyecto
        fields = '__all__'

    def to_representation(self, instance):
        rep = super(PropuestaProyectoSerializer, self).to_representation(instance)
        rep['id_colaborador_principal_fk'] = ColaboradorPrincipalSerializer(instance.id_colaborador_principal_fk).data
        return rep
    
class DocumentoAsociadoSerializer(serializers.ModelSerializer):
    id_codigo_cimpa_fk = serializers.PrimaryKeyRelatedField(queryset=PropuestaProyecto.objects.all())
    class Meta:
        model = DocumentoAsociado
        fields = '__all__'

    def to_representation(self, instance):
        rep = super(DocumentoAsociadoSerializer, self).to_representation(instance)
        rep['id_codigo_cimpa_fk'] = PropuestaProyectoSerializer(instance.id_codigo_cimpa_fk).data
        return rep