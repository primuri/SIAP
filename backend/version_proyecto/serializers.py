from rest_framework import serializers
from .models import PreguntaEvaluacion, Proyecto, Oficio, Documento, EvaluacionCC, PreguntaEvaluacionCC, Evaluacion, VersionProyecto, DesignacionAsistente, ColaboradorSecundario

class ProyectoSerializer(serializers.ModelSerializer):
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
    class Meta:
        model = EvaluacionCC
        fields = '__all__'

class PreguntaEvaluacionCCSerializer(serializers.ModelSerializer):
    class Meta:
        model = PreguntaEvaluacionCC
        fields = '__all__'

class EvaluacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluacion
        fields = '__all__'

class PreguntaEvaluacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PreguntaEvaluacion
        fields = '__all__'

class VersionProyectoSerializer(serializers.ModelSerializer):
    class Meta:
        model = VersionProyecto
        fields = '__all__'

class DesignacionAsistenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = DesignacionAsistente
        fields = '__all__'

class ColaboradorSecundarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = ColaboradorSecundario
        fields = '__all__'