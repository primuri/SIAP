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
from django.db.models.signals import pre_save, post_delete


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

class Presupuesto(models.Model):
    id_presupuesto = models.AutoField(primary_key=True)
    anio_aprobacion = models.IntegerField()
    tipo_presupuesto = models.CharField(max_length=255, default='')
    id_ente_financiero_fk = models.ForeignKey(EnteFinanciero, on_delete=models.PROTECT)
    id_oficio_fk = models.ForeignKey(Oficio, on_delete=models.PROTECT)
    id_codigo_vi = models.ForeignKey(Proyecto, on_delete=models.PROTECT)
    id_codigo_financiero_fk = models.ForeignKey(CodigoFinanciero, on_delete=models.PROTECT)
    id_version_proyecto_fk = models.ForeignKey(VersionProyecto, on_delete=models.PROTECT)
    
    class Meta:
        db_table = 'presupuesto'


logger = logging.getLogger(__name__)

def enviar_correo_presupuesto(asunto, instance, destinatario):
    def enviar():
        try:
            documento = instance.id_oficio_fk
            
            contexto = {
                'anio_aprobacion': instance.anio_aprobacion ,
                'ente_financiero': instance.id_ente_financiero_fk.nombre,
                'tipo_presupuesto':f"{instance.tipo_presupuesto}",
                'version': instance.id_version_proyecto_fk.numero_version,
                'codigo_financiero': instance.id_codigo_financiero_fk.codigo,
                'proyecto': f"{instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_vi} | {instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre}",
                'oficio_detalle': documento.detalle,
                'oficio_nombre': documento.ruta_archivo.name.split('/')[-1] if documento else 'No disponible',
            }
        
            mensaje_html = render_to_string('email_presupuesto.html', contexto)

            correo = EmailMessage(
                subject=asunto,
                body=mensaje_html,
                from_email=settings.EMAIL_HOST_USER,
                to=[destinatario],
            )
            correo.content_subtype = 'html' 
            correo.send()
        except Exception as e:
            logger.error(f"Error al enviar el correo de notificación: {e}")
    Thread(target=enviar).start()

@receiver(post_save, sender=Presupuesto)
def presupuesto_post_save(sender, instance, created, **kwargs):
    asunto = "Nuevo Presupuesto Creado" if created else "Presupuesto Actualizado"
    enviar_correo_presupuesto(asunto, instance, settings.EMAIL_DEFAULT_SENDER)
    asunto_investigador =f"Se a creado un presupuesto de su proyecto: {instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre} " if created else f"Se a realizado una modificación del presupuesto de su proyecto: {instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre}"
    destinatario_investigador = instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.correo
    enviar_correo_presupuesto_investigador(asunto_investigador, instance, destinatario_investigador)


@receiver(pre_delete, sender=Presupuesto)
def presupuesto_post_delete(sender, instance, **kwargs):
    asunto = "Presupuesto Eliminado"
    enviar_correo_presupuesto(asunto, instance, settings.EMAIL_DEFAULT_SENDER)
    asunto_investigador = f"Se a eliminado un presupuesto de su proyecto: {instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre}"
    destinatario_investigador = instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.correo
    enviar_correo_presupuesto_investigador(asunto_investigador, instance, destinatario_investigador)


def enviar_correo_presupuesto_investigador(asunto, instance, destinatario):
    def enviar():
        try:
            documento = instance.id_oficio_fk
            
            contexto = {
                'anio_aprobacion': instance.anio_aprobacion ,
                'ente_financiero': instance.id_ente_financiero_fk.nombre,
                'tipo_presupuesto':f"{instance.tipo_presupuesto}",
                'version': instance.id_version_proyecto_fk.numero_version,
                'codigo_financiero': instance.id_codigo_financiero_fk.codigo,
                'proyecto': f"{instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_vi} | {instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre}",
                'oficio_detalle': documento.detalle,
                'oficio_nombre': documento.ruta_archivo.name.split('/')[-1] if documento else 'No disponible',
                'investigador': f"{instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.id_nombre_completo_fk.nombre} {instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.id_nombre_completo_fk.apellido} {instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.id_nombre_completo_fk.segundo_apellido}",
            }
        
            mensaje_html = render_to_string('email_presupuesto_investigador.html', contexto)

            correo = EmailMessage(
                subject=asunto,
                body=mensaje_html,
                from_email=settings.EMAIL_HOST_USER,
                to=[destinatario],
            )
            correo.content_subtype = 'html' 
            correo.send()
        except Exception as e:
            logger.error(f"Error al enviar el correo de notificación: {e}")
    Thread(target=enviar).start()

