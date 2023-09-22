from rest_framework import viewsets
from .models import Producto, Revista, Articulo, Area, Evento, Software
from .serializers import ProductoSerializer, RevistaSerializer, ArticuloSerializer, AreaSerializer, EventoSerializer, SoftwareSerializer


class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

class RevistaViewSet(viewsets.ModelViewSet):
    queryset = Revista.objects.all()
    serializer_class = RevistaSerializer

class ArticuloViewSet(viewsets.ModelViewSet):
    queryset = Articulo.objects.all()
    serializer_class = ArticuloSerializer

class AreaViewSet(viewsets.ModelViewSet):
    queryset = Area.objects.all()
    serializer_class = AreaSerializer

class EventoViewSet(viewsets.ModelViewSet):
    queryset = Evento.objects.all()
    serializer_class = EventoSerializer

class SoftwareViewSet(viewsets.ModelViewSet):
    queryset = Software.objects.all()
    serializer_class = SoftwareSerializer

