from rest_framework import serializers

from version_proyecto.models import Documento, Oficio, Proyecto
from .models import TipoPresupuesto, EnteFinanciero, Presupuesto, VersionPresupuesto, Partida, Proveedor, ProductoServicio, Factura, Gasto, CuentaBancaria
from version_proyecto.serializers import OficioSerializer, ProyectoSerializer, DocumentoSerializer

class TipoPresupuestoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoPresupuesto
        fields = '__all__'

class EnteFinancieroSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnteFinanciero
        fields = '__all__'

class PresupuestoSerializer(serializers.ModelSerializer):
    id_tipo_presupuesto_fk = serializers.PrimaryKeyRelatedField(queryset=TipoPresupuesto.objects.all())
    id_ente_financiero_fk = serializers.PrimaryKeyRelatedField(queryset=EnteFinanciero.objects.all())
    id_oficio_fk = serializers.PrimaryKeyRelatedField(queryset=Oficio.objects.all())
    id_codigo_vi = serializers.PrimaryKeyRelatedField(queryset=Proyecto.objects.all())

    class Meta:
        model = Presupuesto
        fields = '__all__'

    def to_representation(self, instance):
        rep = super(PresupuestoSerializer, self).to_representation(instance)
        rep['id_tipo_presupuesto_fk'] = TipoPresupuestoSerializer(instance.id_tipo_presupuesto_fk).data
        rep['id_ente_financiero_fk'] = EnteFinancieroSerializer(instance.id_ente_financiero_fk).data
        rep['id_oficio_fk'] = OficioSerializer(instance.id_oficio_fk).data
        rep['id_codigo_vi'] = ProyectoSerializer(instance.id_codigo_vi).data
        return rep

class VersionPresupuestoSerializer(serializers.ModelSerializer):
    id_presupuesto_fk = serializers.PrimaryKeyRelatedField(queryset=Presupuesto.objects.all())

    class Meta:
        model = VersionPresupuesto
        fields = '__all__'

    def to_representation(self, instance):
        rep = super(VersionPresupuestoSerializer, self).to_representation(instance)
        rep['id_presupuesto_fk'] = PresupuestoSerializer(instance.id_presupuesto_fk).data
        return rep

class PartidaSerializer(serializers.ModelSerializer):
    id_version_presupuesto_fk = serializers.PrimaryKeyRelatedField(queryset=VersionPresupuesto.objects.all())

    class Meta:
        model = Partida
        fields = '__all__'

    def to_representation(self, instance):
        rep = super(PartidaSerializer, self).to_representation(instance)
        rep['id_version_presupuesto_fk'] = VersionPresupuestoSerializer(instance.id_version_presupuesto_fk).data
        return rep

class ProveedorSerializer(serializers.ModelSerializer):
    id_documento_fk = serializers.PrimaryKeyRelatedField(queryset=Documento.objects.all(), allow_null=True)
    class Meta:
        model = Proveedor
        fields = '__all__'

    def to_representation(self, instance):
        rep = super(ProveedorSerializer, self).to_representation(instance)
        rep['id_documento_fk'] = DocumentoSerializer(instance.id_documento_fk).data
        return rep

class ProductoServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductoServicio
        fields = '__all__'

class FacturaSerializer(serializers.ModelSerializer):
    id_cedula_proveedor_fk = serializers.PrimaryKeyRelatedField(queryset=Proveedor.objects.all())
    id_producto_servicio_fk = serializers.PrimaryKeyRelatedField(queryset=ProductoServicio.objects.all())

    class Meta:
        model = Factura
        fields = '__all__'

    def to_representation(self, instance):
        rep = super(FacturaSerializer, self).to_representation(instance)
        rep['id_cedula_proveedor_fk'] = ProveedorSerializer(instance.id_cedula_proveedor_fk).data
        rep['id_producto_servicio_fk'] = ProductoServicioSerializer(instance.id_producto_servicio_fk).data
        return rep

class GastoSerializer(serializers.ModelSerializer):
    id_partida_fk = serializers.PrimaryKeyRelatedField(queryset=Partida.objects.all())
    id_factura_fk = serializers.PrimaryKeyRelatedField(queryset=Factura.objects.all())

    class Meta:
        model = Gasto
        fields = '__all__'

    def to_representation(self, instance):
        rep = super(GastoSerializer, self).to_representation(instance)
        rep['id_partida_fk'] = PartidaSerializer(instance.id_partida_fk).data
        rep['id_factura_fk'] = FacturaSerializer(instance.id_factura_fk).data
        return rep

class CuentaBancariaSerializer(serializers.ModelSerializer):
    id_proveedor_fk = serializers.PrimaryKeyRelatedField(queryset=Proveedor.objects.all())

    class Meta:
        model = CuentaBancaria
        fields = '__all__'

    def to_representation(self, instance):
        rep = super(CuentaBancariaSerializer, self).to_representation(instance)
        rep['id_proveedor_fk'] = ProveedorSerializer(instance.id_proveedor_fk).data
        return rep