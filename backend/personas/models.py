from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
import os
import datetime
import logging
from django.db.models.signals import pre_delete
from django.db.models.signals import pre_save
from django.core.mail import send_mail
from threading import Thread
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.forms.models import model_to_dict
from django.core.mail import EmailMessage

class NombreCompleto(models.Model):
    id_nombre_completo = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=150)
    apellido = models.CharField(max_length=150)
    segundo_apellido = models.CharField(max_length=150, blank=True, null=True)

    class Meta:
        db_table = 'nombre_completo'

class AreaEspecialidad(models.Model):
    id_area_especialidad = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=128, blank=True, null=True)

    class Meta:
        db_table = 'area_especialidad'

class Universidad(models.Model):
    id_universidad = models.AutoField(primary_key=True)
    pais = models.CharField(max_length=64)
    nombre = models.CharField(max_length=255)

    class Meta:
        db_table = 'universidad'
        unique_together = (('pais', 'nombre'),)

def cambiar_nombre_archivo(instance, filename):
    _, extension = os.path.splitext(filename)
    user_id = instance.cedula
    nuevo_nombre = f"{user_id}{extension}"
    ruta_nuevo_archivo = os.path.join('media',nuevo_nombre)

    # Renombrar el archivo en el sistema de archivos
    os.rename(instance.foto.path, ruta_nuevo_archivo)

    # Actualizar el campo 'foto' en la instancia del modelo
    instance.foto.name = f'pfp/{nuevo_nombre}'  # Modificamos solo el nombre del archivo, no su contenido

    return ruta_nuevo_archivo

class Academico(models.Model):
    id_academico = models.AutoField(primary_key=True)
    cedula = models.CharField(max_length=20, unique=True)
    foto = models.FileField(upload_to='media/fotos/', blank=True, null=True)
    sitio_web = models.CharField(max_length=255, blank=True, null=True)
    grado_maximo = models.CharField(max_length=128)
    correo = models.CharField(max_length=64)
    correo_secundario = models.CharField(max_length=64, blank=True, null=True)
    unidad_base = models.CharField(max_length=64)
    categoria_en_regimen = models.CharField(max_length=45)
    pais_procedencia = models.CharField(max_length=45)
    id_nombre_completo_fk = models.ForeignKey(NombreCompleto, on_delete=models.CASCADE, db_column='id_nombre_completo_fk')
    id_area_especialidad_fk = models.ForeignKey(AreaEspecialidad, on_delete=models.CASCADE, db_column='id_area_especialidad_fk')
    id_area_especialidad_secundaria_fk = models.ForeignKey(AreaEspecialidad, on_delete=models.CASCADE, db_column='id_area_especialidad_secundaria_fk', related_name='academicos_secundarios', blank=True, null=True)
    universidad_fk = models.ForeignKey(Universidad, on_delete=models.DO_NOTHING, db_column='universidad_fk')

    class Meta:
        db_table = 'academico'

    def delete(self, *args, **kwargs):
        self.id_nombre_completo_fk.delete()
        self.id_area_especialidad_fk.delete()
        self.id_area_especialidad_secundaria_fk.delete()
        super().delete(*args, **kwargs)

def imagen_asociada_delete(sender, instance, **kwargs):
    instance.foto.delete(save=False)
pre_delete.connect(imagen_asociada_delete, sender=Academico)

def imagen_asociada_sustituir(sender, instance, **kwargs):
    try:
        obj = sender.objects.get(pk=instance.pk)
    except sender.DoesNotExist:
        return

    if obj.foto != instance.foto:
        obj.foto.delete(save=False)

pre_save.connect(imagen_asociada_sustituir, sender=Academico)

logger = logging.getLogger(__name__) # Ayuda a ver los errores en los logs del back

