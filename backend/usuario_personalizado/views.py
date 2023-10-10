from rest_framework import viewsets
from .models import Usuario
from .serializers import UsuarioSerializer
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated

class UsuarioViewSet(viewsets.ModelViewSet):
    view_name = 'usuarios'
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]