class VersionPresupuesto(models.Model):
    id_version_presupuesto = models.AutoField(primary_key=True)
    version = models.CharField(max_length=45)
    monto = models.CharField(max_length=45)
    fecha = models.DateTimeField()
    detalle = models.CharField(max_length=255, null=True)
    id_presupuesto_fk = models.ForeignKey(Presupuesto, on_delete=models.PROTECT)
    
    class Meta:
        db_table = 'version_presupuesto'

logger = logging.getLogger(__name__)

def enviar_correo_versionPresupuesto(asunto, instance, destinatario):
    def enviar():
        try:
            
            contexto = {
                'version': instance.version ,
                'monto': instance.monto,
                'fecha': instance.fecha.strftime("%Y-%m-%d"),
                'detalle': instance.detalle,
                'proyecto': f"{instance.id_presupuesto_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_vi} | {instance.id_presupuesto_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre}",
                'version_proyecto': instance.id_presupuesto_fk.id_version_proyecto_fk.numero_version,
            }
        
            mensaje_html = render_to_string('email_versioPresupuesto.html', contexto)

            correo = EmailMessage(
                subject=asunto,
                body=mensaje_html,
                from_email=settings.EMAIL_HOST_USER,
                to=[destinatario],
            )
            correo.content_subtype = 'html' 
            correo.send()
        except Exception as e:
            logger.error(f"Error al enviar el correo de notificación: {e}")
    Thread(target=enviar).start()

@receiver(post_save, sender=VersionPresupuesto)
def versionPresupuesto_post_save(sender, instance, created, **kwargs):
    asunto = "Nueva Versión de Presupuesto Creada" if created else "Versión de Presupuesto Actualizada"
    enviar_correo_versionPresupuesto(asunto, instance, settings.EMAIL_DEFAULT_SENDER)
    asunto_investigador =f"Se a creado una versión de presupuesto de su proyecto: {instance.id_presupuesto_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre} " if created else f"Se a realizado una modificación de una versión de presupuesto de su proyecto: {instance.id_presupuesto_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre}"
    destinatario_investigador = instance.id_presupuesto_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.correo
    enviar_correo_versionPresupuesto_investigador(asunto_investigador, instance, destinatario_investigador)


@receiver(pre_delete, sender=VersionPresupuesto)
def versionPresupuesto_post_delete(sender, instance, **kwargs):
    asunto = "Versión de Presupuesto Eliminado"
    enviar_correo_versionPresupuesto(asunto, instance, settings.EMAIL_DEFAULT_SENDER)
    asunto_investigador = f"Se a eliminado una versión de presupuesto de su proyecto: {instance.id_presupuesto_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre}"
    destinatario_investigador = instance.id_presupuesto_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.correo
    enviar_correo_versionPresupuesto_investigador(asunto_investigador, instance, destinatario_investigador)



def enviar_correo_versionPresupuesto_investigador(asunto, instance, destinatario):
    def enviar():
        try:
            
            contexto = {
                'version': instance.version ,
                'monto': instance.monto,
                'fecha': instance.fecha.strftime("%Y-%m-%d"),
                'detalle': instance.detalle,
                'proyecto': f"{instance.id_presupuesto_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_vi} | {instance.id_presupuesto_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre}",
                'version_proyecto': instance.id_presupuesto_fk.id_version_proyecto_fk.numero_version,
                'investigador': f"{instance.id_presupuesto_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.id_nombre_completo_fk.nombre} {instance.id_presupuesto_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.id_nombre_completo_fk.apellido} {instance.id_presupuesto_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.id_nombre_completo_fk.segundo_apellido}",
            }
        
            mensaje_html = render_to_string('email_versioPresupuesto_investigador.html', contexto)

            correo = EmailMessage(
                subject=asunto,
                body=mensaje_html,
                from_email=settings.EMAIL_HOST_USER,
                to=[destinatario],
            )
            correo.content_subtype = 'html' 
            correo.send()
        except Exception as e:
            logger.error(f"Error al enviar el correo de notificación: {e}")
    Thread(target=enviar).start()

class Partida(models.Model):
    id_partida = models.AutoField(primary_key=True)
    detalle = models.CharField(max_length=255)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    id_version_presupuesto_fk = models.ForeignKey(VersionPresupuesto, on_delete=models.PROTECT)

    class Meta:
        db_table = 'partida'

logger = logging.getLogger(__name__)

def enviar_correo_partida(asunto, instance, destinatario):
    def enviar():
        try:
            
            contexto = {
                'id_partida': instance.id_partida if instance.id_partida else "No encontrado",
                'monto': instance.monto,
                'detalle': instance.detalle,
                'version_presupuesto': instance.id_version_presupuesto_fk.version,
                'proyecto': f"{instance.id_version_presupuesto_fk.id_presupuesto_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_vi} | {instance.id_version_presupuesto_fk.id_presupuesto_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre}",
                'version': instance.id_version_presupuesto_fk.id_presupuesto_fk.id_version_proyecto_fk.numero_version,
            }
        
            mensaje_html = render_to_string('email_partida.html', contexto)

            correo = EmailMessage(
                subject=asunto,
                body=mensaje_html,
                from_email=settings.EMAIL_HOST_USER,
                to=[destinatario],
            )
            correo.content_subtype = 'html' 
            correo.send()
        except Exception as e:
            logger.error(f"Error al enviar el correo de notificación: {e}")
    Thread(target=enviar).start()

