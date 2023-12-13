from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from ..models import CodigoFinanciero
from django.contrib.auth.models import Group
from usuario_personalizado.models import Usuario

class CodigoFinancieroTests(APITestCase):

    def setUp(self):

        # Crea el usuario de prueba usando el modelo personalizado
        self.user = Usuario.objects.create_user(correo='testuser@example.com', password='testpassword')
        admin_group, created = Group.objects.get_or_create(name='administrador')
        self.user.groups.add(admin_group)
        self.token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        # Crea los datos de Prueba
        self.data = {
            'codigo': 'Arte'
        }
    
    def test_post_codigo_financiero(self):

        url = reverse('codigofinanciero-list')
        response = self.client.post(url, self.data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CodigoFinanciero.objects.count(), 1)
        self.assertEqual(CodigoFinanciero.objects.get().codigo, 'Arte')

    def test_put_codigo_financiero(self):
        # Datos actualizados
        update_data = {
            'codigo': 'Ciencias'
        }

        self.client.post(reverse('codigofinanciero-list'), self.data, format='json')
        url = reverse('codigofinanciero-detail', args=[1])
        response = self.client.put(url, update_data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(CodigoFinanciero.objects.get().codigo, 'Ciencias')

    def test_get_lista_codigo_financieros(self):
      
        data2 = {
            'codigo': 'Danza'
        }

        self.client.post(reverse('codigofinanciero-list'), self.data, format='json')
        self.client.post(reverse('codigofinanciero-list'), data2, format='json')
        url = reverse('codigofinanciero-list')
        response = self.client.get(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[1]['codigo'], 'Danza')
    
    def test_get_buscar_codigo_financiero(self):

        self.client.post(reverse('codigofinanciero-list'), self.data, format='json')
        url = reverse('codigofinanciero-detail', args=[1])
        response = self.client.get(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['codigo'], 'Arte')

    def test_delete_codigo_financiero(self):
        self.client.post(reverse('codigofinanciero-list'), self.data, format='json')
        url = reverse('codigofinanciero-detail', args=[1])
        response = self.client.delete(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(CodigoFinanciero.objects.count(), 0)