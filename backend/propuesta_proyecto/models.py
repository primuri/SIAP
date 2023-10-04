from django.db import models
from personas.models import Academico
import os

class Vigencia(models.Model):
    id_vigencia = models.AutoField(primary_key=True)
    fecha_inicio = models.DateTimeField()
    fecha_fin = models.DateTimeField()

    class Meta:
        db_table = 'vigencia'

class ColaboradorPrincipal(models.Model):
    id_colaborador_principal = models.AutoField(primary_key=True)
    tipo = models.CharField(max_length=80)
    carga = models.CharField(max_length=80)
    estado = models.CharField(max_length=45)
    id_vigencia_fk = models.ForeignKey(Vigencia, on_delete=models.PROTECT, db_column='id_vigencia_fk')
    id_academico_fk = models.ForeignKey(Academico, on_delete=models.PROTECT, db_column='id_academico_fk')

    class Meta:
        db_table = 'colaborador_principal'

class PropuestaProyecto(models.Model):
    id_codigo_cimpa = models.CharField(max_length=45, primary_key=True)
    detalle = models.CharField(max_length=255)
    estado = models.CharField(max_length=45)
    nombre = models.CharField(max_length=360)
    descripcion = models.CharField(max_length=1024)
    fecha_vigencia = models.DateTimeField()
    actividad = models.CharField(max_length=128)
    id_colaborador_principal_fk = models.ForeignKey(ColaboradorPrincipal, on_delete=models.PROTECT, db_column='id_colaborador_principal_fk')

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