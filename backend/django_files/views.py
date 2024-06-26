from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from usuario_personalizado.models import Usuario
from rest_framework.authtoken.models import Token
from .serializers import UserSerializer
from .permisos import PermisoPorRol

# Signup
@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])                                                                # Vista asociada a una solicitud POST
def signup(request):                                                               
    serializer = UserSerializer(data=request.data)                                 # Se crea un serializador para el usuario y se le pasa la data de la solicitud
    if serializer.is_valid():
        serializer.save()                                                          # Guarda el nuevo usuario en la base de datos  
        user = Usuario.objects.get(correo=request.data['correo'])                 # Se recupera de la base de datos el objeto de usuario recién creado 
        user.set_password(request.data['password'])                                # Se setea la contraseña del usuario usando la proporcionada en la solicitud
        user.save()                                                                # Se guarda el usuario nuevamente en la base de datos
        token = Token.objects.create(user=user)                                    # Se crea un token de autenticación para el usuario recién registrado. 
                                                                                   # Esto permite que el usuario inicie sesión en futuras solicitudes utilizando este token.
        return Response({'token': token.key, 'user': serializer.data}, status=status.HTTP_201_CREATED) # Se devuelve una respuesta HTTP con un token y los datos del usuario registrado en un JSON.
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Login
@api_view(['POST'])
def login(request):
    user = get_object_or_404(Usuario, correo=request.data['correo'])
    if not user.check_password(request.data['password']):
        return Response("missing user", status=status.HTTP_404_NOT_FOUND)
    token, created = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(user)
    return Response({'token': token.key, 'user': serializer.data})

# Test token
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def test_token(request):
    return Response("passed!")

# Get users
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
def get_users(request):
    users = Usuario.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

# Delete user
@api_view(['DELETE'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
def delete_user(request, id):
    user = get_object_or_404(Usuario, id=id)
    user.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

# Update user
@api_view(['PATCH'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
def update_user(request, id):
    user = get_object_or_404(Usuario, id=id)
    serializer = UserSerializer(user, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        if 'password' in request.data:
            user.set_password(request.data['password'])
            user.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Get user
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
def get_user_by_id(request, id):
    user = get_object_or_404(Usuario, id=id)
    serializer = UserSerializer(user)
    return Response(serializer.data)
