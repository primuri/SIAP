from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from usuario_personalizado.models import Usuario
from django.contrib.auth.models import Group
from rest_framework.authtoken.models import Token

class SignupTests(APITestCase):

    def setUp(self):
        # Crear un usuario con el rol necesario para registrar a otros usuarios
        self.admin_user = Usuario.objects.create_user(correo='admin@example.com', password='adminpassword')
        admin_group, created = Group.objects.get_or_create(name='administrador')
        self.admin_user.groups.add(admin_group)
        self.admin_token = Token.objects.create(user=self.admin_user)

        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.admin_token.key)

        self.signup_url = reverse('signup')

    def test_signup_successful(self):
        data = {
            'correo': 'test@example.com',
            'password': 'testpassword',
            'groups': ['administrador']  
        }
        response = self.client.post(self.signup_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Usuario.objects.filter(correo='test@example.com').exists())
        self.assertIn('token', response.data)
        self.assertIn('user', response.data)

    def test_signup_unsuccessful(self):
        data = {
            'correo': 'test2@example.com',
            'groups': ['somegroup']
        }
        response = self.client.post(self.signup_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(Usuario.objects.filter(correo='test2@example.com').exists())