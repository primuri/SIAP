from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from ..models import Usuario
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User, Group

class UsuarioTests(APITestCase):

    from django.contrib.auth.models import Group

class UsuarioTests(APITestCase):

    def setUp(self):
        # Crear un usuario para pruebas
        self.user = Usuario.objects.create_user(correo='testuser@example.com', password='testpassword')
        self.admin_group, created = Group.objects.get_or_create(name='administrador')
        self.user.groups.add(self.admin_group)
        self.token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def test_create_user(self):
        data = {
            'correo': 'newuser@example.com',
            'password': 'newpassword',
            'groups': ['administrador']  
        }
        url = reverse('signup')
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Usuario.objects.count(), 2) 


    def test_get_users(self):
        url = reverse('obtener_usuarios')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_update_user(self):
        url = reverse('actualizar_usuario', args=[self.user.id])
        data = {'correo': 'updateduser@example.com'}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.correo, 'updateduser@example.com')

    def test_delete_user(self):
        url = reverse('eliminar_usuario', args=[self.user.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Usuario.objects.count(), 0)
