from django.db import models
from propuesta_proyecto.models import PropuestaProyecto, Vigencia
from personas.models import Evaluador, Asistente, Academico
from django.db.models.signals import pre_delete
from django.db.models.signals import pre_save
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.conf import settings
import logging
from threading import Thread


class Proyecto(models.Model):
    id_codigo_vi = models.CharField(max_length=45, primary_key=True)
    id_codigo_cimpa_fk = models.ForeignKey(PropuestaProyecto, on_delete=models.PROTECT)

    class Meta:
        db_table = 'proyecto'

class Oficio(models.Model):
    id_oficio = models.AutoField(primary_key=True)
    ruta_archivo = models.FileField(null=False, upload_to='media/oficios/')  # Se cambió de char a file
    detalle = models.CharField(max_length=456, null=True)

    class Meta:
        db_table = 'oficio'
        unique_together = (( 'ruta_archivo','id_oficio'),)

def oficio_delete(sender, instance, **kwargs):
    instance.ruta_archivo.delete(save=False)
    
pre_delete.connect(oficio_delete, sender=Oficio)

def oficio_sustituir(sender, instance, **kwargs):
    try:
        obj = sender.objects.get(pk=instance.pk)
    except sender.DoesNotExist:
        return

    if obj.ruta_archivo != instance.ruta_archivo:
        obj.ruta_archivo.delete(save=False)

pre_save.connect(oficio_sustituir, sender=Oficio)

class Documento(models.Model):
    id_documento = models.AutoField(primary_key=True)
    tipo = models.CharField(max_length=45)
    detalle = models.CharField(max_length=360, null=True)
    documento = models.FileField(upload_to='media/documentos/',  max_length=500, null=True)  # Se cambió de char a file

    class Meta:
        db_table = 'documento'

def documento_delete(sender, instance, **kwargs):
    instance.documento.delete(save=False)
pre_delete.connect(documento_delete, sender=Documento)

def documento_sustituir(sender, instance, **kwargs):
    try:
        obj = sender.objects.get(pk=instance.pk)
    except sender.DoesNotExist:
        return

    if obj.documento != instance.documento:
        obj.documento.delete(save=False)

pre_save.connect(documento_sustituir, sender=Documento)

class EvaluacionCC(models.Model):
    id_evaluacion_cc = models.AutoField(primary_key=True)
    detalle = models.CharField(max_length=50)
    id_documento_evualuacion_fk = models.ForeignKey(Documento, on_delete=models.PROTECT)

    class Meta:
        db_table = 'evaluacion_cc'

class PreguntaEvaluacionCC(models.Model):
    id_pregunta_evaluacion_cc = models.AutoField(primary_key=True)
    pregunta = models.CharField(max_length=556)
    respuesta = models.CharField(max_length=128)
    id_evaluacion_cc_fk = models.ForeignKey(EvaluacionCC, on_delete=models.PROTECT)

    class Meta:
        db_table = 'pregunta_evaluacion_cc'

class VersionProyecto(models.Model):
    id_version_proyecto = models.AutoField(primary_key=True)
    detalle = models.CharField(max_length=255)
    numero_version = models.IntegerField(null=False)
    id_oficio_fk = models.ForeignKey(Oficio, on_delete=models.PROTECT)
    id_vigencia_fk = models.ForeignKey(Vigencia, on_delete=models.PROTECT)
    #id_evaluacion_cc_fk = models.ForeignKey(EvaluacionCC, blank=True, null=True, on_delete=models.PROTECT)
    id_codigo_vi_fk = models.ForeignKey(Proyecto, on_delete=models.PROTECT)

    class Meta:
        db_table = 'version_proyecto'
        unique_together = (('id_codigo_vi_fk', 'numero_version'),)

class Evaluacion(models.Model):
    id_evaluacion = models.AutoField(primary_key=True)
    detalle = models.CharField(max_length=128, blank=True)
    estado = models.CharField(max_length=128)
    id_version_proyecto_fk = models.ForeignKey(VersionProyecto, on_delete=models.PROTECT)
    id_evaluador_fk = models.ForeignKey(Evaluador, on_delete=models.PROTECT)
    id_documento_evaluacion_fk = models.ForeignKey(Documento, on_delete=models.PROTECT, null=True)

    class Meta:
        db_table = 'evaluacion'

