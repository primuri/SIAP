# Generated by Django 4.2.4 on 2023-09-26 21:46

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('personas', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ColaboradorPrincipal',
            fields=[
                ('id_colaborador_principal', models.AutoField(primary_key=True, serialize=False)),
                ('tipo', models.CharField(max_length=80)),
                ('carga', models.CharField(max_length=80)),
                ('estado', models.CharField(max_length=45)),
                ('id_academico_fk', models.ForeignKey(db_column='id_academico_fk', on_delete=django.db.models.deletion.PROTECT, to='personas.academico')),
            ],
            options={
                'db_table': 'colaborador_principal',
            },
        ),
        migrations.CreateModel(
            name='Vigencia',
            fields=[
                ('id_vigencia', models.AutoField(primary_key=True, serialize=False)),
                ('fecha_inicio', models.DateTimeField()),
                ('fecha_fin', models.DateTimeField()),
            ],
            options={
                'db_table': 'vigencia',
            },
        ),
        migrations.CreateModel(
            name='PropuestaProyecto',
            fields=[
                ('id_codigo_cimpa', models.CharField(max_length=45, primary_key=True, serialize=False)),
                ('detalle', models.CharField(max_length=255)),
                ('estado', models.CharField(max_length=45)),
                ('nombre', models.CharField(max_length=360)),
                ('descripcion', models.CharField(max_length=1024)),
                ('fecha_vigencia', models.DateTimeField()),
                ('actividad', models.CharField(max_length=128)),
                ('id_colaborador_principal_fk', models.ForeignKey(db_column='id_colaborador_principal_fk', on_delete=django.db.models.deletion.PROTECT, to='propuesta_proyecto.colaboradorprincipal')),
            ],
            options={
                'db_table': 'propuesta_proyecto',
            },
        ),
        migrations.AddField(
            model_name='colaboradorprincipal',
            name='id_vigencia_fk',
            field=models.ForeignKey(db_column='id_vigencia_fk', on_delete=django.db.models.deletion.PROTECT, to='propuesta_proyecto.vigencia'),
        ),
        migrations.CreateModel(
            name='DocumentoAsociado',
            fields=[
                ('id_documentos_asociados', models.AutoField(primary_key=True, serialize=False)),
                ('detalle', models.CharField(max_length=255)),
                ('documento', models.CharField(max_length=1024)),
                ('id_codigo_cimpa_fk', models.ForeignKey(db_column='id_codigo_cimpa_fk', on_delete=django.db.models.deletion.PROTECT, to='propuesta_proyecto.propuestaproyecto')),
            ],
            options={
                'db_table': 'documento_asociado',
                'unique_together': {('documento', 'id_codigo_cimpa_fk')},
            },
        ),
    ]
