# Generated by Django 4.2.4 on 2023-10-01 20:52

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('personas', '0003_alter_universidad_unique_together_and_more'),
        ('usuario_personalizado', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='usuario',
            name='academico_fk',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='personas.academico'),
        ),
        migrations.AddField(
            model_name='usuario',
            name='evaluador_fk',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='personas.evaluador'),
        ),
    ]