logger = logging.getLogger(__name__)

def enviar_correo_evaluacion(asunto, instance, destinatario):
    def enviar():
        try:
            documento = instance.id_documento_evaluacion_fk
        
            contexto = {
                'detalle': instance.detalle if instance.detalle else 'No tiene detalle',
                'estado': instance.estado,
                'proyecto': f"{instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_vi} | {instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre}",
                'evaluador': f"{instance.id_evaluador_fk.id_nombre_completo_fk.nombre} {instance.id_evaluador_fk.id_nombre_completo_fk.apellido} {instance.id_evaluador_fk.id_nombre_completo_fk.segundo_apellido}",
                'documento_nombre': documento.documento.name.split('/')[-1] if documento else 'No disponible'   
            }
        
            mensaje_html = render_to_string('email_evaluacion.html', contexto)

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


@receiver(post_save, sender=Evaluacion)
def evaluacion_post_save(sender, instance, created, **kwargs):
    asunto = "Nueva Evaluación Creada" if created else "Evaluación Actualizada"
    enviar_correo_evaluacion(asunto, instance, "brandonbadilla143@gmail.com")
    if not created and instance.estado == 'Pendiente':
        asunto_asignacion = f"Se le asignó la evaluación del proyecto: {instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre}"
        destinatario_asignacion = instance.id_evaluador_fk.correo 
        correo_evaluacion_asignada(asunto_asignacion, instance, destinatario_asignacion)

def correo_evaluacion_asignada(asunto,instance, destinatario):
    def enviar():
        try:
                       
            contexto = {
                'detalle': instance.detalle if instance.detalle else 'No tiene detalle',
                'estado': instance.estado,
                'proyecto': f"{instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_vi} | {instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre}",
                'evaluador': f"{instance.id_evaluador_fk.id_nombre_completo_fk.nombre} {instance.id_evaluador_fk.id_nombre_completo_fk.apellido} {instance.id_evaluador_fk.id_nombre_completo_fk.segundo_apellido}",
                'version': instance.id_version_proyecto_fk.numero_version
            }
            
            mensaje_html = render_to_string('email_asignacion.html', contexto)
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


@receiver(post_delete, sender=Evaluacion)
def evaluacion_post_delete(sender, instance, **kwargs):
    asunto = "Evaluación Eliminada"
    enviar_correo_evaluacion(asunto, instance, "brandonbadilla143@gmail.com")


class RespuestaEvaluacion(models.Model):
    id_respuesta_evaluacion = models.AutoField(primary_key=True)
    id_evaluacion_fk = models.ForeignKey(Evaluacion, on_delete=models.PROTECT)
    pregunta = models.CharField(max_length=556)  
    respuesta = models.CharField(max_length=556)

    class Meta:
        db_table = 'respuesta_evaluacion'

class DesignacionAsistente(models.Model):
    id_designacion_asistente = models.AutoField(primary_key=True)
    cantidad_horas = models.DecimalField(max_digits=5, decimal_places=2)
    consecutivo = models.CharField(max_length=45)
    id_documento_inopia_fk = models.ForeignKey(Documento, on_delete=models.PROTECT)
    id_version_proyecto_fk = models.ForeignKey(VersionProyecto, on_delete=models.PROTECT, related_name='designaciones_asistente')
    id_asistente_carnet_fk = models.ForeignKey(Asistente, on_delete=models.PROTECT, related_name='designaciones_asistente')

    class Meta:
        db_table = 'designacion_asistente'
        unique_together = (('id_version_proyecto_fk', 'id_asistente_carnet_fk'),)

class ColaboradorSecundario(models.Model):
    id_colaborador_secundario = models.AutoField(primary_key=True)
    tipo = models.CharField(max_length=50)
    carga = models.CharField(max_length=80)
    estado = models.CharField(max_length=45)
    id_vigencia_fk = models.ForeignKey(Vigencia, on_delete=models.PROTECT)
    id_academico_fk = models.ForeignKey(Academico, on_delete=models.PROTECT)
    id_version_proyecto_fk = models.ForeignKey(VersionProyecto, on_delete=models.PROTECT)

    class Meta:
        db_table = 'colaborador_secundario'
        constraints = [
            models.UniqueConstraint(fields=['id_academico_fk', 'id_version_proyecto_fk'], name='unique_academico_proyecto')
        ]

