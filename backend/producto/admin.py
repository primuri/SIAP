from django.contrib import admin
from .models import Producto, Revista, Articulo, Area, Evento, Software

# Register your models here.
admin.site.register(Producto)
admin.site.register(Revista)
admin.site.register(Articulo)
admin.site.register(Area)
admin.site.register(Evento)
admin.site.register(Software)
