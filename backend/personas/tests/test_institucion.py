from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from ..models import Institucion
from django.contrib.auth.models import Group
from usuario_personalizado.models import Usuario

class InstitucionTests(APITestCase):

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
            'nombre': 'UCR'
        }
    
    def test_post_institucion(self):

        url = reverse('institucion-list')
        response = self.client.post(url, self.data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Institucion.objects.count(), 1)
        self.assertEqual(Institucion.objects.get().nombre, 'UCR')

    def test_put_institucion(self):
        # Datos actualizados
        update_data = {
            'nombre': 'UNA'
        }

        self.client.post(reverse('institucion-list'), self.data, format='json')
        url = reverse('institucion-detail', args=[1])
        response = self.client.put(url, update_data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Institucion.objects.get().nombre, 'UNA')

    def test_get_lista_institucion(self):
      
        data2 = {
            'nombre': 'TEC'
        }

        self.client.post(reverse('institucion-list'), self.data, format='json')
        self.client.post(reverse('institucion-list'), data2, format='json')
        url = reverse('institucion-list')
        response = self.client.get(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[1]['nombre'], 'TEC')
    
    def test_get_buscar_institucion(self):

        self.client.post(reverse('institucion-list'), self.data, format='json')
        url = reverse('institucion-detail', args=[1])
        response = self.client.get(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nombre'], 'UCR')

    def test_delete_institucion(self):
        self.client.post(reverse('institucion-list'), self.data, format='json')
        url = reverse('institucion-detail', args=[1])
        response = self.client.delete(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Institucion.objects.count(), 0)