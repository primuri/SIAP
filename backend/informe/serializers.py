from rest_framework import serializers
from .models import Informe, VersionInforme, Accion
from version_proyecto.serializers import VersionProyectoSerializer, EvaluacionCCSerializer, DocumentoSerializer, OficioSerializer

class InformeSerializer(serializers.ModelSerializer):
    id_version_proyecto_fk = VersionProyectoSerializer()
    class Meta:
        model = Informe
        fields = '__all__'

class VersionInformeSerializer(serializers.ModelSerializer):
    id_informe_fk = InformeSerializer()
    id_evaluacion_cc_fk = EvaluacionCCSerializer()
    id_oficio_fk = OficioSerializer()
    id_documento_informe_fk = DocumentoSerializer()
    class Meta:
        model = VersionInforme
        fields = '__all__'

class AccionSerializer(serializers.ModelSerializer):
    id_version_informe_fk = VersionInformeSerializer()
    id_documento_accion_fk = DocumentoSerializer()
    class Meta:
        model = Accion
        fields = '__all__'
