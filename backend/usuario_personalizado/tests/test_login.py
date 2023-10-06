from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from django.urls import reverse
from ..models import Usuario

class LoginTests(APITestCase):

    def setUp(self):
        # Crear un usuario para pruebas
        self.user = Usuario.objects.create_user(correo='testuser@example.com', password='testpassword')
        self.login_url = reverse('login')

    def test_login_successful(self):
        data = {
            'correo': 'testuser@example.com',
            'password': 'testpassword'
        }
        response = self.client.post(self.login_url, data)

        self.assertEqual(response.status_code, 200)
        self.assertIn('token', response.data)
        self.assertIn('user', response.data)

    def test_login_unsuccessful_wrong_password(self):
        data = {
            'correo': 'testuser@example.com',
            'password': 'wrongpassword'
        }
        response = self.client.post(self.login_url, data)

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data, "missing user")
