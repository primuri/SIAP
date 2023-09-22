from rest_framework import viewsets
from .models import Informe, VersionInforme, Accion
from .serializers import InformeSerializer, VersionInformeSerializer, AccionSerializer

class InformeViewSet(viewsets.ModelViewSet):
    queryset = Informe.objects.all()
    serializer_class = InformeSerializer

class VersionInformeViewSet(viewsets.ModelViewSet):
    queryset = VersionInforme.objects.all()
    serializer_class = VersionInformeSerializer

class AccionViewSet(viewsets.ModelViewSet):
    queryset = Accion.objects.all()
    serializer_class = AccionSerializer
