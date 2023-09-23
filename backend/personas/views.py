from rest_framework import viewsets
from .models import NombreCompleto, AreaEspecialidad, Universidad, Academico, Telefono,  Titulos, Evaluador, Asistente, Autor, Institucion, PersonaExterna
from .serializers import NombreCompletoSerializer, AreaEspecialidadSerializer, UniversidadSerializer, AcademicoSerializer, TelefonoSerializer, TitulosSerializer, EvaluadorSerializer, AsistenteSerializer, AutorSerializer, InstitucionSerializer, PersonaExternaSerializer

from django_files.permisos import PermisoPorRol
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class NombreCompletoViewSet(viewsets.ModelViewSet):
    view_name = 'nombres_completos'
    queryset = NombreCompleto.objects.all()
    serializer_class = NombreCompletoSerializer

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class AreaEspecialidadViewSet(viewsets.ModelViewSet):
    view_name = 'areas_especialidad'
    queryset = AreaEspecialidad.objects.all()
    serializer_class = AreaEspecialidadSerializer

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class UniversidadViewSet(viewsets.ModelViewSet):
    view_name = 'universidades'
    queryset = Universidad.objects.all()
    serializer_class = UniversidadSerializer

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class AcademicoViewSet(viewsets.ModelViewSet):
    view_name = 'academicos'
    queryset = Academico.objects.all()
    serializer_class = AcademicoSerializer

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class TelefonoViewSet(viewsets.ModelViewSet):
    view_name = 'telefonos'
    queryset = Telefono.objects.all()
    serializer_class = TelefonoSerializer

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class TitulosViewSet(viewsets.ModelViewSet):
    view_name = 'titulos'
    queryset = Titulos.objects.all()
    serializer_class = TitulosSerializer

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class EvaluadorViewSet(viewsets.ModelViewSet):
    view_name = 'evaluadores'
    queryset = Evaluador.objects.all()
    serializer_class = EvaluadorSerializer

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class AsistenteViewSet(viewsets.ModelViewSet):
    view_name = 'asistentes'
    queryset = Asistente.objects.all()
    serializer_class = AsistenteSerializer

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class AutorViewSet(viewsets.ModelViewSet):
    view_name = 'autores'
    queryset = Autor.objects.all()
    serializer_class = AutorSerializer

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class InstitucionViewSet(viewsets.ModelViewSet):
    view_name = 'instituciones'
    queryset = Institucion.objects.all()
    serializer_class = InstitucionSerializer

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class PersonaExternaViewSet(viewsets.ModelViewSet):
    view_name = 'personas_externas'
    queryset = PersonaExterna.objects.all()
    serializer_class = PersonaExternaSerializer

