from django.db import models
from personas.models import Academico, PersonaExterna, NombreCompleto
from version_proyecto.models import Documento, Oficio, Vigencia

class OrganoColegiado(models.Model):
    id_organo_colegiado = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=128)
    numero_miembros = models.IntegerField()
    quorum = models.IntegerField()
    acuerdo_firme = models.IntegerField()

    class Meta:
        db_table = 'organo_colegiado'

class Integrante(models.Model):
    id_organo_colegiado_fk = models.ForeignKey(OrganoColegiado, on_delete=models.PROTECT)
    id_academico_fk = models.ForeignKey(Academico, on_delete=models.PROTECT)
    id_oficio_nombramiento_fk = models.ForeignKey(Oficio, on_delete=models.PROTECT)
    id_vigencia_fk = models.ForeignKey(Vigencia, on_delete=models.PROTECT)
    puesto = models.CharField(max_length=120)
    normativa_reguladora = models.CharField(max_length=120)

    class Meta:
        db_table = 'integrante'
        unique_together = (('id_organo_colegiado_fk', 'id_academico_fk'),)

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
    id_documento_seguimiento_fk = models.ForeignKey(Documento, on_delete=models.PROTECT)

    class Meta:
        db_table = 'seguimiento'

class Acuerdo(models.Model):
    id_acuerdo = models.AutoField(primary_key=True)
    descripcion = models.CharField(max_length=255)
    estado = models.CharField(max_length=45)
    fecha_cumplimiento = models.DateField()
    encargado = models.CharField(max_length=150)
    id_seguimiento_fk = models.ForeignKey(Seguimiento, on_delete=models.PROTECT)
    id_oficio_fk = models.ForeignKey(Oficio, on_delete=models.PROTECT)
    id_sesion_fk = models.ForeignKey(Sesion, on_delete=models.PROTECT)
    id_documento_acuerdo_fk = models.ForeignKey(Documento, on_delete=models.PROTECT)

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