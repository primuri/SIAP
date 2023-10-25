from django.db import models
from version_proyecto.models import Oficio, Proyecto

class TipoPresupuesto(models.Model):
    id_tipo_presupuesto = models.AutoField(primary_key=True)
    tipo = models.CharField(max_length=45)
    detalle = models.CharField(max_length=255, null=True)
    
    class Meta:
        db_table = 'tipo_presupuesto'

class EnteFinanciero(models.Model):
    id_ente_financiero = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=150, unique=True)
    
    class Meta:
        db_table = 'ente_financiero'

class Presupuesto(models.Model):
    id_presupuesto = models.AutoField(primary_key=True)
    anio_aprobacion = models.IntegerField()
    id_tipo_presupuesto_fk = models.ForeignKey(TipoPresupuesto, on_delete=models.PROTECT)
    id_ente_financiero_fk = models.ForeignKey(EnteFinanciero, on_delete=models.PROTECT)
    id_oficio_fk = models.ForeignKey(Oficio, on_delete=models.PROTECT)
    id_codigo_vi = models.ForeignKey(Proyecto, on_delete=models.PROTECT)
    codigo_financiero = models.IntegerField()
    
    class Meta:
        db_table = 'presupuesto'

class VersionPresupuesto(models.Model):
    id_version_presupuesto = models.AutoField(primary_key=True)
    version = models.CharField(max_length=45)
    monto = models.CharField(max_length=45)
    saldo = models.DecimalField(max_digits=10, decimal_places=2)
    fecha = models.DateTimeField()
    detalle = models.CharField(max_length=255, null=True)
    id_presupuesto_fk = models.ForeignKey(Presupuesto, on_delete=models.PROTECT)
    
    class Meta:
        db_table = 'version_presupuesto'

class Partida(models.Model):
    id_partida = models.AutoField(primary_key=True)
    detalle = models.CharField(max_length=255)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    saldo = models.DecimalField(max_digits=10, decimal_places=2)
    id_version_presupuesto_fk = models.ForeignKey(VersionPresupuesto, on_delete=models.PROTECT)

    class Meta:
        db_table = 'partida'

class Proveedor(models.Model):
    id_cedula_proveedor = models.CharField(max_length=11, primary_key=True, unique=True)
    correo = models.CharField(max_length=64)
    nombre = models.CharField(max_length=128)
    telefono = models.CharField(max_length=45)

    class Meta:
        db_table = 'proveedor'

class ProductoServicio(models.Model):
    id_producto_servicio = models.IntegerField(primary_key=True)
    detalle = models.CharField(max_length=150)

    class Meta:
        db_table = 'producto_servicio'

class Factura(models.Model):
    id_factura = models.AutoField(primary_key=True)
    id_cedula_proveedor_fk = models.ForeignKey(Proveedor, on_delete=models.PROTECT)
    id_producto_servicio_fk = models.ForeignKey(ProductoServicio, on_delete=models.PROTECT)

    class Meta:
        db_table = 'factura'

class Gasto(models.Model):
    id_gasto = models.AutoField(primary_key=True)
    fecha = models.DateTimeField()
    detalle = models.CharField(max_length=255)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    id_partida_fk = models.ForeignKey(Partida, on_delete=models.PROTECT)
    id_factura_fk = models.ForeignKey(Factura, on_delete=models.PROTECT)
    tipo = models.CharField(max_length=64)

    class Meta:
        db_table = 'gasto'

class CuentaBancaria(models.Model):
    id_numero = models.IntegerField(primary_key=True)
    banco = models.CharField(max_length=255)
    tipo = models.CharField(max_length=45)
    moneda = models.CharField(max_length=45)
    cuenta_principal = models.BooleanField()
    id_proveedor_fk = models.ForeignKey(Proveedor, on_delete=models.CASCADE, db_column='id_proveedor_fk')

    class Meta:
        db_table = 'cuenta_bancaria'
        unique_together = (('banco','tipo','moneda','cuenta_principal', 'id_proveedor_fk'),) 

