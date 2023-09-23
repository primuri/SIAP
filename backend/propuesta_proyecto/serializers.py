from rest_framework import serializers
from .models import PropuestaProyecto, Vigencia, ColaboradorPrincipal, DocumentoAsociado
from personas.serializers import AcademicoSerializer

class PropuestaProyectoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropuestaProyecto
        fields = '__all__'

class VigenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vigencia
        fields = '__all__'

class ColaboradorPrincipalSerializer(serializers.ModelSerializer):
    id_vigencia_fk = VigenciaSerializer()
    id_academico_fk = AcademicoSerializer()
    id_codigo_cimpa_fk = PropuestaProyecto()

    class Meta:
        model = ColaboradorPrincipal
        fields = '__all__'

class DocumentoAsociadoSerializer(serializers.ModelSerializer):
    id_codigo_cimpa_fk = PropuestaProyecto()
    class Meta:
        model = DocumentoAsociado
        fields = '__all__'