@receiver(post_save, sender=Partida)
def partida_post_save(sender, instance, created, **kwargs):
    asunto = "Nueva Partida de una Versión de Presupuesto Creada" if created else "Partida de una Versión de Presupuesto Actualizada"
    enviar_correo_partida(asunto, instance, settings.EMAIL_DEFAULT_SENDER)
    asunto_investigador =f"Se a creado una partida de una versión de presupuesto de su proyecto: {instance.id_version_presupuesto_fk.id_presupuesto_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre} " if created else f"Se a realizado una modificación de una partida de una versión de presupuesto de su proyecto: {instance.id_version_presupuesto_fk.id_presupuesto_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre}"
    destinatario_investigador = instance.id_version_presupuesto_fk.id_presupuesto_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.correo
    enviar_correo_partida_investigador(asunto_investigador, instance, destinatario_investigador)


@receiver(pre_delete, sender=Partida)
def partida_post_delete(sender, instance, **kwargs):
    asunto = "Partida de una Versión de Presupuesto Eliminado"
    enviar_correo_partida(asunto, instance, settings.EMAIL_DEFAULT_SENDER)
    asunto_investigador = f"Se a eliminado una partida de una versión de presupuesto de su proyecto: {instance.id_version_presupuesto_fk.id_presupuesto_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre}"
    destinatario_investigador = instance.id_version_presupuesto_fk.id_presupuesto_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.correo
    enviar_correo_partida_investigador(asunto_investigador, instance, destinatario_investigador)



def enviar_correo_partida_investigador(asunto, instance, destinatario):
    def enviar():
        try:
            
            contexto = {
                'id_partida': instance.id_partida if instance.id_partida else "No encontrado",
                'monto': instance.monto,
                'detalle': instance.detalle,
                'version_presupuesto': instance.id_version_presupuesto_fk.version,
                'proyecto': f"{instance.id_version_presupuesto_fk.id_presupuesto_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_vi} | {instance.id_version_presupuesto_fk.id_presupuesto_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre}",
                'version': instance.id_version_presupuesto_fk.id_presupuesto_fk.id_version_proyecto_fk.numero_version,
                'investigador': f"{instance.id_version_presupuesto_fk.id_presupuesto_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.id_nombre_completo_fk.nombre} {instance.id_version_presupuesto_fk.id_presupuesto_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.id_nombre_completo_fk.apellido} {instance.id_version_presupuesto_fk.id_presupuesto_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.id_nombre_completo_fk.segundo_apellido}",
            }
        
            mensaje_html = render_to_string('email_partida_investigador.html', contexto)

            correo = EmailMessage(
                subject=asunto,
                body=mensaje_html,
                from_email=settings.EMAIL_HOST_USER,
                to=[destinatario],
            )
            correo.content_subtype = 'html' 
            correo.send()
        except Exception as e:
            logger.error(f"Error al enviar el correo de notificación: {e}")
    Thread(target=enviar).start()



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
    correo_proveedor(asunto, instance, settings.EMAIL_DEFAULT_SENDER)

@receiver(pre_delete, sender=Proveedor)
def proveedor_pre_delete(sender, instance, **kwargs):
    asunto = f"Eliminación del Proveedor: {instance.nombre}"
    correo_proveedor(asunto, instance, settings.EMAIL_DEFAULT_SENDER) # Cambiar por correo final



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


logger = logging.getLogger(__name__)

def enviar_correo_gasto(asunto, instance, destinatario):
    def enviar():
        try:   
            
            documento = instance.id_documento_fk
            
            contexto = {
                'id_gasto': instance.id_gasto if instance.id_gasto else "No encontrado",
                'fecha': instance.fecha.strftime("%Y-%m-%d"),
                'detalle':f"{instance.detalle}",
                'monto': instance.monto,
                'partida': instance.id_partida_fk.id_partida,
                'proveedor': instance.id_factura_fk.id_cedula_proveedor_fk.nombre,
                'producto_servicio': instance.id_factura_fk.id_producto_servicio_fk.detalle,
                'version_presupuesto': instance.id_partida_fk.id_version_presupuesto_fk.version,
                'proyecto': f"{instance.id_partida_fk.id_version_presupuesto_fk.id_presupuesto_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_vi} | {instance.id_partida_fk.id_version_presupuesto_fk.id_presupuesto_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre}",
                'version': instance.id_partida_fk.id_version_presupuesto_fk.id_presupuesto_fk.id_version_proyecto_fk.numero_version,
                'documento_nombre': documento.documento.name.split('/')[-1] or 'No disponible',
            }
        
            mensaje_html = render_to_string('email_gastos.html', contexto)

            correo = EmailMessage(
                subject=asunto,
                body=mensaje_html,
                from_email=settings.EMAIL_HOST_USER,
                to=[destinatario],
            )
            correo.content_subtype = 'html' 
            correo.send()
        except Exception as e:
            logger.error(f"Error al enviar el correo de notificación: {e}")
    Thread(target=enviar).start()

