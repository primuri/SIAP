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