from rest_framework import viewsets
from .models import Producto, Revista, Articulo, Area, Evento, Software
from .serializers import ProductoSerializer, RevistaSerializer, ArticuloSerializer, AreaSerializer, EventoSerializer, SoftwareSerializer

from django_files.permisos import PermisoPorRol
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class ProductoViewSet(viewsets.ModelViewSet):
    view_name = 'productos'
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class RevistaViewSet(viewsets.ModelViewSet):
    view_name = 'revistas'
    queryset = Revista.objects.all()
    serializer_class = RevistaSerializer

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class ArticuloViewSet(viewsets.ModelViewSet):
    view_name = 'articulos'
    queryset = Articulo.objects.all()
    serializer_class = ArticuloSerializer

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class AreaViewSet(viewsets.ModelViewSet):
    view_name = 'areas'
    queryset = Area.objects.all()
    serializer_class = AreaSerializer

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class EventoViewSet(viewsets.ModelViewSet):
    view_name = 'eventos'
    queryset = Evento.objects.all()
    serializer_class = EventoSerializer

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class SoftwareViewSet(viewsets.ModelViewSet):
    view_name = 'softwares'
    queryset = Software.objects.all()
    serializer_class = SoftwareSerializer

