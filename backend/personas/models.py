from django.db import models

class NombreCompleto(models.Model):
    id_nombre_completo = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=150)
    apellido = models.CharField(max_length=150)
    segundo_apellido = models.CharField(max_length=150)

    class Meta:
        db_table = 'nombre_completo'

class AreaEspecialidad(models.Model):
    id_area_especialidad = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=128)

    class Meta:
        db_table = 'area_especialidad'

class Universidad(models.Model):
    id_universidad = models.AutoField(primary_key=True)
    pais = models.CharField(max_length=64)
    nombre = models.CharField(max_length=255)

    class Meta:
        db_table = 'universidad'
        unique_together = (('pais', 'nombre'),)


class Academico(models.Model):
    id_academico = models.AutoField(primary_key=True)
    cedula = models.CharField(max_length=20, unique=True)
    foto = models.BinaryField(blank=True, null=True)
    sitio_web = models.CharField(max_length=255, blank=True, null=True)
    grado_maximo = models.CharField(max_length=128)
    correo = models.CharField(max_length=64)
    area_de_trabajo = models.CharField(max_length=64)
    categoria_en_regimen = models.CharField(max_length=45)
    pais_procedencia = models.CharField(max_length=45)
    id_nombre_completo_fk = models.ForeignKey(NombreCompleto, on_delete=models.PROTECT, db_column='id_nombre_completo_fk')
    id_area_especialidad_fk = models.ForeignKey(AreaEspecialidad, on_delete=models.PROTECT, db_column='id_area_especialidad_fk')
    universidad_fk = models.ForeignKey(Universidad, on_delete=models.PROTECT, db_column='universidad_fk')

    class Meta:
        db_table = 'academico'

class Telefono(models.Model):
    id_telefono = models.AutoField(primary_key=True)
    numero_tel = models.CharField(max_length=45)
    id_academico_fk = models.ForeignKey(Academico, on_delete=models.PROTECT, db_column='id_academico_fk')

    class Meta:
        db_table = 'telefono'

class Titulos(models.Model):
    id_titulos = models.AutoField(primary_key=True)
    anio = models.IntegerField()
    grado = models.CharField(max_length=64)
    detalle = models.CharField(max_length=80)
    institución = models.CharField(max_length=255)
    id_academico_fk = models.ForeignKey(Academico, on_delete=models.PROTECT, db_column='id_academico_fk')

    class Meta:
        db_table = 'titulos'

class Evaluador(models.Model):
    id_evaluador = models.IntegerField(primary_key=True)
    tipo = models.CharField(max_length=45)
    correo = models.CharField(max_length=45)
    universidad_fk = models.ForeignKey(Universidad, on_delete=models.PROTECT, db_column='universidad_fk')
    id_area_especialidad_fk = models.ForeignKey(AreaEspecialidad, on_delete=models.PROTECT, db_column='id_area_especialidad_fk')
    id_nombre_completo_fk = models.ForeignKey(NombreCompleto, on_delete=models.PROTECT, db_column='id_nombre_completo_fk')

    class Meta:
        db_table = 'evaluador'

class Asistente(models.Model):
    id_asistente_carnet = models.CharField(max_length=10, primary_key=True)
    cedula = models.CharField(max_length=45)
    condicion_estudiante = models.CharField(max_length=45)
    id_nombre_completo_fk = models.ForeignKey(NombreCompleto, on_delete=models.PROTECT, db_column='id_nombre_completo_fk')
    carrera = models.CharField(max_length=128)
    promedio_ponderado = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        db_table = 'asistente'

class Autor(models.Model):
    id_autor = models.AutoField(primary_key=True)
    id_nombre_completo_fk = models.ForeignKey(NombreCompleto, on_delete=models.PROTECT, db_column='id_nombre_completo_fk')

    class Meta:
        db_table = 'autor'

class Institucion(models.Model):
    id_institucion = models.IntegerField(primary_key=True)
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
