from rest_framework import serializers
from .models import NombreCompleto, AreaEspecialidad, Universidad, Academico, Telefono, Titulos, Evaluador, Asistente, Autor, Institucion, PersonaExterna

class NombreCompletoSerializer(serializers.ModelSerializer):
    class Meta:
        model = NombreCompleto
        fields = '__all__'

class AreaEspecialidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = AreaEspecialidad
        fields = '__all__'

class UniversidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Universidad
        fields = '__all__'

class AcademicoSerializer(serializers.ModelSerializer):
    id_nombre_completo_fk = serializers.PrimaryKeyRelatedField(queryset=NombreCompleto.objects.all())
    id_area_especialidad_fk = serializers.PrimaryKeyRelatedField(queryset=AreaEspecialidad.objects.all())
    id_area_especialidad_secundaria_fk = serializers.PrimaryKeyRelatedField(queryset=AreaEspecialidad.objects.all())
    universidad_fk = serializers.PrimaryKeyRelatedField(queryset=Universidad.objects.all())

    class Meta:
        model = Academico
        fields = '__all__'

    def to_representation(self, instance):
        rep = super(AcademicoSerializer, self).to_representation(instance)
        rep['id_nombre_completo_fk'] = NombreCompletoSerializer(instance.id_nombre_completo_fk).data
        rep['id_area_especialidad_fk'] = AreaEspecialidadSerializer(instance.id_area_especialidad_fk).data
        rep['id_area_especialidad_secundaria_fk'] = AreaEspecialidadSerializer(instance.id_area_especialidad_secundaria_fk).data
        rep['universidad_fk'] = UniversidadSerializer(instance.universidad_fk).data
        return rep


class TelefonoSerializer(serializers.ModelSerializer):
    id_academico_fk = serializers.PrimaryKeyRelatedField(queryset=Academico.objects.all(), write_only=True)

    class Meta:
        model = Telefono
        fields = '__all__'

    def to_representation(self, instance):
        rep = super(TelefonoSerializer, self).to_representation(instance)
        rep['id_academico_fk'] = AcademicoSerializer(instance.id_academico_fk).data
        
        return rep


class TitulosSerializer(serializers.ModelSerializer):
    id_academico_fk = serializers.PrimaryKeyRelatedField(queryset=Academico.objects.all(), write_only=True)
    class Meta:
        model = Titulos
        fields = '__all__'
    
    def to_representation(self, instance):
        rep = super(TitulosSerializer, self).to_representation(instance)
        rep['id_academico_fk'] = AcademicoSerializer(instance.id_academico_fk).data
        
        return rep  

class EvaluadorSerializer(serializers.ModelSerializer):
    id_nombre_completo_fk = serializers.PrimaryKeyRelatedField(queryset=NombreCompleto.objects.all())
    id_area_especialidad_fk = serializers.PrimaryKeyRelatedField(queryset=AreaEspecialidad.objects.all())
    universidad_fk = serializers.PrimaryKeyRelatedField(queryset=Universidad.objects.all())

    class Meta:
        model = Evaluador
        fields = '__all__'

    def to_representation(self, instance):
        rep = super(EvaluadorSerializer, self).to_representation(instance)
        rep['id_nombre_completo_fk'] = NombreCompletoSerializer(instance.id_nombre_completo_fk).data
        rep['id_area_especialidad_fk'] = AreaEspecialidadSerializer(instance.id_area_especialidad_fk).data
        rep['universidad_fk'] = UniversidadSerializer(instance.universidad_fk).data
        return rep

class AsistenteSerializer(serializers.ModelSerializer):#Modificar para el to_representation
    id_nombre_completo_fk = serializers.PrimaryKeyRelatedField(queryset=NombreCompleto.objects.all())
    class Meta:
        model = Asistente
        fields = '__all__'

    def to_representation(self, instance):
        rep = super(AsistenteSerializer, self).to_representation(instance)
        rep['id_nombre_completo_fk'] = NombreCompletoSerializer(instance.id_nombre_completo_fk).data
        return rep
    

class AutorSerializer(serializers.ModelSerializer):
    id_nombre_completo_fk = NombreCompletoSerializer()

    class Meta:
        model = Autor
        fields = '__all__'

    def to_representation(self, instance):
        rep = super(AutorSerializer, self).to_representation(instance)
        rep['id_nombre_completo_fk'] = NombreCompletoSerializer(instance.id_nombre_completo_fk).data
        return rep

    def create(self, validated_data):
        nombre_completo_data = validated_data.pop('id_nombre_completo_fk')
        nombre_completo_serializer = NombreCompletoSerializer(data=nombre_completo_data)
        if nombre_completo_serializer.is_valid(raise_exception=True):
            nombre_completo = nombre_completo_serializer.save()
        autor = Autor.objects.create(id_nombre_completo_fk=nombre_completo, **validated_data)
        return autor
    
    def update(self, instance, validated_data):
        nombre_completo_data = validated_data.pop('id_nombre_completo_fk', None)
        if nombre_completo_data:
            nombre_completo_serializer = NombreCompletoSerializer(instance.id_nombre_completo_fk, data=nombre_completo_data, partial=True)
            if nombre_completo_serializer.is_valid(raise_exception=True):
                nombre_completo_serializer.save()
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class InstitucionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institucion
        fields = '__all__'

class PersonaExternaSerializer(serializers.ModelSerializer):#Modificar para el to_representation
    id_nombre_completo_fk = NombreCompletoSerializer()
    id_institucion_fk = InstitucionSerializer()
    class Meta:
        model = PersonaExterna
        fields = '__all__'