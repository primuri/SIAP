from django.contrib import admin
from .models import PropuestaProyecto, Vigencia, ColaboradorPrincipal, DocumentoAsociado

admin.site.register(PropuestaProyecto)
admin.site.register(Vigencia)
admin.site.register(ColaboradorPrincipal)
admin.site.register(DocumentoAsociado)