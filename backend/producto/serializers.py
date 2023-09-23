from rest_framework import serializers
from .models import Producto, Revista, Articulo, Area, Evento, Software
from personas.serializers import AutorSerializer, InstitucionSerializer
from version_proyecto.serializers import DocumentoSerializer, OficioSerializer


class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'

class RevistaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Revista
        fields = '__all__'

class ArticuloSerializer(serializers.ModelSerializer):
    id_revista_fk = RevistaSerializer()
    id_producto_fk = ProductoSerializer
    id_autor_fk = AutorSerializer()
    id_documento_articulo_fk = DocumentoSerializer()
    class Meta:
        model = Articulo
        fields = '__all__'

class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = '__all__'

class EventoSerializer(serializers.ModelSerializer):
    id_producto_fk = ProductoSerializer()
    id_institucion_fk = InstitucionSerializer
    id_area_fk = AreaSerializer()
    id_oficio_fk = OficioSerializer
    class Meta:
        model = Evento
        fields = '__all__'

class SoftwareSerializer(serializers.ModelSerializer):
    id_producto_fk = ProductoSerializer()
    id_documento_documentacion_fk = DocumentoSerializer()
    class Meta:
        model = Software
        fields = '__all__'
