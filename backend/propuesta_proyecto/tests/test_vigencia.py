from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from ..models import Vigencia
from django.contrib.auth.models import Group
from datetime import datetime
import pytz
from usuario_personalizado.models import Usuario

class VigenciaTests(APITestCase):

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
            'fecha_inicio': '2023-09-04T15:30:00',
            'fecha_fin': '2024-09-04T12:45:00'
        }

    def test_post_vigencia(self):

        url = reverse('vigencia-list')
        response = self.client.post(url, self.data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Vigencia.objects.count(), 1)
        utc = pytz.UTC
        self.assertEqual(Vigencia.objects.get().fecha_inicio, utc.localize(datetime(2023, 9, 4, 15, 30)))
        self.assertEqual(Vigencia.objects.get().fecha_fin, utc.localize(datetime(2024, 9, 4, 12, 45)))


    def test_put_vigencia(self):

        # Datos actualizados
        update_data = {
            'fecha_inicio': '2019-12-12T06:00:00',
            'fecha_fin': '2020-01-01T03:20:00'
        }

        self.client.post(reverse('vigencia-list'), self.data, format='json')
        url = reverse('vigencia-detail', args=[1])
        response = self.client.put(url, update_data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        utc = pytz.UTC
        self.assertEqual(Vigencia.objects.get().fecha_inicio, utc.localize(datetime(2019, 12, 12, 6, 0)))
        self.assertEqual(Vigencia.objects.get().fecha_fin, utc.localize(datetime(2020, 1, 1, 3, 20)))


    def test_get_lista_vigencias(self):
       
        #Carga de datos 2
        data2 = {
            'fecha_inicio': '2001-02-04T15:30:00',
            'fecha_fin': '2005-11-04T12:45:00'
        }

        self.client.post(reverse('vigencia-list'), self.data, format='json')
        self.client.post(reverse('vigencia-list'), data2, format='json')
        url = reverse('vigencia-list')
        response = self.client.get(url)
        url2 = reverse('vigencia-detail', args=[2])
        response2 = self.client.get(url2)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        self.assertEqual(response2.data['fecha_inicio'], '2001-02-04T15:30:00Z')
        self.assertEqual(response2.data['fecha_fin'], '2005-11-04T12:45:00Z')

    def test_get_buscar_vigencia(self):

        self.client.post(reverse('vigencia-list'), self.data, format='json')
        url = reverse('vigencia-detail', args=[1])
        response = self.client.get(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['fecha_inicio'],  '2023-09-04T15:30:00Z')
        self.assertEqual(response.data['fecha_fin'],  '2024-09-04T12:45:00Z')


    def test_delete_vigencia(self):

        self.client.post(reverse('vigencia-list'), self.data, format='json')
        url = reverse('vigencia-detail', args=[1])
        response = self.client.delete(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Vigencia.objects.count(), 0)