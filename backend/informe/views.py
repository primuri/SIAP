from rest_framework import viewsets
from .models import Informe, VersionInforme, Accion
from .serializers import InformeSerializer, VersionInformeSerializer, AccionSerializer

from django_files.permisos import PermisoPorRol
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class InformeViewSet(viewsets.ModelViewSet):
    view_name = 'informes'
    queryset = Informe.objects.all()
    serializer_class = InformeSerializer

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class VersionInformeViewSet(viewsets.ModelViewSet):
    view_name = 'versiones_informes'
    queryset = VersionInforme.objects.all()
    serializer_class = VersionInformeSerializer

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class AccionViewSet(viewsets.ModelViewSet):
    view_name = 'acciones'
    queryset = Accion.objects.all()
    serializer_class = AccionSerializer
