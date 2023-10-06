from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from django.urls import reverse
from ..models import Usuario

class TestTokenTests(APITestCase):

    def setUp(self):
        # Crear un usuario para pruebas
        self.user = Usuario.objects.create_user(correo='testuser@example.com', password='testpassword')
        self.token = Token.objects.create(user=self.user)
        self.test_token_url = reverse('test_token')

    def test_token_successful(self):
        # Crea un token valido
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        response = self.client.get(self.test_token_url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, "passed!")

    def test_token_unsuccessful_missing_or_invalid(self):

        # No proporciona un token
        response = self.client.get(self.test_token_url)
        self.assertEqual(response.status_code, 403)

        # Proporcionando un token inválido
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + 'InvalidTokenHere')
        response = self.client.get(self.test_token_url)
        self.assertEqual(response.status_code, 403)
