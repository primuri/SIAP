from rest_framework import serializers
from .models import TipoPresupuesto, EnteFinanciero, Presupuesto, VersionPresupuesto, Partida, Proveedor, ProductoServicio, Factura, Gasto, CuentaBancaria

class TipoPresupuestoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoPresupuesto
        fields = '__all__'

class EnteFinancieroSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnteFinanciero
        fields = '__all__'

class PresupuestoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Presupuesto
        fields = '__all__'

class VersionPresupuestoSerializer(serializers.ModelSerializer):
    class Meta:
        model = VersionPresupuesto
        fields = '__all__'
class PartidaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partida
        fields = '__all__'

class ProveedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proveedor
        fields = '__all__'

class ProductoServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductoServicio
        fields = '__all__'

class FacturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Factura
        fields = '__all__'

class GastoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gasto
        fields = '__all__'

class CuentaBancariaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CuentaBancaria
        fields = '__all__'