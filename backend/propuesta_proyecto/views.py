from rest_framework import viewsets
from .models import PropuestaProyecto, Vigencia, ColaboradorPrincipal, DocumentoAsociado
from .serializers import PropuestaProyectoSerializer, VigenciaSerializer, ColaboradorPrincipalSerializer, DocumentoAsociadoSerializer

from django_files.permisos import PermisoPorRol
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.db import models
from datetime import datetime

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class PropuestaProyectoViewSet(viewsets.ModelViewSet):
    view_name = 'propuestas_proyectos'
    queryset = PropuestaProyecto.objects.all()
    serializer_class = PropuestaProyectoSerializer

    def perform_create(self, serializer):
        year = datetime.now().year
        max_id = PropuestaProyecto.objects.filter(id_codigo_cimpa__contains=str(year)).aggregate(max_id=models.Max('id_codigo_cimpa'))['max_id']
        if max_id is None:
            max_id = 0
        else:
            max_id = int(max_id.split('-')[0])
        max_id += 1
        serializer.validated_data['id_codigo_cimpa'] = f'{max_id}-{year}'
        serializer.save()

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class VigenciaViewSet(viewsets.ModelViewSet):
    view_name = 'vigencias'
    queryset = Vigencia.objects.all()
    serializer_class = VigenciaSerializer

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class ColaboradorPrincipalViewSet(viewsets.ModelViewSet):
    view_name = 'colaboradores_principales'
    queryset = ColaboradorPrincipal.objects.all()
    serializer_class = ColaboradorPrincipalSerializer

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class DocumentoAsociadoViewSet(viewsets.ModelViewSet):
    view_name = 'documentos_asociados'
    queryset = DocumentoAsociado.objects.all()
    serializer_class = DocumentoAsociadoSerializer
