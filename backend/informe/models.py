from django.db import models
from version_proyecto.models import VersionProyecto
from version_proyecto.models import EvaluacionCC
from version_proyecto.models import Oficio
from version_proyecto.models import Documento
from django.db.models.signals import post_save, post_delete,pre_delete
from django.dispatch import receiver
from django.conf import settings
import logging
from threading import Thread
from django.core.mail import EmailMessage
from django.template.loader import render_to_string

class Informe(models.Model):
    id_informe = models.AutoField(primary_key=True)
    estado = models.CharField(max_length=64)
    tipo = models.CharField(max_length=45)
    fecha_presentacion = models.DateTimeField()
    fecha_debe_presentar = models.DateTimeField()
    id_version_proyecto_fk = models.ForeignKey(VersionProyecto, on_delete=models.PROTECT)

logger = logging.getLogger(__name__)

def enviar_correo_informe(asunto, instance, destinatario):
    def enviar():
        try:
            
            contexto = {
                'id_informe': instance.id_informe if instance.id_informe else 'No disponible' ,
                'fecha_presentacion': instance.fecha_presentacion.strftime("%Y-%m-%d"),
                'fecha_debe_presentar': instance.fecha_debe_presentar.strftime("%Y-%m-%d"),
                'proyecto': f"{instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_vi} | {instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre}",
                'estado':f"{instance.estado}",
                'tipo': instance.tipo   
            }
        
            mensaje_html = render_to_string('email_informe.html', contexto)

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


@receiver(post_save, sender=Informe)
def informe_post_save(sender, instance, created, **kwargs):
    asunto = "Nuevo informe Creado" if created else "Informe Actualizado"
    enviar_correo_informe(asunto, instance, "brandonbadilla143@gmail.com")
    asunto_investigador =f"Se a creado un informe de su proyecto: {instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre} " if created else f"Se a realizado una modificación en el informe de su proyecto: {instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre}"
    destinatario_investigador = instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.correo
    enviar_correo_informe_investigador(asunto_investigador, instance, destinatario_investigador)


@receiver(pre_delete, sender=Informe)
def informe_post_delete(sender, instance, **kwargs):
    asunto = "Informe Eliminado"
    enviar_correo_informe(asunto, instance, "brandonbadilla143@gmail.com")
    asunto_investigador= f"Se a eliminado un informe de su proyecto: {instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre}"
    destinatario_investigador = instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.correo
    enviar_correo_informe_investigador(asunto_investigador, instance, destinatario_investigador)


def enviar_correo_informe_investigador(asunto, instance, destinatario):
    def enviar():
        try:
            
            contexto = {
                'id_informe': instance.id_informe if instance.id_informe else 'No disponible' ,
                'fecha_presentacion': instance.fecha_presentacion.strftime("%Y-%m-%d"),
                'fecha_debe_presentar': instance.fecha_debe_presentar.strftime("%Y-%m-%d"),
                'proyecto': f"{instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_vi} | {instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre}",
                'estado':f"{instance.estado}",
                'tipo': instance.tipo,
                'investigador': f"{instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.id_nombre_completo_fk.nombre} {instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.id_nombre_completo_fk.apellido} {instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.id_nombre_completo_fk.segundo_apellido}"
            }
        
            mensaje_html = render_to_string('email_informe_investigador.html', contexto)

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

class VersionInforme(models.Model):
    id_version_informe = models.AutoField(primary_key=True)
    numero_version = models.CharField(max_length=45)
    fecha_presentacion = models.DateTimeField()
    id_informe_fk = models.ForeignKey(Informe, on_delete=models.CASCADE)
    id_evaluacion_cc_fk = models.ForeignKey(EvaluacionCC, on_delete=models.PROTECT, null=True, blank=True)
    id_oficio_fk = models.ForeignKey(Oficio, on_delete=models.PROTECT)
    id_documento_informe_fk = models.ForeignKey(Documento, on_delete=models.PROTECT)

logger = logging.getLogger(__name__)

def enviar_correo_versionInforme(asunto, instance, destinatario):
    def enviar():
        try:
            documento = instance.id_documento_informe_fk
            oficio = instance.id_oficio_fk
            contexto = {
                'numero_version': instance.numero_version ,
                'fecha_presentacion': instance.fecha_presentacion.strftime("%Y-%m-%d"),
                'proyecto': f"{instance.id_informe_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_vi} | {instance.id_informe_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre}",
                'Informe':f"{instance.id_informe_fk.id_informe}",
                'oficio_detalle': oficio.detalle,
                'oficio_nombre': oficio.ruta_archivo.name.split('/')[-1] if oficio else 'No disponible',
                'informe_detalle': documento.detalle,
                'informe_nombre': documento.documento.name.split('/')[-1] if documento else 'No disponible'   
            }
        
            mensaje_html = render_to_string('email_versionInforme.html', contexto)

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


@receiver(post_save, sender=VersionInforme)
def versionInforme_post_save(sender, instance, created, **kwargs):
    asunto = "Nueva versión de informe Creada" if created else "Versión de informe Actualizada"
    enviar_correo_versionInforme(asunto, instance, "brandonbadilla143@gmail.com")
    asunto_investigador =f"Se a creado una versión de informe de su proyecto: {instance.id_informe_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre} " if created else f"Se a realizado una modificación en la versión de informe de su proyecto: {instance.id_informe_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre}"
    destinatario_investigador = instance.id_informe_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.correo
    enviar_correo_versionInforme_investigador(asunto_investigador, instance, destinatario_investigador)


