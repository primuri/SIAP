from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from ..models import Autor
from django.contrib.auth.models import Group
from usuario_personalizado.models import Usuario

class AutorTests(APITestCase):

    def setUp(self):

        # Crea el usuario de prueba usando el modelo personalizado
        self.user = Usuario.objects.create_user(correo='testuser@example.com', password='testpassword')
        admin_group, created = Group.objects.get_or_create(name='administrador')
        self.user.groups.add(admin_group)
        self.token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        # Crea los datos de Prueba
        self.nombre = {
            'nombre': 'Juan',
            'apellido': 'Perez',
            'segundo_apellido': 'Rodriguez'
        }

        self.data = {
            'id_nombre_completo_fk': self.nombre
        }

    def test_post_autor(self):

        url = reverse('autor-list')
        response = self.client.post(url, self.data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Autor.objects.count(), 1)
        self.assertEqual(Autor.objects.get().id_nombre_completo_fk.nombre, 'Juan')

    def test_put_autor(self):

        # Datos actualizados
        nombre2 = {
            'nombre': 'Juanito',
            'apellido': 'Peralta',
            'segundo_apellido': 'Farias'
        }


        update_data = {
             'id_nombre_completo_fk': nombre2
        }

        self.client.post(reverse('autor-list'), self.data, format='json')
        url = reverse('autor-detail', args=[1])
        response = self.client.put(url, update_data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Autor.objects.get().id_nombre_completo_fk.nombre, 'Juanito')

    def test_get_lista_autores(self):
       
        #Carga de datos 2
        nombre = {
            'nombre': 'Ariel',
            'apellido': 'Granda',
            'segundo_apellido': 'Paez'
        }

        data2 = {
            'id_nombre_completo_fk': nombre
        }

        self.client.post(reverse('autor-list'), self.data, format='json')
        self.client.post(reverse('autor-list'), data2, format='json')
        url = reverse('autor-list')
        response = self.client.get(url)
        url2 = reverse('autor-detail', args=[2])
        response2 = self.client.get(url2)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        self.assertEqual(response2.data['id_nombre_completo_fk']['nombre'], 'Ariel')

    def test_get_buscar_autor(self):

        self.client.post(reverse('autor-list'), self.data, format='json')
        url = reverse('autor-detail', args=[1])
        response = self.client.get(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id_nombre_completo_fk']['nombre'], 'Juan')

    def test_delete_autor(self):

        self.client.post(reverse('autor-list'), self.data, format='json')
        url = reverse('autor-detail', args=[1])
        response = self.client.delete(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Autor.objects.count(), 0)