from django.db import models, transaction
from datetime import datetime
from personas.models import Academico
from django.db.models.signals import pre_delete
from django.db.models.signals import pre_save


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
    id_vigencia_fk = models.ForeignKey(Vigencia, on_delete=models.PROTECT, db_column='id_vigencia_fk',  blank=True, null=True)
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
    id_colaborador_principal_fk = models.ForeignKey(ColaboradorPrincipal, on_delete=models.PROTECT, db_column='id_colaborador_principal_fk')

    def save(self, *args, **kwargs):
        # Utiliza una transacción para garantizar la consistencia
        with transaction.atomic():
            year = datetime.now().year
            # Encuentra el máximo id_codigo_cimpa para el año actual
            max_id = PropuestaProyecto.objects.filter(id_codigo_cimpa__contains=str(year)).aggregate(max_id=models.Max('id_codigo_cimpa'))['max_id']
            # Si no hay registros para el año actual, inicia desde 1
            if max_id is None:
                max_id = 0
            else:
                # Extrae la parte antes del guión y convierte en int
                max_id = int(max_id.split('-')[0])
            # Genera el nuevo id_codigo_cimpa
            max_id += 1
            self.id_codigo_cimpa = f'{max_id}-{year}'
            super().save(*args, **kwargs)

    class Meta:
        db_table = 'propuesta_proyecto'

class DocumentoAsociado(models.Model):
    id_documentos_asociados = models.AutoField(primary_key=True)
    detalle = models.CharField(max_length=255)
    documento = models.FileField(upload_to='media/')  # Se cambió de char a file
    id_codigo_cimpa_fk = models.ForeignKey(PropuestaProyecto, on_delete=models.PROTECT, db_column='id_codigo_cimpa_fk')

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