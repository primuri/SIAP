from rest_framework import viewsets
from .models import Proyecto, Oficio, Documento, EvaluacionCC, PreguntaEvaluacionCC, Evaluacion, RespuestaEvaluacion, VersionProyecto, DesignacionAsistente, ColaboradorSecundario
from .serializers import RespuestaEvaluacionSerializer, EvaluacionSerializer, ProyectoSerializer, OficioSerializer, DocumentoSerializer, EvaluacionCCSerializer, PreguntaEvaluacionCCSerializer, EvaluacionSerializer, VersionProyectoSerializer, DesignacionAsistenteSerializer, ColaboradorSecundarioSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django_files.permisos import PermisoPorRol
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class ProyectoViewSet(viewsets.ModelViewSet):
    view_name = 'proyectos'
    queryset = Proyecto.objects.all()
    serializer_class = ProyectoSerializer

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class OficioViewSet(viewsets.ModelViewSet):
    view_name = 'oficios'
    queryset = Oficio.objects.all()
    serializer_class = OficioSerializer

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class DocumentoViewSet(viewsets.ModelViewSet):
    view_name = 'documentos'
    queryset = Documento.objects.all()
    serializer_class = DocumentoSerializer

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class EvaluacionCCViewSet(viewsets.ModelViewSet):
    view_name = 'evaluaciones'
    queryset = EvaluacionCC.objects.all()
    serializer_class = EvaluacionCCSerializer

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class PreguntaEvaluacionCCViewSet(viewsets.ModelViewSet):
    view_name = 'preguntas_evaluaciones_CC'
    queryset = PreguntaEvaluacionCC.objects.all()
    serializer_class = PreguntaEvaluacionCCSerializer

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class RespuestaEvaluacionViewSet(viewsets.ModelViewSet):
    view_name = 'respuestas_evaluaciones'
    queryset = RespuestaEvaluacion.objects.all()
    serializer_class = RespuestaEvaluacionSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        id_evaluacion = self.request.query_params.get('id_evaluacion', None)
        if id_evaluacion is not None:
            queryset = queryset.filter(id_evaluacion_fk=id_evaluacion)

        return queryset


@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class EvaluacionViewSet(viewsets.ModelViewSet):
    view_name = 'evaluaciones'
    queryset = Evaluacion.objects.all()
    serializer_class = EvaluacionSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        id_evaluador = self.request.query_params.get('id_evaluador', None)
        if id_evaluador is not None:
            queryset = queryset.filter(id_evaluador_fk=id_evaluador)

        return queryset

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class VersionProyectoViewSet(viewsets.ModelViewSet):
    view_name = 'versiones_proyectos'
    queryset = VersionProyecto.objects.all()
    serializer_class = VersionProyectoSerializer
    def get_queryset(self):
        queryset = super().get_queryset()
        id_version = self.request.query_params.get('id_version', None)
        if id_version is not None:
            queryset = queryset.filter(id_version_proyecto=id_version)

        return queryset

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class DesignacionAsistenteViewSet(viewsets.ModelViewSet):
    view_name = 'desginaciones_asistentes'
    queryset = DesignacionAsistente.objects.all()
    serializer_class = DesignacionAsistenteSerializer

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class ColaboradorSecundarioViewSet(viewsets.ModelViewSet):
    view_name = 'colaboradores_secundarios'
    queryset = ColaboradorSecundario.objects.all()
    serializer_class = ColaboradorSecundarioSerializer

