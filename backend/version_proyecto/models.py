from django.db import models
from propuesta_proyecto.models import PropuestaProyecto, Vigencia
from personas.models import Evaluador, Asistente, Academico

class Proyecto(models.Model):
    id_codigo_vi = models.CharField(max_length=45, primary_key=True)
    id_codigo_cimpa_fk = models.ForeignKey(PropuestaProyecto, on_delete=models.PROTECT)

    class Meta:
        db_table = 'proyecto'

class Oficio(models.Model):
    id_oficio = models.AutoField(primary_key=True)
    ruta_archivo = models.CharField(max_length=1024)
    detalle = models.CharField(max_length=456, null=True)

    class Meta:
        db_table = 'oficio'

class Documento(models.Model):
    id_documento = models.AutoField(primary_key=True)
    tipo = models.CharField(max_length=45)
    detalle = models.CharField(max_length=360, null=True)
    ruta_archivo = models.CharField(max_length=1024)

    class Meta:
        db_table = 'documento'

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

class Evaluacion(models.Model):
    id_evaluacion = models.AutoField(primary_key=True)
    detalle = models.CharField(max_length=128)
    id_version_proyecto_fk = models.IntegerField()
    id_evaluador_fk = models.ForeignKey(Evaluador, on_delete=models.PROTECT)
    id_documento_evualuacion_fk = models.ForeignKey(Documento, on_delete=models.PROTECT)

    class Meta:
        db_table = 'evaluacion'

class PreguntaEvaluacion(models.Model):
    id_pregunta_evaluacion = models.AutoField(primary_key=True)
    pregunta = models.CharField(max_length=556)
    respuesta = models.CharField(max_length=128)
    id_evaluacion_fk = models.ForeignKey(Evaluacion, on_delete=models.PROTECT)

    class Meta:
        db_table = 'pregunta_evaluacion'

class VersionProyecto(models.Model):
    id_version_proyecto = models.AutoField(primary_key=True)
    detalle = models.CharField(max_length=255)
    numero_version = models.IntegerField()
    id_oficio_fk = models.ForeignKey(Oficio, on_delete=models.PROTECT)
    id_vigencia_fk = models.ForeignKey(Vigencia, on_delete=models.PROTECT)
    id_evaluacion_cc_fk = models.ForeignKey(EvaluacionCC, on_delete=models.PROTECT)
    id_codigo_vi_fk = models.ForeignKey(Proyecto, on_delete=models.PROTECT)

    class Meta:
        db_table = 'version_proyecto'

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

from django.db import models

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