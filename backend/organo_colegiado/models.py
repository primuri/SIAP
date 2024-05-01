from django.db import models
from personas.models import Academico, PersonaExterna, NombreCompleto
from version_proyecto.models import Documento, Oficio, Vigencia
from django.template.loader import render_to_string
from django.core.mail import EmailMessage
from django.conf import settings
import logging
from threading import Thread
from django.db.models.signals import post_save,pre_delete
from django.dispatch import receiver

class OrganoColegiado(models.Model):
    id_organo_colegiado = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=128)
    numero_miembros = models.IntegerField()
    quorum = models.IntegerField()
    acuerdo_firme = models.IntegerField()

    class Meta:
        db_table = 'organo_colegiado'


logger = logging.getLogger(__name__)

def enviar_correo_organo_colegiado(asunto, instance, destinatario):
    def enviar():
        try:
            context = {
                'nombre': instance.nombre,
                'numero_miembros': instance.numero_miembros,
                'quorum': instance.quorum,
                'acuerdo_firme': instance.acuerdo_firme,
            }

            mensaje_html = render_to_string('email_organo_colegiado.html', context)
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

    
@receiver(post_save, sender=OrganoColegiado)
def organo_colegiado_post_save(sender, instance, created, **kwargs):
    if created:
        asunto = f"Nuevo Órgano Colegiado Creado: {instance.nombre}"
    else:
        asunto = f"Actualización de Órgano Colegiado: {instance.nombre}"
    
    enviar_correo_organo_colegiado(asunto, instance, settings.EMAIL_DEFAULT_SENDER)

@receiver(pre_delete, sender=OrganoColegiado)
def organo_colegiado_pre_delete(sender, instance, **kwargs):
    asunto = f"Eliminación de Órgano Colegiado: {instance.nombre}"
    enviar_correo_organo_colegiado(asunto, instance, settings.EMAIL_DEFAULT_SENDER)

class Integrante(models.Model):
    id_integrante = models.AutoField(primary_key=True) 
    id_organo_colegiado_fk = models.ForeignKey(OrganoColegiado, on_delete=models.PROTECT)
    id_oficio_fk = models.ForeignKey(Oficio, on_delete=models.PROTECT)
    id_vigencia_fk = models.ForeignKey(Vigencia, on_delete=models.PROTECT)
    nombre_integrante = models.CharField(max_length=120)
    puesto = models.CharField(max_length=120)
    normativa_reguladora = models.CharField(max_length=120)
    inicio_funciones = models.DateTimeField( blank=True, null=True) 

    class Meta:
        db_table = 'integrante'
        unique_together = (('id_organo_colegiado_fk', 'id_integrante'),)


logger = logging.getLogger(__name__)

def enviar_correo_integrante(asunto, instance, destinatario):
    def enviar():
        try:
            documento = instance.id_oficio_fk

            context = {
                'organo_colegiado': instance.id_organo_colegiado_fk.nombre,
                'nombre_integrante': instance.nombre_integrante,
                'puesto': instance.puesto,
                'normativa_reguladora': instance.normativa_reguladora,
                'inicio_funciones': instance.inicio_funciones.strftime('%Y-%m-%d') or 'N/A',
                'fecha_inicio_vigencia': instance.id_vigencia_fk.fecha_inicio.strftime("%Y-%m-%d") if instance.id_vigencia_fk and instance.id_vigencia_fk.fecha_inicio else 'N/A',
                'fecha_fin_vigencia': instance.id_vigencia_fk.fecha_fin.strftime("%Y-%m-%d") if instance.id_vigencia_fk and instance.id_vigencia_fk.fecha_fin else 'N/A',
                'oficio_detalle': documento.detalle,
                'oficio_nombre': documento.ruta_archivo.name.split('/')[-1] if documento else 'No disponible',
            }

            mensaje_html = render_to_string('email_integrante.html', context)
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


