# Generated by Django 4.2 on 2023-10-29 06:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("producto", "0010_articulo_observaciones"),
    ]

    operations = [
        migrations.AlterField(
            model_name="articulo",
            name="observaciones",
            field=models.CharField(max_length=500, null=True),
        ),
    ]