def correo_academicos(asunto, instance, destinatario):
    def enviar():
        try:
            context = {
                'nombre_completo': f"{instance.id_nombre_completo_fk.nombre} {instance.id_nombre_completo_fk.apellido} {instance.id_nombre_completo_fk.segundo_apellido}",
                'cedula': instance.cedula,
                'correo': instance.correo,
                'correo_secundario': instance.correo_secundario or 'No proporcionado',
                'sitio_web': instance.sitio_web or 'No proporcionado',
                'pais_procedencia': instance.pais_procedencia,
                'grado_maximo': instance.grado_maximo,
                'categoria_en_regimen': instance.categoria_en_regimen,
                'unidad_base': instance.unidad_base,
                'area_especialidad': instance.id_area_especialidad_fk.nombre,
                'areas_especialidad_secundarias': instance.id_area_especialidad_secundaria_fk.nombre or 'No proporcionado',
                'universidad': f"{instance.universidad_fk.nombre} - {instance.universidad_fk.pais}",
                'telefonos': [telefono.numero_tel for telefono in instance.telefono_set.all()] if instance.telefono_set.exists() else ['No hay teléfonos registrados'],
                'titulos': [f"{titulo.grado}, {titulo.detalle}, {titulo.institución} ({titulo.anio})" for titulo in instance.titulos_set.all()],
            }

            mensaje_html = render_to_string('email_academicos.html', context)

            correo = EmailMessage(
                subject=asunto,
                body=mensaje_html,
                from_email=settings.EMAIL_HOST_USER,
                to=[destinatario],
            )
            correo.content_subtype = 'html'
            correo.send()
        except Exception as e:
            print("error")
            logger.error(f"Error al enviar el correo: {e}")

    Thread(target=enviar).start()

@receiver(post_save, sender=Academico)
def academico_post_save(sender, instance, created, **kwargs):
    asunto = f"Creación de Académico {instance.id_nombre_completo_fk.nombre} {instance.id_nombre_completo_fk.apellido} {instance.id_nombre_completo_fk.segundo_apellido}" if created else f"Actualización de Académico {instance.id_nombre_completo_fk.nombre} {instance.id_nombre_completo_fk.apellido} {instance.id_nombre_completo_fk.segundo_apellido}"
    correo_academicos(asunto, instance, settings.EMAIL_DEFAULT_SENDER)

@receiver(pre_delete, sender=Academico)
def academico_pre_delete(sender, instance, **kwargs):
    asunto = f"Eliminación de Académico {instance.id_nombre_completo_fk.nombre} {instance.id_nombre_completo_fk.apellido} {instance.id_nombre_completo_fk.segundo_apellido}"
    correo_academicos(asunto, instance, settings.EMAIL_DEFAULT_SENDER)

class Telefono(models.Model):
    id_telefono = models.AutoField(primary_key=True)
    numero_tel = models.CharField(max_length=45, unique=True) # para evitar que varios academicos tengan el mismo numeor de telefono
    id_academico_fk = models.ForeignKey(Academico, on_delete=models.CASCADE, db_column='id_academico_fk')

    class Meta:
        db_table = 'telefono'

class Titulos(models.Model):
    id_titulos = models.AutoField(primary_key=True)
    anio = models.IntegerField( validators=[ MaxValueValidator(datetime.date.today().year), MinValueValidator(1930) ] ) # para evitar que pongan una fecha a futuro o una fecha muy al pasado
    grado = models.CharField(max_length=64)
    detalle = models.CharField(max_length=80)
    institución = models.CharField(max_length=255)
    id_academico_fk =  models.ForeignKey(Academico, on_delete=models.CASCADE, db_column='id_academico_fk')

    class Meta:
        db_table = 'titulos'
        unique_together = (('grado', 'id_academico_fk','detalle','institución','anio'),) # Para evitar que un academico tenga un mismo titulo 2 veces

