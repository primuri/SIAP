# Generated by Django 4.2.4 on 2023-10-07 17:37

from django.db import migrations, models
import personas.models


class Migration(migrations.Migration):

    dependencies = [
        ('personas', '0002_alter_nombrecompleto_segundo_apellido'),
    ]

    operations = [
        migrations.RenameField(
            model_name='academico',
            old_name='area_de_trabajo',
            new_name='unidad_base',
        ),
        migrations.AddField(
            model_name='academico',
            name='correo_secundario',
            field=models.CharField(blank=True, max_length=64, null=True),
        ),
        migrations.AlterField(
            model_name='academico',
            name='foto',
            field=models.FileField(blank=True, null=True, upload_to=personas.models.cambiar_nombre_archivo),
        ),
    ]
