# Generated by Django 4.2.4 on 2024-04-25 22:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('version_proyecto', '0010_alter_evaluacioncc_id_documento_evualuacion_fk'),
    ]

    operations = [
        migrations.AlterField(
            model_name='documento',
            name='documento',
            field=models.FileField(blank=True, max_length=500, null=True, upload_to='media/documentos/'),
        ),
    ]