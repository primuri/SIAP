from django.db import models
from personas.models import Autor, Institucion
from version_proyecto.models import Documento, Oficio, VersionProyecto

class Producto(models.Model):
    id_producto = models.IntegerField(primary_key=True)
    fecha = models.DateTimeField()
    detalle = models.CharField(max_length=255)
    id_version_proyecto = models.ForeignKey(VersionProyecto, on_delete=models.PROTECT)

class Revista(models.Model):
    id_revista = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=45)
    pais = models.CharField(max_length=45)

class Articulo(models.Model):
    id_articulo = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=150)
    fecha_publicacion = models.DateTimeField()
    tipo = models.CharField(max_length=45)
    doi = models.CharField(max_length=45)
    isbn = models.CharField(max_length=45)
    cant_paginas = models.IntegerField()
    id_revista_fk = models.ForeignKey(Revista, on_delete=models.PROTECT)
    id_producto_fk = models.ForeignKey(Producto, on_delete=models.PROTECT)
    id_autor_fk = models.ForeignKey(Autor, on_delete=models.PROTECT)
    id_documento_articulo_fk = models.ForeignKey(Documento, on_delete=models.PROTECT)

class Area(models.Model):
    id_area = models.IntegerField(primary_key=True)
    nombre = models.CharField(max_length=45)

class Evento(models.Model):
    id_evento = models.IntegerField(primary_key=True)
    nombre = models.CharField(max_length=150)
    resumen = models.CharField(max_length=255)
    pais = models.CharField(max_length=150)
    tipo_participacion = models.CharField(max_length=10)
    enlace = models.CharField(max_length=1024, null=True)
    id_producto_fk = models.ForeignKey(Producto, on_delete=models.PROTECT)
    id_institucion_fk = models.ForeignKey(Institucion, on_delete=models.PROTECT)  
    id_area_fk = models.ForeignKey(Area, on_delete=models.PROTECT)
    id_oficio_fk = models.ForeignKey(Oficio, on_delete=models.PROTECT)

class Software(models.Model):
    id_software = models.IntegerField(primary_key=True)
    nombre = models.CharField(max_length=150)
    version = models.CharField(max_length=45)
    id_producto_fk = models.ForeignKey(Producto, on_delete=models.PROTECT)
    id_documento_documentacion_fk = models.ForeignKey(Documento, on_delete=models.PROTECT)
