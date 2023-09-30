# Generated by Django 4.2.4 on 2023-09-27 01:09

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('version_proyecto', '0001_initial'),
        ('propuesta_proyecto', '0001_initial'),
        ('personas', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Acta',
            fields=[
                ('id_acta', models.AutoField(primary_key=True, serialize=False)),
                ('id_documento_acta_fk', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='version_proyecto.documento')),
            ],
            options={
                'db_table': 'acta',
            },
        ),
        migrations.CreateModel(
            name='Agenda',
            fields=[
                ('id_agenda', models.AutoField(primary_key=True, serialize=False)),
                ('tipo', models.CharField(max_length=45)),
                ('detalle', models.CharField(max_length=255)),
            ],
            options={
                'db_table': 'agenda',
            },
        ),
        migrations.CreateModel(
            name='OrganoColegiado',
            fields=[
                ('id_organo_colegiado', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=128)),
                ('numero_miembros', models.IntegerField()),
                ('quorum', models.IntegerField()),
                ('acuerdo_firme', models.CharField(max_length=50)),
            ],
            options={
                'db_table': 'organo_colegiado',
            },
        ),
        migrations.CreateModel(
            name='Sesion',
            fields=[
                ('id_sesion', models.CharField(max_length=64, primary_key=True, serialize=False)),
                ('fecha', models.DateTimeField()),
                ('medio', models.CharField(max_length=128)),
                ('link_carpeta', models.CharField(max_length=2048)),
                ('id_acta_fk', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='organo_colegiado.acta')),
                ('id_agenda_fk', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='organo_colegiado.agenda')),
                ('id_organo_colegiado_fk', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='organo_colegiado.organocolegiado')),
            ],
            options={
                'db_table': 'sesion',
            },
        ),
        migrations.CreateModel(
            name='Seguimiento',
            fields=[
                ('id_seguimiento', models.AutoField(primary_key=True, serialize=False)),
                ('id_documento_seguimiento_fk', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='version_proyecto.documento')),
            ],
            options={
                'db_table': 'seguimiento',
            },
        ),
        migrations.CreateModel(
            name='Participante',
            fields=[
                ('id_participante', models.AutoField(primary_key=True, serialize=False)),
                ('estado', models.CharField(max_length=45)),
                ('cedula', models.CharField(max_length=15)),
                ('id_nombre_completo_fk', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='personas.nombrecompleto')),
                ('id_sesion_fk', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='organo_colegiado.sesion')),
            ],
            options={
                'db_table': 'participante',
            },
        ),
        migrations.CreateModel(
            name='Convocatoria',
            fields=[
                ('id_convocatoria', models.AutoField(primary_key=True, serialize=False)),
                ('id_documento_convocatoria_fk', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='version_proyecto.documento')),
            ],
            options={
                'db_table': 'convocatoria',
            },
        ),
        migrations.AddField(
            model_name='agenda',
            name='id_convocatoria_fk',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='organo_colegiado.convocatoria'),
        ),
        migrations.CreateModel(
            name='Acuerdo',
            fields=[
                ('id_acuerdo', models.AutoField(primary_key=True, serialize=False)),
                ('descripcion', models.CharField(max_length=255)),
                ('estado', models.CharField(max_length=45)),
                ('fecha_cumplimiento', models.DateField()),
                ('encargado', models.CharField(max_length=150)),
                ('id_documento_acuerdo_fk', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='version_proyecto.documento')),
                ('id_oficio_fk', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='version_proyecto.oficio')),
                ('id_seguimiento_fk', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='organo_colegiado.seguimiento')),
                ('id_sesion_fk', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='organo_colegiado.sesion')),
            ],
            options={
                'db_table': 'acuerdo',
            },
        ),
        migrations.CreateModel(
            name='Invitado',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('id_persona_externa_fk', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='personas.personaexterna')),
                ('id_sesion_fk', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='organo_colegiado.sesion')),
            ],
            options={
                'db_table': 'invitado',
                'unique_together': {('id_persona_externa_fk', 'id_sesion_fk')},
            },
        ),
        migrations.CreateModel(
            name='Integrante',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('puesto', models.CharField(max_length=120)),
                ('normativa_reguladora', models.CharField(max_length=120)),
                ('id_academico_fk', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='personas.academico')),
                ('id_oficio_nombramiento_fk', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='version_proyecto.oficio')),
                ('id_organo_colegiado_fk', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='organo_colegiado.organocolegiado')),
                ('id_vigencia_fk', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='propuesta_proyecto.vigencia')),
            ],
            options={
                'db_table': 'integrante',
                'unique_together': {('id_organo_colegiado_fk', 'id_academico_fk')},
            },
        ),
    ]
