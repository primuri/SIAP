from rest_framework import serializers
from personas.models import Autor, Institucion

from version_proyecto.models import Documento, Oficio, VersionProyecto
from .models import Producto, Revista, Articulo, Area, Evento, Software
from personas.serializers import AutorSerializer, InstitucionSerializer
from version_proyecto.serializers import DocumentoSerializer, OficioSerializer, VersionProyectoSerializer


class ProductoSerializer(serializers.ModelSerializer):
    id_version_proyecto = serializers.PrimaryKeyRelatedField(queryset=VersionProyecto.objects.all())

    class Meta:
        model = Producto
        fields = '__all__'

    def to_representation(self, instance):
        rep = super(ProductoSerializer, self).to_representation(instance)
        rep['id_version_proyecto'] = VersionProyectoSerializer(instance.id_version_proyecto).data
        return rep

class RevistaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Revista
        fields = '__all__'

class ArticuloSerializer(serializers.ModelSerializer):
    id_revista_fk = serializers.PrimaryKeyRelatedField(queryset=Revista.objects.all())
    id_producto_fk = serializers.PrimaryKeyRelatedField(queryset=Producto.objects.all())
    id_autor_fk = serializers.PrimaryKeyRelatedField(queryset=Autor.objects.all())
    id_documento_articulo_fk = serializers.PrimaryKeyRelatedField(queryset=Documento.objects.all())

    class Meta:
        model = Articulo
        fields = '__all__'

    def to_representation(self, instance):
        rep = super(ArticuloSerializer, self).to_representation(instance)
        rep['id_revista_fk'] = RevistaSerializer(instance.id_revista_fk).data
        rep['id_producto_fk'] = ProductoSerializer(instance.id_producto_fk).data
        rep['id_autor_fk'] = AutorSerializer(instance.id_autor_fk).data
        rep['id_documento_articulo_fk'] = DocumentoSerializer(instance.id_documento_articulo_fk).data
        return rep

class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = '__all__'

class EventoSerializer(serializers.ModelSerializer):
    id_producto_fk = serializers.PrimaryKeyRelatedField(queryset=Producto.objects.all())
    id_institucion_fk = serializers.PrimaryKeyRelatedField(queryset=Institucion.objects.all())  
    id_area_fk = serializers.PrimaryKeyRelatedField(queryset=Area.objects.all())
    id_oficio_fk = serializers.PrimaryKeyRelatedField(queryset=Oficio.objects.all())

    class Meta:
        model = Evento
        fields = '__all__'

    def to_representation(self, instance):
        rep = super(EventoSerializer, self).to_representation(instance)
        rep['id_producto_fk'] = ProductoSerializer(instance.id_producto_fk).data
        rep['id_institucion_fk'] = InstitucionSerializer(instance.id_institucion_fk).data
        rep['id_area_fk'] = AreaSerializer(instance.id_area_fk).data
        rep['id_oficio_fk'] = OficioSerializer(instance.id_oficio_fk).data
        return rep

class SoftwareSerializer(serializers.ModelSerializer):
    id_producto_fk = serializers.PrimaryKeyRelatedField(queryset=Producto.objects.all())
    id_documento_documentacion_fk = serializers.PrimaryKeyRelatedField(queryset=Documento.objects.all())

    class Meta:
        model = Software
        fields = '__all__'

    def to_representation(self, instance):
        rep = super(SoftwareSerializer, self).to_representation(instance)
        rep['id_producto_fk'] = ProductoSerializer(instance.id_producto_fk).data
        rep['id_documento_documentacion_fk'] = DocumentoSerializer(instance.id_documento_documentacion_fk).data
        return rep
