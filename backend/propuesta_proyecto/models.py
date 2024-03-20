from django.db import models, transaction
from datetime import datetime
from personas.models import Academico
from django.db.models.signals import pre_delete
from django.db.models.signals import pre_save
from threading import Thread
import logging
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.conf import settings
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.core.mail import send_mail
from django.utils.html import strip_tags
from django.forms.models import model_to_dict


class Vigencia(models.Model):
    id_vigencia = models.AutoField(primary_key=True)
    fecha_inicio = models.DateTimeField( blank=True, null=True)
    fecha_fin = models.DateTimeField( blank=True, null=True)

    class Meta:
        db_table = 'vigencia'

class ColaboradorPrincipal(models.Model):
    id_colaborador_principal = models.AutoField(primary_key=True)
    tipo = models.CharField(max_length=80)
    carga = models.CharField(max_length=80)
    estado = models.CharField(max_length=45)
    id_vigencia_fk = models.ForeignKey(Vigencia, on_delete=models.CASCADE, db_column='id_vigencia_fk',  blank=True, null=True)
    id_academico_fk = models.ForeignKey(Academico, on_delete=models.PROTECT, db_column='id_academico_fk')

    class Meta:
        db_table = 'colaborador_principal'

class PropuestaProyecto(models.Model):
    id_codigo_cimpa = models.CharField(max_length=45, primary_key=True)
    objetivo_general = models.CharField(max_length=255, blank=True)
    estado = models.CharField(max_length=45)
    nombre = models.CharField(max_length=360)
    descripcion = models.CharField(max_length=5000)
    fecha_vigencia = models.DateTimeField()
    actividad = models.CharField(max_length=128)
    id_colaborador_principal_fk = models.ForeignKey(ColaboradorPrincipal, on_delete=models.CASCADE, db_column='id_colaborador_principal_fk')

    class Meta:
        db_table = 'propuesta_proyecto'


logger = logging.getLogger(__name__)

def correo_propuestas(asunto, instance, destinatario):
    def enviar():
        try:
            # Obtener el documento asociado
            documento_asociado = instance.documentoasociado_set.first() 
        
            context = {
                'nombre': instance.nombre,
                'objetivo_general': instance.objetivo_general if instance.objetivo_general else 'Sin objetivo general',
                'estado': instance.estado,
                'descripcion': instance.descripcion,
                'actividad': instance.actividad,
                'fecha_vigencia': instance.fecha_vigencia.strftime("%Y-%m-%d"),
                'documentos_detalle': documento_asociado.detalle if documento_asociado else 'No disponible',
                'documento_nombre': documento_asociado.documento.name.split('/')[-1] if documento_asociado else 'No disponible',
                #Información del colaborador principal y su vigencia
                'id_academico_fk':  f"{instance.id_colaborador_principal_fk.id_academico_fk.id_nombre_completo_fk.nombre} {instance.id_colaborador_principal_fk.id_academico_fk.id_nombre_completo_fk.apellido} {instance.id_colaborador_principal_fk.id_academico_fk.id_nombre_completo_fk.segundo_apellido}",
                'tipo_colaborador': instance.id_colaborador_principal_fk.tipo,
                'carga_colaborador': instance.id_colaborador_principal_fk.carga,
                'estado_colaborador': instance.id_colaborador_principal_fk.estado,
                'fecha_inicio_vigencia': instance.id_colaborador_principal_fk.id_vigencia_fk.fecha_inicio.strftime("%Y-%m-%d") if instance.id_colaborador_principal_fk.id_vigencia_fk and instance.id_colaborador_principal_fk.id_vigencia_fk.fecha_inicio else 'N/A',
                'fecha_fin_vigencia': instance.id_colaborador_principal_fk.id_vigencia_fk.fecha_fin.strftime("%Y-%m-%d") if instance.id_colaborador_principal_fk.id_vigencia_fk and instance.id_colaborador_principal_fk.id_vigencia_fk.fecha_fin else 'N/A',
            }

            mensaje_html = render_to_string('email_propuesta_proyecto.html', context)

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