@receiver(pre_delete, sender=VersionInforme)
def versionInforme_post_delete(sender, instance, **kwargs):
    asunto = "Versión de informe Eliminada"
    enviar_correo_versionInforme(asunto, instance, "brandonbadilla143@gmail.com")
    asunto_investigador= f"Se a eliminado una versión de informe de su proyecto: {instance.id_informe_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre}"
    destinatario_investigador = instance.id_informe_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.correo
    enviar_correo_versionInforme_investigador(asunto_investigador, instance, destinatario_investigador)

def enviar_correo_versionInforme_investigador(asunto, instance, destinatario):
    def enviar():
        try:
            documento = instance.id_documento_informe_fk
            oficio = instance.id_oficio_fk
            contexto = {
                'numero_version': instance.numero_version ,
                'fecha_presentacion': instance.fecha_presentacion.strftime("%Y-%m-%d"),
                'proyecto': f"{instance.id_informe_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_vi} | {instance.id_informe_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre}",
                'Informe':f"{instance.id_informe_fk.id_informe}",
                'oficio_detalle': oficio.detalle,
                'oficio_nombre': oficio.ruta_archivo.name.split('/')[-1] if oficio else 'No disponible',
                'informe_detalle': documento.detalle,
                'informe_nombre': documento.documento.name.split('/')[-1] if documento else 'No disponible',
                'investigador': f"{instance.id_informe_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.id_nombre_completo_fk.nombre} {instance.id_informe_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.id_nombre_completo_fk.apellido} {instance.id_informe_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.id_nombre_completo_fk.segundo_apellido}"
            }
        
            mensaje_html = render_to_string('email_versionInforme_investigador.html', contexto)

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


class Accion(models.Model):
    id_accion = models.AutoField(primary_key=True)
    fecha = models.DateTimeField()
    origen = models.CharField(max_length=192)
    destino = models.CharField(max_length=192)
    estado = models.CharField(max_length=155)
    id_version_informe_fk = models.ForeignKey(VersionInforme, on_delete=models.CASCADE)
    id_documento_accion_fk = models.ForeignKey(Documento, on_delete=models.PROTECT)

logger = logging.getLogger(__name__)

def enviar_correo_acciones(asunto, instance, destinatario):
    def enviar():
        try:
            documento = instance.id_documento_accion_fk
        
            contexto = {
                'id_accion': instance.id_accion if instance.id_accion else 'No disponible' ,
                'fecha': instance.fecha.strftime("%Y-%m-%d"),
                'origen': instance.origen,
                'destino': instance.destino,
                'estado': instance.estado,
                'proyecto': f"{instance.id_version_informe_fk.id_informe_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_vi} | {instance.id_version_informe_fk.id_informe_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre}",
                'version_informe':f"{instance.id_version_informe_fk.id_informe_fk.id_informe}  version N° {instance.id_version_informe_fk.numero_version}",
                'documento_nombre': documento.documento.name.split('/')[-1] if documento else 'No disponible'   
            }
        
            mensaje_html = render_to_string('email_accion.html', contexto)

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


@receiver(post_save, sender=Accion)
def accion_post_save(sender, instance, created, **kwargs):
    asunto = "Nueva acción de una versión de informe Creada" if created else "Acción de una versión de informe Actualizada"
    enviar_correo_acciones(asunto, instance, "brandonbadilla143@gmail.com")
    asunto_investigador =f"Se a creado una acción de una versión de informe de su proyecto: {instance.id_version_informe_fk.id_informe_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre} " if created else f"Se a realizado una modificación en la acción de una versión de informe de su proyecto: {instance.id_version_informe_fk.id_informe_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre}"
    destinatario_investigador = instance.id_version_informe_fk.id_informe_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.correo
    enviar_correo_acciones_investigador(asunto_investigador, instance, destinatario_investigador)


@receiver(pre_delete, sender=Accion)
def accion_post_delete(sender, instance, **kwargs):
    asunto = "Acción de una versión de informe Eliminada"
    enviar_correo_acciones(asunto, instance, "brandonbadilla143@gmail.com")
    asunto_investigador = f"Se a eliminado una acción de una versión de informe de su proyecto: {instance.id_version_informe_fk.id_informe_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre}"
    destinatario_investigador = instance.id_version_informe_fk.id_informe_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.correo
    enviar_correo_acciones_investigador(asunto_investigador, instance, destinatario_investigador)


def enviar_correo_acciones_investigador(asunto, instance, destinatario):
    def enviar():
        try:
            documento = instance.id_documento_accion_fk
        
            contexto = {
                'id_accion': instance.id_accion if instance.id_accion else 'No disponible' ,
                'fecha': instance.fecha.strftime("%Y-%m-%d"),
                'origen': instance.origen,
                'destino': instance.destino,
                'estado': instance.estado,
                'proyecto': f"{instance.id_version_informe_fk.id_informe_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_vi} | {instance.id_version_informe_fk.id_informe_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre}",
                'version_informe':f"{instance.id_version_informe_fk.id_informe_fk.id_informe}  version N° {instance.id_version_informe_fk.numero_version}",
                'documento_nombre': documento.documento.name.split('/')[-1] if documento else 'No disponible',  
                'investigador': f"{instance.id_version_informe_fk.id_informe_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.id_nombre_completo_fk.nombre} {instance.id_version_informe_fk.id_informe_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.id_nombre_completo_fk.apellido} {instance.id_version_informe_fk.id_informe_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.id_nombre_completo_fk.segundo_apellido}"
           
            }
        
            mensaje_html = render_to_string('email_accion_investigador.html', contexto)

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