class Evaluador(models.Model):
    id_evaluador = models.AutoField(primary_key=True)
    tipo = models.CharField(max_length=45)
    correo = models.CharField(max_length=45)
    universidad_fk = models.ForeignKey(Universidad, on_delete=models.PROTECT, db_column='universidad_fk')
    id_area_especialidad_fk = models.ForeignKey(AreaEspecialidad, on_delete=models.PROTECT, db_column='id_area_especialidad_fk')
    id_nombre_completo_fk = models.ForeignKey(NombreCompleto, on_delete=models.PROTECT, db_column='id_nombre_completo_fk')

    class Meta:
        db_table = 'evaluador'
        unique_together = (('tipo', 'correo','universidad_fk','id_area_especialidad_fk','id_nombre_completo_fk'),) # Para evitar que un mismo evaluador este 2 veces
    
logger = logging.getLogger(__name__)

def correo_evaluadores(asunto, instance, destinatario):
    def enviar():
        try:
            context = {
                'nombre_completo': f"{instance.id_nombre_completo_fk.nombre} {instance.id_nombre_completo_fk.apellido} {instance.id_nombre_completo_fk.segundo_apellido}",
                'correo': instance.correo,
                'tipo': instance.tipo,
                'universidad': f"{instance.universidad_fk.nombre} - {instance.universidad_fk.pais}",
                'area_especialidad': instance.id_area_especialidad_fk.nombre,
                'id_evaluador': instance.id_evaluador
            }

            mensaje_html = render_to_string('email_evaluadores.html', context)

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

@receiver(post_save, sender=Evaluador)
def evaluador_post_save(sender, instance, created, **kwargs):
    asunto = f"Creación de Evaluador {instance.id_nombre_completo_fk.nombre} {instance.id_nombre_completo_fk.apellido} {instance.id_nombre_completo_fk.segundo_apellido}" if created else f"Actualización de Evaluador {instance.id_nombre_completo_fk.nombre} {instance.id_nombre_completo_fk.apellido} {instance.id_nombre_completo_fk.segundo_apellido}"
    correo_evaluadores(asunto, instance, settings.EMAIL_DEFAULT_SENDER) 

@receiver(pre_delete, sender=Evaluador)
def evaluador_pre_delete(sender, instance, **kwargs):
    asunto = f"Eliminación de Evaluador {instance.id_nombre_completo_fk.nombre} {instance.id_nombre_completo_fk.apellido} {instance.id_nombre_completo_fk.segundo_apellido}"
    correo_evaluadores(asunto, instance, settings.EMAIL_DEFAULT_SENDER)



class Asistente(models.Model):
    id_asistente_carnet = models.AutoField(primary_key=True)
    cedula = models.CharField(max_length=45)
    condicion_estudiante = models.CharField(max_length=45)
    id_nombre_completo_fk = models.ForeignKey(NombreCompleto, on_delete=models.CASCADE, db_column='id_nombre_completo_fk')
    carrera = models.CharField(max_length=128)
    promedio_ponderado = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        db_table = 'asistente'

class Autor(models.Model):
    id_autor = models.AutoField(primary_key=True)
    id_nombre_completo_fk = models.ForeignKey(NombreCompleto, on_delete=models.CASCADE, db_column='id_nombre_completo_fk')

    class Meta:
        db_table = 'autor'

class Institucion(models.Model):
    id_institucion = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=150)

    class Meta:
        db_table = 'institucion'

class PersonaExterna(models.Model):
    id_persona_externa = models.AutoField(primary_key=True)
    correo = models.CharField(max_length=45)
    telefono = models.CharField(max_length=45)
    unidad = models.CharField(max_length=45, blank=True, null=True)
    id_nombre_completo_fk = models.ForeignKey(NombreCompleto, on_delete=models.PROTECT, db_column='id_nombre_completo_fk')
    id_institucion_fk = models.ForeignKey(Institucion, on_delete=models.PROTECT, db_column='id_institucion_fk')

    class Meta:
        db_table = 'persona_externa'




