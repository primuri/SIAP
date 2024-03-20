from django.db import models
from version_proyecto.models import Oficio, Proyecto, Documento, VersionProyecto
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.db.models.signals import post_save
from django.dispatch import receiver
import logging
from django.conf import settings
from threading import Thread
from django.db.models.signals import pre_delete
from django.db.models.signals import pre_save

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

class CodigoFinanciero(models.Model):
    id_codigo_financiero = models.AutoField(primary_key=True)
    codigo = models.CharField(max_length=255,unique=True)

    class Meta:
        db_table = 'codigo_financiero'
#
class Presupuesto(models.Model):
    id_presupuesto = models.AutoField(primary_key=True)
    anio_aprobacion = models.IntegerField()
    id_tipo_presupuesto_fk = models.ForeignKey(TipoPresupuesto, on_delete=models.PROTECT)
    id_ente_financiero_fk = models.ForeignKey(EnteFinanciero, on_delete=models.PROTECT)
    id_oficio_fk = models.ForeignKey(Oficio, on_delete=models.PROTECT)
    id_codigo_vi = models.ForeignKey(Proyecto, on_delete=models.PROTECT)
    id_codigo_financiero_fk = models.ForeignKey(CodigoFinanciero, on_delete=models.PROTECT)
    id_version_proyecto_fk = models.ForeignKey(VersionProyecto, on_delete=models.PROTECT)
    
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
#
class Proveedor(models.Model):
    id_cedula_proveedor = models.CharField(max_length=11, primary_key=True, unique=True)
    tipo = models.CharField(max_length=45)
    correo = models.CharField(max_length=64)
    nombre = models.CharField(max_length=128)
    telefono = models.CharField(max_length=45)
    id_documento_fk = models.ForeignKey(Documento, on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        db_table = 'proveedor'


logger = logging.getLogger(__name__)

def correo_proveedor(asunto, instance, destinatario):
    def enviar():
        try:
            documento = instance.id_documento_fk
            
            cuentas_bancarias = instance.cuentabancaria_set.all()
            cuentas = [{
                'banco': cuenta.banco,
                'tipo': cuenta.tipo,
                'moneda': cuenta.moneda,
                'cuenta_principal': cuenta.cuenta_principal,
                'numero': cuenta.id_numero,
            } for cuenta in cuentas_bancarias] if cuentas_bancarias.exists() else []

            # Ahora ajustamos el contexto
            context = {
                'id_cedula_proveedor': instance.id_cedula_proveedor,
                'nombre': instance.nombre,
                'tipo': instance.tipo,
                'correo': instance.correo,
                'telefono': instance.telefono,
                'cuentas_bancarias': cuentas,
                'documentos_detalle': documento.detalle if documento else 'No disponible',
                'documento_nombre': documento.documento.name.split('/')[-1] if documento else 'No disponible',
            }

            mensaje_html = render_to_string('email_proveedor.html', context)

            correo = EmailMessage(
                subject=asunto,
                body=mensaje_html,
                from_email=settings.EMAIL_HOST_USER,
                to=[destinatario],
            )
            correo.content_subtype = 'html'
            correo.send()
        except Exception as e:
            logger.error(f"Error al enviar el correo: {e}")

    Thread(target=enviar).start()

@receiver(post_save, sender=Proveedor)
def proveedor_post_save(sender, instance, created, **kwargs):
    asunto = f"Creación de el nuevo Proveedor: {instance.nombre}" if created else f"Actualización del Proveedor {instance.nombre}"
    correo_proveedor(asunto, instance, "brandonbadilla143@gmail.com")

@receiver(pre_delete, sender=Proveedor)
def proveedor_pre_delete(sender, instance, **kwargs):
    asunto = f"Eliminación del Proveedor: {instance.nombre}"
    correo_proveedor(asunto, instance, "brandonbadilla143@gmail.com") # Cambiar por correo final



class ProductoServicio(models.Model):
    id_producto_servicio = models.AutoField(primary_key=True)
    detalle = models.CharField(max_length=150, unique=True)

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
    id_documento_fk = models.ForeignKey(Documento, on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        db_table = 'gasto'
#
class CuentaBancaria(models.Model):
    id_numero = models.CharField(max_length=25, primary_key=True)
    banco = models.CharField(max_length=255)
    tipo = models.CharField(max_length=45)
    moneda = models.CharField(max_length=45)
    cuenta_principal = models.CharField(max_length=45)
    id_proveedor_fk = models.ForeignKey(Proveedor, on_delete=models.CASCADE)

    class Meta:
        db_table = 'cuenta_bancaria'
        unique_together = (('banco','tipo','moneda','cuenta_principal','id_proveedor_fk'),) 

