# Generated by Django 4.2.4 on 2024-01-09 02:41

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('version_proyecto', '0002_alter_evaluacion_id_version_proyecto_fk'),
    ]

    operations = [
        migrations.CreateModel(
            name='RespuestaEvaluacion',
            fields=[
                ('id_respuesta_evaluacion', models.AutoField(primary_key=True, serialize=False)),
                ('pregunta', models.CharField(max_length=556)),
                ('respuesta', models.CharField(max_length=556)),
                ('id_evaluacion_fk', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='version_proyecto.evaluacion')),
            ],
            options={
                'db_table': 'respuesta_evaluacion',
            },
        ),
        migrations.DeleteModel(
            name='PreguntaEvaluacion',
        ),
    ]