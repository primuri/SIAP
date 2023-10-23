from rest_framework import serializers
from version_proyecto.models import VersionProyecto, EvaluacionCC, Oficio, Documento
from version_proyecto.serializers import VersionProyectoSerializer, EvaluacionCCSerializer, OficioSerializer, DocumentoSerializer
from .models import Informe, VersionInforme, Accion

class InformeSerializer(serializers.ModelSerializer):
    id_version_proyecto_fk = serializers.PrimaryKeyRelatedField(queryset=VersionProyecto.objects.all())

    class Meta:
        model = Informe
        fields = '__all__'

    def to_representation(self, instance):
        rep = super(InformeSerializer, self).to_representation(instance)
        rep['id_version_proyecto_fk'] = VersionProyectoSerializer(instance.id_version_proyecto_fk).data
        return rep

class VersionInformeSerializer(serializers.ModelSerializer):
    id_informe_fk = serializers.PrimaryKeyRelatedField(queryset=Informe.objects.all())
    id_evaluacion_cc_fk = serializers.PrimaryKeyRelatedField(queryset=EvaluacionCC.objects.all(), allow_null=True)
    id_oficio_fk = serializers.PrimaryKeyRelatedField(queryset=Oficio.objects.all())
    id_documento_informe_fk = serializers.PrimaryKeyRelatedField(queryset=Documento.objects.all())

    class Meta:
        model = VersionInforme
        fields = '__all__'

    def to_representation(self, instance):
        rep = super(VersionInformeSerializer, self).to_representation(instance)
        rep['id_informe_fk'] = instance.id_informe_fk.id_informe
        rep['id_evaluacion_cc_fk'] = EvaluacionCCSerializer(instance.id_evaluacion_cc_fk).data
        rep['id_oficio_fk'] = OficioSerializer(instance.id_oficio_fk).data
        rep['id_documento_informe_fk'] = DocumentoSerializer(instance.id_documento_informe_fk).data
        return rep

class AccionSerializer(serializers.ModelSerializer):
    id_version_informe_fk = serializers.PrimaryKeyRelatedField(queryset=VersionInforme.objects.all())
    id_documento_accion_fk = serializers.PrimaryKeyRelatedField(queryset=Documento.objects.all())

    class Meta:
        model = Accion
        fields = '__all__'

    def to_representation(self, instance):
        rep = super(AccionSerializer, self).to_representation(instance)
        rep['id_version_informe_fk'] = VersionInformeSerializer(instance.id_version_informe_fk).data
        rep['id_documento_accion_fk'] = DocumentoSerializer(instance.id_documento_accion_fk).data
        return rep
