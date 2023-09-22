from rest_framework import viewsets
from .models import NombreCompleto, AreaEspecialidad, Universidad, Academico, Telefono,  Titulos, Evaluador, Asistente, Autor, Institucion, PersonaExterna
from .serializers import NombreCompletoSerializer, AreaEspecialidadSerializer, UniversidadSerializer, AcademicoSerializer, TelefonoSerializer, TitulosSerializer, EvaluadorSerializer, AsistenteSerializer, AutorSerializer, InstitucionSerializer, PersonaExternaSerializer

class NombreCompletoViewSet(viewsets.ModelViewSet):
    queryset = NombreCompleto.objects.all()
    serializer_class = NombreCompletoSerializer

class AreaEspecialidadViewSet(viewsets.ModelViewSet):
    queryset = AreaEspecialidad.objects.all()
    serializer_class = AreaEspecialidadSerializer

class UniversidadViewSet(viewsets.ModelViewSet):
    queryset = Universidad.objects.all()
    serializer_class = UniversidadSerializer

class AcademicoViewSet(viewsets.ModelViewSet):
    queryset = Academico.objects.all()
    serializer_class = AcademicoSerializer

class TelefonoViewSet(viewsets.ModelViewSet):
    queryset = Telefono.objects.all()
    serializer_class = TelefonoSerializer

class TitulosViewSet(viewsets.ModelViewSet):
    queryset = Titulos.objects.all()
    serializer_class = TitulosSerializer

class EvaluadorViewSet(viewsets.ModelViewSet):
    queryset = Evaluador.objects.all()
    serializer_class = EvaluadorSerializer

class AsistenteViewSet(viewsets.ModelViewSet):
    queryset = Asistente.objects.all()
    serializer_class = AsistenteSerializer

class AutorViewSet(viewsets.ModelViewSet):
    queryset = Autor.objects.all()
    serializer_class = AutorSerializer

class InstitucionViewSet(viewsets.ModelViewSet):
    queryset = Institucion.objects.all()
    serializer_class = InstitucionSerializer

class PersonaExternaViewSet(viewsets.ModelViewSet):
    queryset = PersonaExterna.objects.all()
    serializer_class = PersonaExternaSerializer

