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
    enviar_correo_evaluacion(asunto, instance, settings.EMAIL_DEFAULT_SENDER)
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


class RespuestaEvaluacion(models.Model):
    id_respuesta_evaluacion = models.AutoField(primary_key=True)
    id_evaluacion_fk = models.ForeignKey(Evaluacion, on_delete=models.PROTECT)
    pregunta = models.CharField(max_length=556)  
    respuesta = models.CharField(max_length=556)

    class Meta:
        db_table = 'respuesta_evaluacion'
    
def correo_evaluacion_respuestas(asunto,instance, destinatario):
    def enviar():
        try:
                       
            contexto = {
                'respuestas': [{'pregunta': respuesta.pregunta, 'respuesta': respuesta.respuesta} for respuesta in instance.id_evaluacion_fk.respuestaevaluacion_set.all()],
                'proyecto': f"{instance.id_evaluacion_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_vi} | {instance.id_evaluacion_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre}",
                'version': instance.id_evaluacion_fk.id_version_proyecto_fk.numero_version,
                'investigador': f"{instance.id_evaluacion_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.id_nombre_completo_fk.nombre} {instance.id_evaluacion_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.id_nombre_completo_fk.apellido} {instance.id_evaluacion_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.id_nombre_completo_fk.segundo_apellido}",
            }
            
            mensaje_html = render_to_string('email_respuestas.html', contexto)
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

@receiver(post_save, sender=RespuestaEvaluacion)
def respuestas_post_save(sender, instance, created, **kwargs):
        evaluacion = instance.id_evaluacion_fk
        respuestas_completas = RespuestaEvaluacion.objects.filter(id_evaluacion_fk=evaluacion).count() == 6
        if respuestas_completas:
            asunto = f"Respuestas de la evaluación de un Proyecto"
            asunto_asignacion = f"Respuestas de la evaluación a su proyecto: {instance.id_evaluacion_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre}"
            destinatario_asignacion = instance.id_evaluacion_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.correo 
            correo_respuestas(asunto,instance, settings.EMAIL_DEFAULT_SENDER)
            correo_evaluacion_respuestas(asunto_asignacion, instance, destinatario_asignacion)

def correo_respuestas(asunto,instance, destinatario):
    def enviar():
        try:
                       
            contexto = {
                'evaluador': f"{instance.id_evaluacion_fk.id_evaluador_fk.id_nombre_completo_fk.nombre} {instance.id_evaluacion_fk.id_evaluador_fk.id_nombre_completo_fk.apellido} {instance.id_evaluacion_fk.id_evaluador_fk.id_nombre_completo_fk.segundo_apellido}",
                'respuestas': [{'pregunta': respuesta.pregunta, 'respuesta': respuesta.respuesta} for respuesta in instance.id_evaluacion_fk.respuestaevaluacion_set.all()],
                'proyecto': f"{instance.id_evaluacion_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_vi} | {instance.id_evaluacion_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre}",
                'version': instance.id_evaluacion_fk.id_version_proyecto_fk.numero_version,
                'investigador': f"{instance.id_evaluacion_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.id_nombre_completo_fk.nombre} {instance.id_evaluacion_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.id_nombre_completo_fk.apellido} {instance.id_evaluacion_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.id_nombre_completo_fk.segundo_apellido}",
            }
            
            mensaje_html = render_to_string('email_respuestas_admin.html', contexto)
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


logger = logging.getLogger(__name__)

def enviar_correo_asistente(asunto, instance, destinatario):
    def enviar():
        try:
            
            documento = instance.id_documento_inopia_fk
            
            contexto = {
                'cantidad_horas': instance.cantidad_horas,
                'consecutivo': instance.consecutivo,
                'inopia_detalle': documento.detalle,
                'inopia_nombre': documento.documento.name.split('/')[-1] if documento else 'No disponible',
                'proyecto': f"{instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_vi} | {instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre}",
                'cedula': instance.id_asistente_carnet_fk.cedula,
                'condicion_estudiante': instance.id_asistente_carnet_fk.condicion_estudiante,
                'id_nombre_completo_fk': f"{instance.id_asistente_carnet_fk.id_nombre_completo_fk.nombre} {instance.id_asistente_carnet_fk.id_nombre_completo_fk.apellido} {instance.id_asistente_carnet_fk.id_nombre_completo_fk.segundo_apellido}",
                'carrera':  instance.id_asistente_carnet_fk.carrera,
                'promedio_ponderado':  instance.id_asistente_carnet_fk.promedio_ponderado,
                'version': instance.id_version_proyecto_fk.numero_version
            }
        
            mensaje_html = render_to_string('email_asistente.html', contexto)

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


