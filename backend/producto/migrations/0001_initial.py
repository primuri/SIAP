# Generated by Django 4.2.4 on 2023-10-10 05:15

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('version_proyecto', '0001_initial'),
        ('personas', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Area',
            fields=[
                ('id_area', models.IntegerField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=45)),
            ],
        ),
        migrations.CreateModel(
            name='Producto',
            fields=[
                ('id_producto', models.IntegerField(primary_key=True, serialize=False)),
                ('fecha', models.DateTimeField()),
                ('detalle', models.CharField(max_length=255)),
                ('id_version_proyecto', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='version_proyecto.versionproyecto')),
            ],
        ),
        migrations.CreateModel(
            name='Revista',
            fields=[
                ('id_revista', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=45)),
                ('pais', models.CharField(max_length=45)),
            ],
        ),
        migrations.CreateModel(
            name='Software',
            fields=[
                ('id_software', models.IntegerField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=150)),
                ('version', models.CharField(max_length=45)),
                ('id_documento_documentacion_fk', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='version_proyecto.documento')),
                ('id_producto_fk', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='producto.producto')),
            ],
        ),
        migrations.CreateModel(
            name='Evento',
            fields=[
                ('id_evento', models.IntegerField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=150)),
                ('resumen', models.CharField(max_length=255)),
                ('pais', models.CharField(max_length=150)),
                ('tipo_participacion', models.CharField(max_length=10)),
                ('enlace', models.CharField(max_length=1024, null=True)),
                ('id_area_fk', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='producto.area')),
                ('id_institucion_fk', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='personas.institucion')),
                ('id_oficio_fk', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='version_proyecto.oficio')),
                ('id_producto_fk', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='producto.producto')),
            ],
        ),
        migrations.CreateModel(
            name='Articulo',
            fields=[
                ('id_articulo', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=150)),
                ('fecha_publicacion', models.DateTimeField()),
                ('tipo', models.CharField(max_length=45)),
                ('doi', models.CharField(max_length=45)),
                ('isbn', models.CharField(max_length=45)),
                ('cant_paginas', models.IntegerField()),
                ('id_autor_fk', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='personas.autor')),
                ('id_documento_articulo_fk', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='version_proyecto.documento')),
                ('id_producto_fk', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='producto.producto')),
                ('id_revista_fk', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='producto.revista')),
            ],
        ),
    ]
