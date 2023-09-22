from rest_framework import serializers
from .models import PropuestaProyecto, Vigencia, ColaboradorPrincipal, DocumentoAsociado

class PropuestaProyectoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropuestaProyecto
        fields = '__all__'

class VigenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vigencia
        fields = '__all__'

class ColaboradorPrincipalSerializer(serializers.ModelSerializer):
    class Meta:
        model = ColaboradorPrincipal
        fields = '__all__'

class DocumentoAsociadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentoAsociado
        fields = '__all__'
