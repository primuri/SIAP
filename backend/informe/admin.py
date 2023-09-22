from django.contrib import admin
from .models import Informe, VersionInforme, Accion

# Register your models here.
admin.site.register(Informe)
admin.site.register(VersionInforme)
admin.site.register(Accion)
