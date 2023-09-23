from rest_framework import serializers
from .models import PreguntaEvaluacion, Proyecto, Oficio, Documento, EvaluacionCC, PreguntaEvaluacionCC, Evaluacion, VersionProyecto, DesignacionAsistente, ColaboradorSecundario
from propuesta_proyecto.serializers import PropuestaProyectoSerializer, VigenciaSerializer
from personas.serializers import AsistenteSerializer, AcademicoSerializer

class ProyectoSerializer(serializers.ModelSerializer):
    id_codigo_cimpa_fk = PropuestaProyectoSerializer()
    class Meta:
        model = Proyecto
        fields = '__all__'

class OficioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Oficio
        fields = '__all__'

class DocumentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Documento
        fields = '__all__'

class EvaluacionCCSerializer(serializers.ModelSerializer):
    id_documento_evualuacion_fk = DocumentoSerializer()
    class Meta:
        model = EvaluacionCC
        fields = '__all__'

class PreguntaEvaluacionCCSerializer(serializers.ModelSerializer):
    id_evaluacion_cc_fk = EvaluacionCCSerializer()
    class Meta:
        model = PreguntaEvaluacionCC
        fields = '__all__'

class EvaluacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluacion
        fields = '__all__'

class PreguntaEvaluacionSerializer(serializers.ModelSerializer):
    id_evaluacion_fk = EvaluacionSerializer()
    class Meta:
        model = PreguntaEvaluacion
        fields = '__all__'

class VersionProyectoSerializer(serializers.ModelSerializer):
    id_oficio_fk = OficioSerializer()
    id_vigencia_fk = VigenciaSerializer()
    id_evaluacion_cc_fk = EvaluacionCCSerializer()
    id_codigo_vi_fk = ProyectoSerializer()
    class Meta:
        model = VersionProyecto
        fields = '__all__'

class DesignacionAsistenteSerializer(serializers.ModelSerializer):
    id_documento_inopia_fk = DocumentoSerializer()
    id_version_proyecto_fk = VersionProyectoSerializer()
    id_asistente_carnet_fk = AsistenteSerializer()
    class Meta:
        model = DesignacionAsistente
        fields = '__all__'

class ColaboradorSecundarioSerializer(serializers.ModelSerializer):
    id_vigencia_fk = VigenciaSerializer()
    id_academico_fk = AcademicoSerializer()
    id_version_proyecto_fk = VersionProyectoSerializer()
    class Meta:
        model = ColaboradorSecundario
        fields = '__all__'