@receiver(post_save, sender=DesignacionAsistente)
def asistente_post_save(sender, instance, created, **kwargs):
    asunto = "Nuevo Asistente Creado" if created else "Asistente Actualizado"
    enviar_correo_asistente(asunto, instance, settings.EMAIL_DEFAULT_SENDER)
    asunto_investigador =f"Se a creado un asistente en su proyecto: {instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre} " if created else f"Se a realizado la modificación de un asistente en su proyecto: {instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre}"
    destinatario_investigador = instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.correo
    enviar_correo_asistente_investigador(asunto_investigador, instance, destinatario_investigador)


@receiver(pre_delete, sender=DesignacionAsistente)
def asistente_post_delete(sender, instance, **kwargs):
    asunto = "Asistente Eliminado"
    enviar_correo_asistente(asunto, instance, settings.EMAIL_DEFAULT_SENDER)
    asunto_investigador= f"Se a eliminado un asistente de su proyecto: {instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre}"
    destinatario_investigador = instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.correo
    enviar_correo_asistente_investigador(asunto_investigador, instance, destinatario_investigador)


def enviar_correo_asistente_investigador(asunto, instance, destinatario):
    def enviar():
        try:
            
            documento = instance.id_documento_inopia_fk
            
            contexto = {
                'cantidad_horas': instance.cantidad_horas,
                'consecutivo': instance.consecutivo,
                'inopia_detalle': documento.detalle,
                'inopia_nombre': documento.documento.name.split('/')[-1] if documento else 'No disponible',
                'proyecto': f"{instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_vi} | {instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre}",
                'cedula': instance.id_asistente_carnet_fk.cedula,
                'condicion_estudiante': instance.id_asistente_carnet_fk.condicion_estudiante,
                'id_nombre_completo_fk': f"{instance.id_asistente_carnet_fk.id_nombre_completo_fk.nombre} {instance.id_asistente_carnet_fk.id_nombre_completo_fk.apellido} {instance.id_asistente_carnet_fk.id_nombre_completo_fk.segundo_apellido}",
                'carrera':  instance.id_asistente_carnet_fk.carrera,
                'promedio_ponderado':  instance.id_asistente_carnet_fk.promedio_ponderado,
                'investigador': f"{instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.id_nombre_completo_fk.nombre} {instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.id_nombre_completo_fk.apellido} {instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.id_nombre_completo_fk.segundo_apellido}",
                'version': instance.id_version_proyecto_fk.numero_version
            }
        
            mensaje_html = render_to_string('email_asistente_investigador.html', contexto)

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


logger = logging.getLogger(__name__)

