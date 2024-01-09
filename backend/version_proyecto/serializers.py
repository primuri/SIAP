from rest_framework import serializers
from personas.models import Academico, Asistente

from propuesta_proyecto.models import PropuestaProyecto, Vigencia
from .models import Proyecto, Oficio, Documento, EvaluacionCC, PreguntaEvaluacionCC, Evaluacion, RespuestaEvaluacion, VersionProyecto, DesignacionAsistente, ColaboradorSecundario
from propuesta_proyecto.serializers import PropuestaProyectoSerializer, VigenciaSerializer
from personas.serializers import AsistenteSerializer, AcademicoSerializer, EvaluadorSerializer

class ProyectoSerializer(serializers.ModelSerializer):
    id_codigo_cimpa_fk = serializers.PrimaryKeyRelatedField(queryset=PropuestaProyecto.objects.all())

    class Meta:
        model = Proyecto
        fields = '__all__'

    def to_representation(self, instance):
        rep = super(ProyectoSerializer, self).to_representation(instance)
        rep['id_codigo_cimpa_fk'] = PropuestaProyectoSerializer(instance.id_codigo_cimpa_fk).data
        return rep

class OficioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Oficio
        fields = '__all__'
    def to_representation(self, instance):
        rep = super(OficioSerializer, self).to_representation(instance)
        return rep

class DocumentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Documento
        fields = '__all__'

    def to_representation(self, instance):
        rep = super(DocumentoSerializer, self).to_representation(instance)
        return rep

class EvaluacionCCSerializer(serializers.ModelSerializer):
    id_documento_evualuacion_fk = serializers.PrimaryKeyRelatedField(queryset=Documento.objects.all())

    class Meta:
        model = EvaluacionCC
        fields = '__all__'

    def to_representation(self, instance):
        rep = super(EvaluacionCCSerializer, self).to_representation(instance)
        rep['id_documento_evualuacion_fk'] = DocumentoSerializer(instance.id_documento_evualuacion_fk).data
        return rep
    
class PreguntaEvaluacionCCSerializer(serializers.ModelSerializer):
    id_evaluacion_cc_fk = serializers.PrimaryKeyRelatedField(queryset=EvaluacionCC.objects.all())

    class Meta:
        model = PreguntaEvaluacionCC
        fields = '__all__'

    def to_representation(self, instance):
        rep = super(PreguntaEvaluacionCCSerializer, self).to_representation(instance)
        rep['id_evaluacion_cc_fk'] = EvaluacionCCSerializer(instance.id_evaluacion_cc_fk).data
        return rep

class EvaluacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluacion
        fields = '__all__'

    def to_representation(self, instance):
        rep = super(EvaluacionSerializer, self).to_representation(instance)
        evaluador_data = EvaluadorSerializer(instance.id_evaluador_fk).data
        proyecto_data = VersionProyectoSerializer(instance.id_version_proyecto_fk).data
        rep['id_evaluador_fk'] = evaluador_data
        rep['id_version_proyecto_fk'] = proyecto_data
        return rep

class RespuestaEvaluacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RespuestaEvaluacion
        fields = '__all__'

    def to_representation(self, instance):
        rep = super(RespuestaEvaluacionSerializer, self).to_representation(instance)
        evaluacion_data = EvaluacionSerializer(instance.id_evalucion_fk).data
        rep['id_evaluacion_fk'] = evaluacion_data
        return rep


class VersionProyectoSerializer(serializers.ModelSerializer):
    id_oficio_fk = serializers.PrimaryKeyRelatedField(queryset=Oficio.objects.all())
    id_vigencia_fk = serializers.PrimaryKeyRelatedField(queryset=Vigencia.objects.all())\
    # Sprint 2 no trabajamos con esto para evitar conflictos
   #id_evaluacion_cc_fk = serializers.PrimaryKeyRelatedField(queryset=EvaluacionCC.objects.all())
    id_codigo_vi_fk = serializers.PrimaryKeyRelatedField(queryset=Proyecto.objects.all())

    class Meta:
        model = VersionProyecto
        fields = '__all__'

    def to_representation(self, instance):
        rep = super(VersionProyectoSerializer, self).to_representation(instance)
        rep['id_oficio_fk'] = OficioSerializer(instance.id_oficio_fk).data
        rep['id_vigencia_fk'] = VigenciaSerializer(instance.id_vigencia_fk).data
        # Sprint 2 no trabajamos con esto para evitar conflictos
       #rep['id_evaluacion_cc_fk'] = EvaluacionCCSerializer(instance.id_evaluacion_cc_fk).data
        rep['id_codigo_vi_fk'] = ProyectoSerializer(instance.id_codigo_vi_fk).data
        return rep

class DesignacionAsistenteSerializer(serializers.ModelSerializer):
    id_documento_inopia_fk = serializers.PrimaryKeyRelatedField(queryset=Documento.objects.all())
    id_version_proyecto_fk = serializers.PrimaryKeyRelatedField(queryset=VersionProyecto.objects.all())
    id_asistente_carnet_fk = serializers.PrimaryKeyRelatedField(queryset=Asistente.objects.all())

    class Meta:
        model = DesignacionAsistente
        fields = '__all__'

    def to_representation(self, instance):
        rep = super(DesignacionAsistenteSerializer, self).to_representation(instance)
        rep['id_documento_inopia_fk'] = DocumentoSerializer(instance.id_documento_inopia_fk).data
        rep['id_version_proyecto_fk'] = VersionProyectoSerializer(instance.id_version_proyecto_fk).data
        rep['id_asistente_carnet_fk'] = AsistenteSerializer(instance.id_asistente_carnet_fk).data
        return rep

class ColaboradorSecundarioSerializer(serializers.ModelSerializer):
    id_vigencia_fk = serializers.PrimaryKeyRelatedField(queryset=Vigencia.objects.all())
    id_academico_fk = serializers.PrimaryKeyRelatedField(queryset=Academico.objects.all())
    id_version_proyecto_fk = serializers.PrimaryKeyRelatedField(queryset=VersionProyecto.objects.all())

    class Meta:
        model = ColaboradorSecundario
        fields = '__all__'

    def to_representation(self, instance):
        rep = super(ColaboradorSecundarioSerializer, self).to_representation(instance)
        rep['id_vigencia_fk'] = VigenciaSerializer(instance.id_vigencia_fk).data
        rep['id_academico_fk'] = AcademicoSerializer(instance.id_academico_fk).data
        rep['id_version_proyecto_fk'] = VersionProyectoSerializer(instance.id_version_proyecto_fk).data
        return rep
