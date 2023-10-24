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

    def get_queryset(self):
        queryset = super().get_queryset()
        id_version_proyecto = self.request.query_params.get('id_version_proyecto', None)
        if id_version_proyecto is not None:
            queryset = queryset.filter(id_version_proyecto_fk=id_version_proyecto)

        return queryset

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class VersionInformeViewSet(viewsets.ModelViewSet):
    view_name = 'versiones_informes'
    queryset = VersionInforme.objects.all()
    serializer_class = VersionInformeSerializer

    
    def get_queryset(self):
        queryset = super().get_queryset()
        id_informe = self.request.query_params.get('id_informe', None)
        if id_informe is not None:
            queryset = queryset.filter(id_informe_fk=id_informe)

        return queryset

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class AccionViewSet(viewsets.ModelViewSet):
    view_name = 'acciones'
    queryset = Accion.objects.all()
    serializer_class = AccionSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        id_version_informe = self.request.query_params.get('id_version_informe', None)
        if id_version_informe is not None:
            queryset = queryset.filter(id_version_informe_fk=id_version_informe)

        return queryset