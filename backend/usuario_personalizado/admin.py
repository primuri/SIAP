from django.contrib import admin
from .models import Usuario

class UsuarioAdmin(admin.ModelAdmin):
    search_fields = ['id']

admin.site.register(Usuario, UsuarioAdmin)
