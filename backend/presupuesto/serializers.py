from rest_framework import serializers
from .models import TipoPresupuesto, EnteFinanciero, Presupuesto, VersionPresupuesto, Partida, Proveedor, ProductoServicio, Factura, Gasto, CuentaBancaria
from version_proyecto.serializers import OficioSerializer, ProyectoSerializer

class TipoPresupuestoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoPresupuesto
        fields = '__all__'

class EnteFinancieroSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnteFinanciero
        fields = '__all__'

class PresupuestoSerializer(serializers.ModelSerializer):
    id_tipo_presupuesto_fk = TipoPresupuestoSerializer()
    id_ente_financiero_fk = EnteFinancieroSerializer()
    id_oficio_fk = OficioSerializer()
    id_codigo_vi = ProyectoSerializer()
    class Meta:
        model = Presupuesto
        fields = '__all__'

class VersionPresupuestoSerializer(serializers.ModelSerializer):
    id_presupuesto_fk = ProyectoSerializer()
    class Meta:
        model = VersionPresupuesto
        fields = '__all__'

class PartidaSerializer(serializers.ModelSerializer):
    id_version_presupuesto_fk = VersionPresupuestoSerializer()
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
    id_cedula_proveedor_fk = ProveedorSerializer()
    id_producto_servicio_fk = ProductoServicioSerializer()
    class Meta:
        model = Factura
        fields = '__all__'

class GastoSerializer(serializers.ModelSerializer):
    id_partida_fk = PartidaSerializer()
    id_factura_fk = FacturaSerializer()
    class Meta:
        model = Gasto
        fields = '__all__'

class CuentaBancariaSerializer(serializers.ModelSerializer):
    id_proveedor_fk = ProveedorSerializer()
    class Meta:
        model = CuentaBancaria
        fields = '__all__'