@receiver(post_save, sender=Gasto)
def gasto_post_save(sender, instance, created, **kwargs):
    asunto = "Nuevo Gasto de una Partida Creada" if created else "Gasto de una Partida Actualizada"
    enviar_correo_gasto(asunto, instance, settings.EMAIL_DEFAULT_SENDER)
    asunto_investigador =f"Se a creado un gasto de una partida de su proyecto: {instance.id_partida_fk.id_version_presupuesto_fk.id_presupuesto_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre} " if created else f"Se a realizado una modificación de un gasto de una partida de su proyecto: {instance.id_partida_fk.id_version_presupuesto_fk.id_presupuesto_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre}"
    destinatario_investigador = instance.id_partida_fk.id_version_presupuesto_fk.id_presupuesto_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.correo
    enviar_correo_gasto_investigador(asunto_investigador, instance, destinatario_investigador)


@receiver(pre_delete, sender=Gasto)
def gasto_post_delete(sender, instance, **kwargs):
    asunto = "Gasto de una Partida Eliminado"
    enviar_correo_gasto(asunto, instance, settings.EMAIL_DEFAULT_SENDER)
    asunto_investigador = f"Se a eliminado un gasto de una partida de su proyecto: {instance.id_partida_fk.id_version_presupuesto_fk.id_presupuesto_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre}"
    destinatario_investigador = instance.id_partida_fk.id_version_presupuesto_fk.id_presupuesto_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.correo
    enviar_correo_gasto_investigador(asunto_investigador, instance, destinatario_investigador)



def enviar_correo_gasto_investigador(asunto, instance, destinatario):
    def enviar():
        try:   
            
            documento = instance.id_documento_fk
            
            contexto = {
                'id_gasto': instance.id_gasto if instance.id_gasto else "No encontrado",
                'fecha': instance.fecha.strftime("%Y-%m-%d"),
                'detalle':f"{instance.detalle}",
                'monto': instance.monto,
                'partida': instance.id_partida_fk.id_partida,
                'proveedor': instance.id_factura_fk.id_cedula_proveedor_fk.nombre,
                'producto_servicio': instance.id_factura_fk.id_producto_servicio_fk.detalle,
                'version_presupuesto': instance.id_partida_fk.id_version_presupuesto_fk.version,
                'proyecto': f"{instance.id_partida_fk.id_version_presupuesto_fk.id_presupuesto_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_vi} | {instance.id_partida_fk.id_version_presupuesto_fk.id_presupuesto_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre}",
                'version': instance.id_partida_fk.id_version_presupuesto_fk.id_presupuesto_fk.id_version_proyecto_fk.numero_version,
                'documento_nombre': documento.documento.name.split('/')[-1] or 'No disponible',
                'investigador': f"{instance.id_partida_fk.id_version_presupuesto_fk.id_presupuesto_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.id_nombre_completo_fk.nombre} {instance.id_partida_fk.id_version_presupuesto_fk.id_presupuesto_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.id_nombre_completo_fk.apellido} {instance.id_partida_fk.id_version_presupuesto_fk.id_presupuesto_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.id_nombre_completo_fk.segundo_apellido}",
            }
        
            mensaje_html = render_to_string('email_gastos_investigador.html', contexto)

            correo = EmailMessage(
                subject=asunto,
                body=mensaje_html,
                from_email=settings.EMAIL_HOST_USER,
                to=[destinatario],
            )
            correo.content_subtype = 'html' 
            correo.send()
        except Exception as e:
            logger.error(f"Error al enviar el correo de notificación: {e}")
    Thread(target=enviar).start()

class CuentaBancaria(models.Model):
    id_numero = models.CharField(max_length=25, primary_key=True)
    banco = models.CharField(max_length=255)
    tipo = models.CharField(max_length=45)
    moneda = models.CharField(max_length=45)
    cuenta_principal = models.CharField(max_length=45)
    id_proveedor_fk = models.ForeignKey(Proveedor, on_delete=models.CASCADE)

    class Meta:
        db_table = 'cuenta_bancaria'
        unique_together = (('id_numero','banco','tipo','moneda','cuenta_principal','id_proveedor_fk'),) 

