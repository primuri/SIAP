from django.contrib import admin
from .models import Proyecto, Oficio, Documento, EvaluacionCC, PreguntaEvaluacionCC, Evaluacion, VersionProyecto, DesignacionAsistente, ColaboradorSecundario

# Register your models here.
admin.site.register(Proyecto)
admin.site.register(Oficio)
admin.site.register(Documento)
admin.site.register(EvaluacionCC)
admin.site.register(PreguntaEvaluacionCC)
admin.site.register(Evaluacion)
admin.site.register(VersionProyecto)
admin.site.register(DesignacionAsistente)
admin.site.register(ColaboradorSecundario)
