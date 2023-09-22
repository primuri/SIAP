from django.db import models
from version_proyecto.models import VersionProyecto
from version_proyecto.models import EvaluacionCC
from version_proyecto.models import Oficio
from version_proyecto.models import Documento

class Informe(models.Model):
    id_informe = models.IntegerField(primary_key=True)
    estado = models.CharField(max_length=64)
    tipo = models.CharField(max_length=45)
    fecha_presentacion = models.DateTimeField()
    fecha_debe_presentar = models.DateTimeField()
    id_version_proyecto_fk = models.ForeignKey(VersionProyecto, on_delete=models.PROTECT)

class VersionInforme(models.Model):
    id_version_informe = models.AutoField(primary_key=True)
    numero_version = models.CharField(max_length=45)
    fecha_presentacion = models.DateTimeField()
    id_informe_fk = models.ForeignKey(Informe, on_delete=models.PROTECT)
    id_evaluacion_cc_fk = models.ForeignKey(EvaluacionCC, on_delete=models.PROTECT)
    id_oficio_fk = models.ForeignKey(Oficio, on_delete=models.PROTECT)
    id_documento_informe_fk = models.ForeignKey(Documento, on_delete=models.PROTECT)

class Accion(models.Model):
    id_accion = models.AutoField(primary_key=True)
    fecha = models.DateTimeField()
    origen = models.CharField(max_length=192)
    destino = models.CharField(max_length=192)
    estado = models.CharField(max_length=155)
    id_version_informe_fk = models.ForeignKey(VersionInforme, on_delete=models.PROTECT)
    id_documento_accion_fk = models.ForeignKey(Documento, on_delete=models.PROTECT)
