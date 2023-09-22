from rest_framework import serializers
from .models import Informe, VersionInforme, Accion

class InformeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Informe
        fields = '__all__'

class VersionInformeSerializer(serializers.ModelSerializer):
    class Meta:
        model = VersionInforme
        fields = '__all__'

class AccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Accion
        fields = '__all__'