@receiver(post_save, sender=Integrante)
def integrante_post_save(sender, instance, created, **kwargs):
    if created:
        asunto = f"Nuevo Integrante Creado: {instance.nombre_integrante}"
    else:
        asunto = f"Actualización del Integrante: {instance.nombre_integrante}"
    enviar_correo_integrante(asunto, instance, settings.EMAIL_DEFAULT_SENDER)

@receiver(pre_delete, sender=Integrante)
def integrante_pre_delete(sender, instance, **kwargs):
    asunto = f"Eliminación del Integrante: {instance.nombre_integrante} del Órgano Colegiado {instance.id_organo_colegiado_fk.nombre}"
    enviar_correo_integrante(asunto, instance, settings.EMAIL_DEFAULT_SENDER)



class Convocatoria(models.Model):
    id_convocatoria = models.AutoField(primary_key=True)
    id_documento_convocatoria_fk = models.ForeignKey(Documento, on_delete=models.CASCADE)

    class Meta:
        db_table = 'convocatoria'

class Agenda(models.Model):
    id_agenda = models.AutoField(primary_key=True)
    tipo = models.CharField(max_length=45)
    detalle = models.CharField(max_length=255)
    id_convocatoria_fk = models.ForeignKey(Convocatoria, on_delete=models.CASCADE)

    class Meta:
        db_table = 'agenda'

class Acta(models.Model):
    id_acta = models.AutoField(primary_key=True)
    id_documento_acta_fk = models.ForeignKey(Documento, on_delete=models.CASCADE)

    class Meta:
        db_table = 'acta'

class Sesion(models.Model):
    id_sesion = models.CharField(max_length=64, primary_key=True)
    fecha = models.DateTimeField()
    id_organo_colegiado_fk = models.ForeignKey(OrganoColegiado, on_delete=models.CASCADE)
    id_agenda_fk = models.ForeignKey(Agenda, on_delete=models.CASCADE)
    id_acta_fk = models.ForeignKey(Acta, on_delete=models.CASCADE)
    medio = models.CharField(max_length=128)
    link_carpeta = models.CharField(max_length=2048)

    class Meta:
        db_table = 'sesion'

class Invitado(models.Model):
    id_persona_externa_fk = models.ForeignKey(PersonaExterna, on_delete=models.PROTECT)
    id_sesion_fk = models.ForeignKey(Sesion, on_delete=models.PROTECT)

    class Meta:
        db_table = 'invitado'
        unique_together = (('id_persona_externa_fk', 'id_sesion_fk'),)

class Seguimiento(models.Model):
    id_seguimiento = models.AutoField(primary_key=True)
    id_documento_seguimiento_fk = models.ForeignKey(Documento, on_delete=models.CASCADE)

    class Meta:
        db_table = 'seguimiento'

class Acuerdo(models.Model):
    id_acuerdo = models.AutoField(primary_key=True)
    descripcion = models.CharField(max_length=255)
    estado = models.CharField(max_length=45)
    fecha_cumplimiento = models.DateField()
    encargado = models.CharField(max_length=150)
    id_seguimiento_fk = models.ForeignKey(Seguimiento, on_delete=models.CASCADE)
    id_oficio_fk = models.ForeignKey(Oficio, on_delete=models.CASCADE)
    id_sesion_fk = models.ForeignKey(Sesion, on_delete=models.PROTECT)
    id_documento_acuerdo_fk = models.ForeignKey(Documento, on_delete=models.CASCADE)

    class Meta:
        db_table='acuerdo'

class Participante(models.Model):
   id_participante=  models.AutoField(primary_key=True) 
   estado=  models.CharField(max_length=45) 
   cedula=  models.CharField(max_length=15) 
   id_nombre_completo_fk=  models.ForeignKey(NombreCompleto,on_delete=models.PROTECT) 
   id_sesion_fk=  models.ForeignKey(Sesion,on_delete=models.PROTECT) 

   class Meta:
       db_table='participante'