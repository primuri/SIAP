from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from ..models import Universidad
from django.contrib.auth.models import Group

class UniversidadTests(APITestCase):

    def setUp(self):

        # Crea el usuario de prueba
        self.user = User.objects.create_user(username='testuser', password='testpassword', is_staff=True, is_superuser=True)
        admin_group, created = Group.objects.get_or_create(name='administrador')
        self.user.groups.add(admin_group)
        self.token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        # Crea los datos de Prueba
        self.data = {
            'pais': 'Costa Rica',
            'nombre': 'Universidad de Costa Rica'
        }

    def test_post_universidad(self):

        url = reverse('universidad-list')
        response = self.client.post(url, self.data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Universidad.objects.count(), 1)
        self.assertEqual(Universidad.objects.get().nombre, 'Universidad de Costa Rica')

    def test_put_universidad(self):

        # Datos actualizados
        update_data = {
            'pais': 'Costa Rica',
            'nombre': 'Universidad Nacional de Costa Rica'
        }

        self.client.post(reverse('universidad-list'), self.data, format='json')
        url = reverse('universidad-detail', args=[1])
        response = self.client.put(url, update_data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Universidad.objects.get().nombre, 'Universidad Nacional de Costa Rica')

    def test_get_lista_universidades(self):
       
        #Carga de datos 2
        data2 = {
            'pais': 'Colombia',
            'nombre': 'Universidad de Antioquia'
        }

        self.client.post(reverse('universidad-list'), self.data, format='json')
        self.client.post(reverse('universidad-list'), data2, format='json')
        url = reverse('universidad-list')
        response = self.client.get(url)
        url2 = reverse('universidad-detail', args=[2])
        response2 = self.client.get(url2)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        self.assertEqual(response2.data['nombre'], 'Universidad de Antioquia')

    def test_get_buscar_universidad(self):

        self.client.post(reverse('universidad-list'), self.data, format='json')
        url = reverse('universidad-detail', args=[1])
        response = self.client.get(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nombre'], 'Universidad de Costa Rica')

    def test_delete_universidad(self):

        self.client.post(reverse('universidad-list'), self.data, format='json')
        url = reverse('universidad-detail', args=[1])
        response = self.client.delete(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Universidad.objects.count(), 0)