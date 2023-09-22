from rest_framework import viewsets
from .models import PropuestaProyecto, Vigencia, ColaboradorPrincipal, DocumentoAsociado
from .serializers import PropuestaProyectoSerializer, VigenciaSerializer, ColaboradorPrincipalSerializer, DocumentoAsociadoSerializer

class PropuestaProyectoViewSet(viewsets.ModelViewSet):
    queryset = PropuestaProyecto.objects.all()
    serializer_class = PropuestaProyectoSerializer

class VigenciaViewSet(viewsets.ModelViewSet):
    queryset = Vigencia.objects.all()
    serializer_class = VigenciaSerializer

class ColaboradorPrincipalViewSet(viewsets.ModelViewSet):
    queryset = ColaboradorPrincipal.objects.all()
    serializer_class = ColaboradorPrincipalSerializer

class DocumentoAsociadoViewSet(viewsets.ModelViewSet):
    queryset = DocumentoAsociado.objects.all()
    serializer_class = DocumentoAsociadoSerializer