def enviar_correo_version_proyecto(asunto, instance, destinatario):
    def enviar():
        try:
                   
            documento = instance.id_version_proyecto_fk.id_oficio_fk

            if instance.id_version_proyecto_fk.producto_set.exists():
                producto = instance.id_version_proyecto_fk.producto_set.first()
                productos = {
                    'detalle': producto.detalle,
                    'fecha': producto.fecha.strftime("%Y-%m-%d") or 'N/A',
                } 
                evento = producto.evento_set.first()  #Obtenemos el tipo de producto asociado
                software = producto.software_set.first() 
                articulo = producto.articulo_set.first() 
                if evento:
                    evento_oficio = evento.id_oficio_fk
                    eventos = {
                        'evento_nombre': evento.nombre,
                        'evento_resumen': evento.resumen,
                        'evento_pais': evento.pais,
                        'evento_tipo_participacion': evento.tipo_participacion,
                        'evento_enlace': evento.enlace  or 'No hay un link asociado',
                        'evento_institucion': evento.id_institucion_fk.nombre,
                        'evento_area':  evento.id_area_fk.nombre,
                        'evento_oficio_detalle': evento_oficio.detalle,
                        'evento_oficio_nombre': evento_oficio.ruta_archivo.name.split('/')[-1] or 'No disponible',
                    }  
                    productos.update(eventos)
                elif software:
                    software_documentacion = software.id_documento_documentacion_fk
                    softwares ={
                        'software_nombre': software.nombre,
                        'software_version': software.version,
                        'software_documentacion_detalle': software_documentacion.detalle,
                        'software_documentacion_nombre': software_documentacion.documento.name.split('/')[-1] or 'No disponible',
                    }
                    productos.update(softwares)
                elif articulo:
                    articulo_documento = articulo.id_documento_articulo_fk
                    articulos = {
                        'articulo_nombre': articulo.nombre ,
                        'articulo_fecha_publicacion': articulo.fecha_publicacion.strftime("%Y-%m-%d"),
                        'articulo_tipo': articulo.tipo,
                        'articulo_doi': articulo.doi, 
                        'articulo_isbn': articulo.isbn,
                        'articulo_cant_paginas': articulo.cant_paginas,
                        'articulo_observaciones': articulo.observaciones or "No posee observaciones",
                        'articulo_revista_nombre': articulo.id_revista_fk.nombre,
                        'articulo_revista_pais': articulo.id_revista_fk.pais,
                        'articulo_autor_nombre': f"{articulo.id_autor_fk.id_nombre_completo_fk.nombre} {articulo.id_autor_fk.id_nombre_completo_fk.apellido} {articulo.id_autor_fk.id_nombre_completo_fk.segundo_apellido}",
                        'articulo_documento_detalle': articulo_documento.detalle,
                        'articulo_documento_nombre': articulo_documento.documento.name.split('/')[-1] or 'No disponible',
                    }
                    productos.update(articulos)
                

            contexto = {
                'tipo': instance.tipo,
                'carga': instance.carga,
                'fecha_inicio': instance.id_vigencia_fk.fecha_inicio.strftime("%Y-%m-%d") if instance.id_vigencia_fk and instance.id_vigencia_fk.fecha_inicio else 'N/A',
                'fecha_fin': instance.id_vigencia_fk.fecha_fin.strftime("%Y-%m-%d") if instance.id_vigencia_fk and instance.id_vigencia_fk.fecha_fin else 'N/A',
                'proyecto': f"{instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_vi} | {instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre}",
                'estado': instance.estado,
                'detalle_version_proyecto': instance.id_version_proyecto_fk.detalle,
                'nombre_colaborador_secundario': f"{instance.id_academico_fk.id_nombre_completo_fk.nombre} {instance.id_academico_fk.id_nombre_completo_fk.apellido} {instance.id_academico_fk.id_nombre_completo_fk.segundo_apellido}",
                'numero_version':  instance.id_version_proyecto_fk.numero_version,
                'oficio_detalle': documento.detalle,
                'oficio_nombre': documento.ruta_archivo.name.split('/')[-1] or 'No disponible',
                'fecha_inicio_version': instance.id_version_proyecto_fk.id_vigencia_fk.fecha_inicio.strftime("%Y-%m-%d") if instance.id_version_proyecto_fk.id_vigencia_fk and instance.id_version_proyecto_fk.id_vigencia_fk.fecha_inicio else 'N/A',
                'fecha_fin_version': instance.id_version_proyecto_fk.id_vigencia_fk.fecha_fin.strftime("%Y-%m-%d") if instance.id_version_proyecto_fk.id_vigencia_fk and instance.id_version_proyecto_fk.id_vigencia_fk.fecha_fin else 'N/A',
                'id_version_proyecto': instance.id_version_proyecto_fk.id_version_proyecto,
                'investigador': f"{instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.id_nombre_completo_fk.nombre} {instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.id_nombre_completo_fk.apellido} {instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.id_nombre_completo_fk.segundo_apellido}",
                'productos': productos,
            }
        
            mensaje_html = render_to_string('email_version_proyecto.html', contexto)

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


@receiver(post_save, sender=ColaboradorSecundario)
def version_proyecto_post_save(sender, instance, created, **kwargs):
    asunto = "Nueva Versión de Proyecto Creada" if created else "Versión de Proyecto Actualizada"
    enviar_correo_version_proyecto(asunto, instance, settings.EMAIL_DEFAULT_SENDER)
    asunto_investigador =f"Se a creado una versión de su proyecto: {instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre} " if created else f"Se a realizado la modificación de una versión de su proyecto: {instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre}"
    destinatario_investigador = instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.correo
    enviar_correo_version_proyecto_investigador(asunto_investigador, instance, destinatario_investigador)


@receiver(pre_delete, sender=ColaboradorSecundario)
def version_proyecto_post_delete(sender, instance, **kwargs):
    asunto = "Versión Proyecto Eliminada"
    enviar_correo_version_proyecto(asunto, instance, settings.EMAIL_DEFAULT_SENDER)
    asunto_investigador= f"Se a eliminado una versión de su proyecto: {instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre}"
    destinatario_investigador = instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.correo
    enviar_correo_version_proyecto_investigador(asunto_investigador, instance, destinatario_investigador)


