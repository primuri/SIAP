from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from ..models import EnteFinanciero
from django.contrib.auth.models import Group
from usuario_personalizado.models import Usuario

class EnteFinancieroTests(APITestCase):

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
            'nombre': 'Arte'
        }
    
    def test_post_ente_financiero(self):

        url = reverse('entefinanciero-list')
        response = self.client.post(url, self.data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(EnteFinanciero.objects.count(), 1)
        self.assertEqual(EnteFinanciero.objects.get().nombre, 'Arte')

    def test_put_ente_financiero(self):
        # Datos actualizados
        update_data = {
            'nombre': 'Ciencias'
        }

        self.client.post(reverse('entefinanciero-list'), self.data, format='json')
        url = reverse('entefinanciero-detail', args=[1])
        response = self.client.put(url, update_data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(EnteFinanciero.objects.get().nombre, 'Ciencias')

    def test_get_lista_ente_financieros(self):
      
        data2 = {
            'nombre': 'Danza'
        }

        self.client.post(reverse('entefinanciero-list'), self.data, format='json')
        self.client.post(reverse('entefinanciero-list'), data2, format='json')
        url = reverse('entefinanciero-list')
        response = self.client.get(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[1]['nombre'], 'Danza')
    
    def test_get_buscar_ente_financiero(self):

        self.client.post(reverse('entefinanciero-list'), self.data, format='json')
        url = reverse('entefinanciero-detail', args=[1])
        response = self.client.get(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nombre'], 'Arte')

    def test_delete_entefinanciero(self):
        self.client.post(reverse('entefinanciero-list'), self.data, format='json')
        url = reverse('entefinanciero-detail', args=[1])
        response = self.client.delete(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(EnteFinanciero.objects.count(), 0)