@receiver(post_save, sender=PropuestaProyecto)
def propuesta_post_save(sender, instance, created, **kwargs):
    asunto_general = f"Creación de Propuesta de Proyecto: {instance.nombre}" if created else f"Actualización de Propuesta de Proyecto: {instance.nombre}"
    correo_propuestas(asunto_general, instance, "brandonbadilla143@gmail.com")
    
    # Si la propuesta ha sido editada y su estado es "Aprobada", envía un correo adicional.
    if not created and instance.estado == 'Aprobada':
        asunto_aprobacion = f"Aprobación o Edición de la Propuesta de Proyecto: {instance.nombre}"
        destinatario_aprobacion = instance.id_colaborador_principal_fk.id_academico_fk.correo 
        correo_propuesta_aprobada(asunto_aprobacion, instance, destinatario_aprobacion)

@receiver(pre_delete, sender=PropuestaProyecto)
def propuesta_pre_delete(sender, instance, **kwargs):
    asunto = f"Eliminación de Propuesta de Proyecto: {instance.nombre}"
    correo_propuestas(asunto, instance, "brandonbadilla143@gmail.com") # Cambiar por correo final


def correo_propuesta_aprobada(asunto,instance, destinatario):
    
    documento_asociado = instance.documentoasociado_set.first() 
      
    context = {
        'nombre_investigador': f"{instance.id_colaborador_principal_fk.id_academico_fk.id_nombre_completo_fk.nombre} {instance.id_colaborador_principal_fk.id_academico_fk.id_nombre_completo_fk.apellido} {instance.id_colaborador_principal_fk.id_academico_fk.id_nombre_completo_fk.segundo_apellido}",
        'nombre_propuesta': instance.nombre,
        'objetivo_general': instance.objetivo_general if instance.objetivo_general else 'Sin objetivo general',
                'estado': instance.estado,
                'descripcion': instance.descripcion,
                'actividad': instance.actividad,
                'fecha_vigencia': instance.fecha_vigencia.strftime("%Y-%m-%d"),
                'documentos_detalle': documento_asociado.detalle if documento_asociado else 'No disponible',
                'documento_nombre': documento_asociado.documento.name.split('/')[-1] if documento_asociado else 'No disponible',
                #Información del colaborador principal y su vigencia
                'tipo_colaborador': instance.id_colaborador_principal_fk.tipo,
                'carga_colaborador': instance.id_colaborador_principal_fk.carga,
                'estado_colaborador': instance.id_colaborador_principal_fk.estado,
                'fecha_inicio_vigencia': instance.id_colaborador_principal_fk.id_vigencia_fk.fecha_inicio.strftime("%Y-%m-%d") if instance.id_colaborador_principal_fk.id_vigencia_fk and instance.id_colaborador_principal_fk.id_vigencia_fk.fecha_inicio else 'N/A',
                'fecha_fin_vigencia': instance.id_colaborador_principal_fk.id_vigencia_fk.fecha_fin.strftime("%Y-%m-%d") if instance.id_colaborador_principal_fk.id_vigencia_fk and instance.id_colaborador_principal_fk.id_vigencia_fk.fecha_fin else 'N/A',
    }

    mensaje_html = render_to_string('email_propuesta_aprobada.html', context)

    correo = EmailMessage(
        subject=asunto,
        body=mensaje_html,
        from_email=settings.EMAIL_HOST_USER,
        to=[destinatario],
    )
    correo.content_subtype = 'html'
    correo.send()


class DocumentoAsociado(models.Model):
    id_documentos_asociados = models.AutoField(primary_key=True)
    detalle = models.CharField(max_length=255)
    documento = models.FileField(upload_to='media/propuestas/')  # Se cambió de char a file
    id_codigo_cimpa_fk = models.ForeignKey(PropuestaProyecto, on_delete=models.CASCADE, db_column='id_codigo_cimpa_fk')

    class Meta:
        db_table = 'documento_asociado'
        unique_together = (( 'documento','id_codigo_cimpa_fk'),) # Para evitar que un mismo documento asociado este 2 veces

def documento_asociado_delete(sender, instance, **kwargs):
    instance.documento.delete(save=False)
pre_delete.connect(documento_asociado_delete, sender=DocumentoAsociado)

def documento_asociado_sustituir(sender, instance, **kwargs):
    try:
        obj = sender.objects.get(pk=instance.pk)
    except sender.DoesNotExist:
        return

    if obj.documento != instance.documento:
        obj.documento.delete(save=False)

pre_save.connect(documento_asociado_sustituir, sender=DocumentoAsociado)