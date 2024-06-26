# Generated by Django 4.2.4 on 2023-10-10 05:15

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('propuesta_proyecto', '0001_initial'),
        ('personas', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Documento',
            fields=[
                ('id_documento', models.AutoField(primary_key=True, serialize=False)),
                ('tipo', models.CharField(max_length=45)),
                ('detalle', models.CharField(max_length=360, null=True)),
                ('ruta_archivo', models.CharField(max_length=1024)),
            ],
            options={
                'db_table': 'documento',
            },
        ),
        migrations.CreateModel(
            name='Evaluacion',
            fields=[
                ('id_evaluacion', models.AutoField(primary_key=True, serialize=False)),
                ('detalle', models.CharField(max_length=128)),
                ('id_version_proyecto_fk', models.IntegerField()),
                ('id_documento_evualuacion_fk', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='version_proyecto.documento')),
                ('id_evaluador_fk', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='personas.evaluador')),
            ],
            options={
                'db_table': 'evaluacion',
            },
        ),
        migrations.CreateModel(
            name='EvaluacionCC',
            fields=[
                ('id_evaluacion_cc', models.AutoField(primary_key=True, serialize=False)),
                ('detalle', models.CharField(max_length=50)),
                ('id_documento_evualuacion_fk', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='version_proyecto.documento')),
            ],
            options={
                'db_table': 'evaluacion_cc',
            },
        ),
        migrations.CreateModel(
            name='Oficio',
            fields=[
                ('id_oficio', models.AutoField(primary_key=True, serialize=False)),
                ('ruta_archivo', models.CharField(max_length=1024)),
                ('detalle', models.CharField(max_length=456, null=True)),
            ],
            options={
                'db_table': 'oficio',
            },
        ),
        migrations.CreateModel(
            name='Proyecto',
            fields=[
                ('id_codigo_vi', models.CharField(max_length=45, primary_key=True, serialize=False)),
                ('id_codigo_cimpa_fk', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='propuesta_proyecto.propuestaproyecto')),
            ],
            options={
                'db_table': 'proyecto',
            },
        ),
        migrations.CreateModel(
            name='VersionProyecto',
            fields=[
                ('id_version_proyecto', models.AutoField(primary_key=True, serialize=False)),
                ('detalle', models.CharField(max_length=255)),
                ('numero_version', models.IntegerField()),
                ('id_codigo_vi_fk', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='version_proyecto.proyecto')),
                ('id_evaluacion_cc_fk', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='version_proyecto.evaluacioncc')),
                ('id_oficio_fk', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='version_proyecto.oficio')),
                ('id_vigencia_fk', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='propuesta_proyecto.vigencia')),
            ],
            options={
                'db_table': 'version_proyecto',
            },
        ),
        migrations.CreateModel(
            name='PreguntaEvaluacionCC',
            fields=[
                ('id_pregunta_evaluacion_cc', models.AutoField(primary_key=True, serialize=False)),
                ('pregunta', models.CharField(max_length=556)),
                ('respuesta', models.CharField(max_length=128)),
                ('id_evaluacion_cc_fk', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='version_proyecto.evaluacioncc')),
            ],
            options={
                'db_table': 'pregunta_evaluacion_cc',
            },
        ),
        migrations.CreateModel(
            name='PreguntaEvaluacion',
            fields=[
                ('id_pregunta_evaluacion', models.AutoField(primary_key=True, serialize=False)),
                ('pregunta', models.CharField(max_length=556)),
                ('respuesta', models.CharField(max_length=128)),
                ('id_evaluacion_fk', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='version_proyecto.evaluacion')),
            ],
            options={
                'db_table': 'pregunta_evaluacion',
            },
        ),
        migrations.CreateModel(
            name='ColaboradorSecundario',
            fields=[
                ('id_colaborador_secundario', models.AutoField(primary_key=True, serialize=False)),
                ('tipo', models.CharField(max_length=50)),
                ('carga', models.CharField(max_length=80)),
                ('estado', models.CharField(max_length=45)),
                ('id_academico_fk', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='personas.academico')),
                ('id_version_proyecto_fk', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='version_proyecto.versionproyecto')),
                ('id_vigencia_fk', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='propuesta_proyecto.vigencia')),
            ],
            options={
                'db_table': 'colaborador_secundario',
            },
        ),
        migrations.CreateModel(
            name='DesignacionAsistente',
            fields=[
                ('id_designacion_asistente', models.AutoField(primary_key=True, serialize=False)),
                ('cantidad_horas', models.DecimalField(decimal_places=2, max_digits=5)),
                ('consecutivo', models.CharField(max_length=45)),
                ('id_asistente_carnet_fk', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='designaciones_asistente', to='personas.asistente')),
                ('id_documento_inopia_fk', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='version_proyecto.documento')),
                ('id_version_proyecto_fk', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='designaciones_asistente', to='version_proyecto.versionproyecto')),
            ],
            options={
                'db_table': 'designacion_asistente',
                'unique_together': {('id_version_proyecto_fk', 'id_asistente_carnet_fk')},
            },
        ),
        migrations.AddConstraint(
            model_name='colaboradorsecundario',
            constraint=models.UniqueConstraint(fields=('id_academico_fk', 'id_version_proyecto_fk'), name='unique_academico_proyecto'),
        ),
    ]
