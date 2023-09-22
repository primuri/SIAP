from rest_framework import viewsets
from .models import Proyecto, Oficio, Documento, EvaluacionCC, PreguntaEvaluacionCC, Evaluacion, VersionProyecto, DesignacionAsistente, ColaboradorSecundario
from .serializers import ProyectoSerializer, OficioSerializer, DocumentoSerializer, EvaluacionCCSerializer, PreguntaEvaluacionCCSerializer, EvaluacionSerializer, VersionProyectoSerializer, DesignacionAsistenteSerializer, ColaboradorSecundarioSerializer

class ProyectoViewSet(viewsets.ModelViewSet):
    queryset = Proyecto.objects.all()
    serializer_class = ProyectoSerializer

class OficioViewSet(viewsets.ModelViewSet):
    queryset = Oficio.objects.all()
    serializer_class = OficioSerializer

class DocumentoViewSet(viewsets.ModelViewSet):
    queryset = Documento.objects.all()
    serializer_class = DocumentoSerializer

class EvaluacionCCViewSet(viewsets.ModelViewSet):
    queryset = EvaluacionCC.objects.all()
    serializer_class = EvaluacionCCSerializer

class PreguntaEvaluacionCCViewSet(viewsets.ModelViewSet):
    queryset = PreguntaEvaluacionCC.objects.all()
    serializer_class = PreguntaEvaluacionCCSerializer

class EvaluacionViewSet(viewsets.ModelViewSet):
    queryset = Evaluacion.objects.all()
    serializer_class = EvaluacionSerializer

class VersionProyectoViewSet(viewsets.ModelViewSet):
    queryset = VersionProyecto.objects.all()
    serializer_class = VersionProyectoSerializer

class DesignacionAsistenteViewSet(viewsets.ModelViewSet):
    queryset = DesignacionAsistente.objects.all()
    serializer_class = DesignacionAsistenteSerializer

class ColaboradorSecundarioViewSet(viewsets.ModelViewSet):
    queryset = ColaboradorSecundario.objects.all()
    serializer_class = ColaboradorSecundarioSerializer