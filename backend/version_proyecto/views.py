from rest_framework import viewsets
from .models import PreguntaEvaluacion, Proyecto, Oficio, Documento, EvaluacionCC, PreguntaEvaluacionCC, Evaluacion, VersionProyecto, DesignacionAsistente, ColaboradorSecundario
from .serializers import PreguntaEvaluacionSerializer, ProyectoSerializer, OficioSerializer, DocumentoSerializer, EvaluacionCCSerializer, PreguntaEvaluacionCCSerializer, EvaluacionSerializer, VersionProyectoSerializer, DesignacionAsistenteSerializer, ColaboradorSecundarioSerializer

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
class PreguntaEvaluacionViewSet(viewsets.ModelViewSet):
    view_name = 'preguntas_evaluaciones'
    queryset = PreguntaEvaluacion.objects.all()
    serializer_class = PreguntaEvaluacionSerializer

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class EvaluacionViewSet(viewsets.ModelViewSet):
    view_name = 'evaluaciones'
    queryset = Evaluacion.objects.all()
    serializer_class = EvaluacionSerializer

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class VersionProyectoViewSet(viewsets.ModelViewSet):
    view_name = 'versiones_proyectos'
    queryset = VersionProyecto.objects.all()
    serializer_class = VersionProyectoSerializer

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