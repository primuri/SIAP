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
    class Meta:
        model = Academico
        fields = '__all__'

class TelefonoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Telefono
        fields = '__all__'

class TitulosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Titulos
        fields = '__all__'

class EvaluadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluador
        fields = '__all__'

class AsistenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asistente
        fields = '__all__'

class AutorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Autor
        fields = '__all__'

class InstitucionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institucion
        fields = '__all__'

class PersonaExternaSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonaExterna
        fields = '__all__'
