# Generated by Django 4.2.4 on 2023-10-10 05:15

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Academico',
            fields=[
                ('id_academico', models.AutoField(primary_key=True, serialize=False)),
                ('cedula', models.CharField(max_length=20, unique=True)),
                ('foto', models.FileField(blank=True, null=True, upload_to='media/pfp')),
                ('sitio_web', models.CharField(blank=True, max_length=255, null=True)),
                ('grado_maximo', models.CharField(max_length=128)),
                ('correo', models.CharField(max_length=64)),
                ('correo_secundario', models.CharField(blank=True, max_length=64, null=True)),
                ('unidad_base', models.CharField(max_length=64)),
                ('categoria_en_regimen', models.CharField(max_length=45)),
                ('pais_procedencia', models.CharField(max_length=45)),
            ],
            options={
                'db_table': 'academico',
            },
        ),
        migrations.CreateModel(
            name='AreaEspecialidad',
            fields=[
                ('id_area_especialidad', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(blank=True, max_length=128, null=True)),
            ],
            options={
                'db_table': 'area_especialidad',
            },
        ),
        migrations.CreateModel(
            name='Institucion',
            fields=[
                ('id_institucion', models.IntegerField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=150)),
            ],
            options={
                'db_table': 'institucion',
            },
        ),
        migrations.CreateModel(
            name='NombreCompleto',
            fields=[
                ('id_nombre_completo', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=150)),
                ('apellido', models.CharField(max_length=150)),
                ('segundo_apellido', models.CharField(blank=True, max_length=150, null=True)),
            ],
            options={
                'db_table': 'nombre_completo',
            },
        ),
        migrations.CreateModel(
            name='Universidad',
            fields=[
                ('id_universidad', models.AutoField(primary_key=True, serialize=False)),
                ('pais', models.CharField(max_length=64)),
                ('nombre', models.CharField(max_length=255)),
            ],
            options={
                'db_table': 'universidad',
                'unique_together': {('pais', 'nombre')},
            },
        ),
        migrations.CreateModel(
            name='Telefono',
            fields=[
                ('id_telefono', models.AutoField(primary_key=True, serialize=False)),
                ('numero_tel', models.CharField(max_length=45, unique=True)),
                ('id_academico_fk', models.ForeignKey(db_column='id_academico_fk', on_delete=django.db.models.deletion.CASCADE, to='personas.academico')),
            ],
            options={
                'db_table': 'telefono',
            },
        ),
        migrations.CreateModel(
            name='PersonaExterna',
            fields=[
                ('id_persona_externa', models.AutoField(primary_key=True, serialize=False)),
                ('correo', models.CharField(max_length=45)),
                ('telefono', models.CharField(max_length=45)),
                ('unidad', models.CharField(blank=True, max_length=45, null=True)),
                ('id_institucion_fk', models.ForeignKey(db_column='id_institucion_fk', on_delete=django.db.models.deletion.PROTECT, to='personas.institucion')),
                ('id_nombre_completo_fk', models.ForeignKey(db_column='id_nombre_completo_fk', on_delete=django.db.models.deletion.PROTECT, to='personas.nombrecompleto')),
            ],
            options={
                'db_table': 'persona_externa',
            },
        ),
        migrations.CreateModel(
            name='Autor',
            fields=[
                ('id_autor', models.AutoField(primary_key=True, serialize=False)),
                ('id_nombre_completo_fk', models.ForeignKey(db_column='id_nombre_completo_fk', on_delete=django.db.models.deletion.PROTECT, to='personas.nombrecompleto')),
            ],
            options={
                'db_table': 'autor',
            },
        ),
        migrations.CreateModel(
            name='Asistente',
            fields=[
                ('id_asistente_carnet', models.CharField(max_length=10, primary_key=True, serialize=False)),
                ('cedula', models.CharField(max_length=45)),
                ('condicion_estudiante', models.CharField(max_length=45)),
                ('carrera', models.CharField(max_length=128)),
                ('promedio_ponderado', models.DecimalField(decimal_places=2, max_digits=5)),
                ('id_nombre_completo_fk', models.ForeignKey(db_column='id_nombre_completo_fk', on_delete=django.db.models.deletion.PROTECT, to='personas.nombrecompleto')),
            ],
            options={
                'db_table': 'asistente',
            },
        ),
        migrations.AddField(
            model_name='academico',
            name='id_area_especialidad_fk',
            field=models.ForeignKey(db_column='id_area_especialidad_fk', on_delete=django.db.models.deletion.CASCADE, to='personas.areaespecialidad'),
        ),
        migrations.AddField(
            model_name='academico',
            name='id_area_especialidad_secundaria_fk',
            field=models.ForeignKey(blank=True, db_column='id_area_especialidad_secundaria_fk', null=True, on_delete=django.db.models.deletion.CASCADE, related_name='academicos_secundarios', to='personas.areaespecialidad'),
        ),
        migrations.AddField(
            model_name='academico',
            name='id_nombre_completo_fk',
            field=models.ForeignKey(db_column='id_nombre_completo_fk', on_delete=django.db.models.deletion.CASCADE, to='personas.nombrecompleto'),
        ),
        migrations.AddField(
            model_name='academico',
            name='universidad_fk',
            field=models.ForeignKey(db_column='universidad_fk', on_delete=django.db.models.deletion.DO_NOTHING, to='personas.universidad'),
        ),
        migrations.CreateModel(
            name='Titulos',
            fields=[
                ('id_titulos', models.AutoField(primary_key=True, serialize=False)),
                ('anio', models.IntegerField(validators=[django.core.validators.MaxValueValidator(2023), django.core.validators.MinValueValidator(1930)])),
                ('grado', models.CharField(max_length=64)),
                ('detalle', models.CharField(max_length=80)),
                ('institución', models.CharField(max_length=255)),
                ('id_academico_fk', models.ForeignKey(db_column='id_academico_fk', on_delete=django.db.models.deletion.CASCADE, to='personas.academico')),
            ],
            options={
                'db_table': 'titulos',
                'unique_together': {('grado', 'id_academico_fk', 'detalle', 'institución', 'anio')},
            },
        ),
        migrations.CreateModel(
            name='Evaluador',
            fields=[
                ('id_evaluador', models.AutoField(primary_key=True, serialize=False)),
                ('tipo', models.CharField(max_length=45)),
                ('correo', models.CharField(max_length=45)),
                ('id_area_especialidad_fk', models.ForeignKey(db_column='id_area_especialidad_fk', on_delete=django.db.models.deletion.PROTECT, to='personas.areaespecialidad')),
                ('id_nombre_completo_fk', models.ForeignKey(db_column='id_nombre_completo_fk', on_delete=django.db.models.deletion.PROTECT, to='personas.nombrecompleto')),
                ('universidad_fk', models.ForeignKey(db_column='universidad_fk', on_delete=django.db.models.deletion.PROTECT, to='personas.universidad')),
            ],
            options={
                'db_table': 'evaluador',
                'unique_together': {('tipo', 'correo', 'universidad_fk', 'id_area_especialidad_fk', 'id_nombre_completo_fk')},
            },
        ),
    ]
