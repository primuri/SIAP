from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from ..models import Area
from django.contrib.auth.models import Group
from usuario_personalizado.models import Usuario

class AreaTests(APITestCase):

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
    
    def test_post_area(self):

        url = reverse('area-list')
        response = self.client.post(url, self.data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Area.objects.count(), 1)
        self.assertEqual(Area.objects.get().nombre, 'Arte')

    def test_put_area(self):
        # Datos actualizados
        update_data = {
            'nombre': 'Ciencias'
        }

        self.client.post(reverse('area-list'), self.data, format='json')
        url = reverse('area-detail', args=[1])
        response = self.client.put(url, update_data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Area.objects.get().nombre, 'Ciencias')

    def test_get_lista_areas(self):
      
        data2 = {
            'nombre': 'Danza'
        }

        self.client.post(reverse('area-list'), self.data, format='json')
        self.client.post(reverse('area-list'), data2, format='json')
        url = reverse('area-list')
        response = self.client.get(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[1]['nombre'], 'Danza')
    
    def test_get_buscar_area(self):

        self.client.post(reverse('area-list'), self.data, format='json')
        url = reverse('area-detail', args=[1])
        response = self.client.get(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nombre'], 'Arte')

    def test_delete_area(self):
        self.client.post(reverse('area-list'), self.data, format='json')
        url = reverse('area-detail', args=[1])
        response = self.client.delete(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Area.objects.count(), 0)