def enviar_correo_version_proyecto_investigador(asunto, instance, destinatario):
    def enviar():
        try:
       
            documento = instance.id_version_proyecto_fk.id_oficio_fk

            if instance.id_version_proyecto_fk.producto_set.exists():
                producto = instance.id_version_proyecto_fk.producto_set.first()
                productos = {
                    'detalle': producto.detalle,
                    'fecha': producto.fecha.strftime("%Y-%m-%d") or 'N/A',
                } 
                evento = producto.evento_set.first()  #Obtenemos el tipo de producto asociado
                software = producto.software_set.first() 
                articulo = producto.articulo_set.first() 
                if evento:
                    evento_oficio = evento.id_oficio_fk
                    eventos = {
                        'evento_nombre': evento.nombre,
                        'evento_resumen': evento.resumen,
                        'evento_pais': evento.pais,
                        'evento_tipo_participacion': evento.tipo_participacion,
                        'evento_enlace': evento.enlace  or 'No hay un link asociado',
                        'evento_institucion': evento.id_institucion_fk.nombre,
                        'evento_area':  evento.id_area_fk.nombre,
                        'evento_oficio_detalle': evento_oficio.detalle,
                        'evento_oficio_nombre': evento_oficio.ruta_archivo.name.split('/')[-1] or 'No disponible',
                    }  
                    productos.update(eventos)
                elif software:
                    software_documentacion = software.id_documento_documentacion_fk
                    softwares ={
                        'software_nombre': software.nombre,
                        'software_version': software.version,
                        'software_documentacion_detalle': software_documentacion.detalle,
                        'software_documentacion_nombre': software_documentacion.documento.name.split('/')[-1] or 'No disponible',
                    }
                    productos.update(softwares)
                elif articulo:
                    articulo_documento = articulo.id_documento_articulo_fk
                    articulos = {
                        'articulo_nombre': articulo.nombre ,
                        'articulo_fecha_publicacion': articulo.fecha_publicacion.strftime("%Y-%m-%d"),
                        'articulo_tipo': articulo.tipo,
                        'articulo_doi': articulo.doi, 
                        'articulo_isbn': articulo.isbn,
                        'articulo_cant_paginas': articulo.cant_paginas,
                        'articulo_observaciones': articulo.observaciones or "No posee observaciones",
                        'articulo_revista_nombre': articulo.id_revista_fk.nombre,
                        'articulo_revista_pais': articulo.id_revista_fk.pais,
                        'articulo_autor_nombre': f"{articulo.id_autor_fk.id_nombre_completo_fk.nombre} {articulo.id_autor_fk.id_nombre_completo_fk.apellido} {articulo.id_autor_fk.id_nombre_completo_fk.segundo_apellido}",
                        'articulo_documento_detalle': articulo_documento.detalle,
                        'articulo_documento_nombre': articulo_documento.documento.name.split('/')[-1] or 'No disponible',
                    }
                    productos.update(articulos)
                

            contexto = {
                'tipo': instance.tipo,
                'carga': instance.carga,
                'fecha_inicio': instance.id_vigencia_fk.fecha_inicio.strftime("%Y-%m-%d") if instance.id_vigencia_fk and instance.id_vigencia_fk.fecha_inicio else 'N/A',
                'fecha_fin': instance.id_vigencia_fk.fecha_fin.strftime("%Y-%m-%d") if instance.id_vigencia_fk and instance.id_vigencia_fk.fecha_fin else 'N/A',
                'proyecto': f"{instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_vi} | {instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre}",
                'estado': instance.estado,
                'detalle_version_proyecto': instance.id_version_proyecto_fk.detalle,
                'nombre_colaborador_secundario': f"{instance.id_academico_fk.id_nombre_completo_fk.nombre} {instance.id_academico_fk.id_nombre_completo_fk.apellido} {instance.id_academico_fk.id_nombre_completo_fk.segundo_apellido}",
                'numero_version':  instance.id_version_proyecto_fk.numero_version,
                'oficio_detalle': documento.detalle,
                'oficio_nombre': documento.ruta_archivo.name.split('/')[-1] or 'No disponible',
                'fecha_inicio_version': instance.id_version_proyecto_fk.id_vigencia_fk.fecha_inicio.strftime("%Y-%m-%d") if instance.id_version_proyecto_fk.id_vigencia_fk and instance.id_version_proyecto_fk.id_vigencia_fk.fecha_inicio else 'N/A',
                'fecha_fin_version': instance.id_version_proyecto_fk.id_vigencia_fk.fecha_fin.strftime("%Y-%m-%d") if instance.id_version_proyecto_fk.id_vigencia_fk and instance.id_version_proyecto_fk.id_vigencia_fk.fecha_fin else 'N/A',
                'id_version_proyecto': instance.id_version_proyecto_fk.id_version_proyecto,
                'investigador': f"{instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.id_nombre_completo_fk.nombre} {instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.id_nombre_completo_fk.apellido} {instance.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.id_nombre_completo_fk.segundo_apellido}",
                'productos': productos,
            }
        
            mensaje_html = render_to_string('email_version_proyecto_investigador.html', contexto)

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