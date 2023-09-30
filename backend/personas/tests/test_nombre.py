from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from ..models import NombreCompleto
from django.contrib.auth.models import Group
from usuario_personalizado.models import Usuario

class NombreCompletoTests(APITestCase):

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
            'nombre': 'Juan',
            'apellido': 'Perez',
            'segundo_apellido': 'Rodriguez'
        }

    def test_post_nombre_completo(self):

        url = reverse('nombrecompleto-list')
        response = self.client.post(url, self.data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(NombreCompleto.objects.count(), 1)
        self.assertEqual(NombreCompleto.objects.get().nombre, 'Juan')

    def test_put_nombre_completo(self):

        # Datos actualizados
        update_data = {
            'nombre': 'Juanito',
            'apellido': 'Peralta',
            'segundo_apellido': 'Farias'
        }

        self.client.post(reverse('nombrecompleto-list'), self.data, format='json')
        url = reverse('nombrecompleto-detail', args=[1])
        response = self.client.put(url, update_data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(NombreCompleto.objects.get().nombre, 'Juanito')

    def test_get_lista_nombres_completos(self):
       
        #Carga de datos 2
        data2 = {
            'nombre': 'Ariel',
            'apellido': 'Granda',
            'segundo_apellido': 'Paez'
        }

        self.client.post(reverse('nombrecompleto-list'), self.data, format='json')
        self.client.post(reverse('nombrecompleto-list'), data2, format='json')
        url = reverse('nombrecompleto-list')
        response = self.client.get(url)
        url2 = reverse('nombrecompleto-detail', args=[2])
        response2 = self.client.get(url2)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        self.assertEqual(response2.data['nombre'], 'Ariel')

    def test_get_buscar_nombre_completo(self):

        self.client.post(reverse('nombrecompleto-list'), self.data, format='json')
        url = reverse('nombrecompleto-detail', args=[1])
        response = self.client.get(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nombre'], 'Juan')

    def test_delete_nombre_completo(self):

        self.client.post(reverse('nombrecompleto-list'), self.data, format='json')
        url = reverse('nombrecompleto-detail', args=[1])
        response = self.client.delete(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(NombreCompleto.objects.count(), 0)