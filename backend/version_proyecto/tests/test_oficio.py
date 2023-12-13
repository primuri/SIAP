from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from ..models import Oficio
from django.contrib.auth.models import Group
from usuario_personalizado.models import Usuario
from django.core.files.uploadedfile import SimpleUploadedFile

class OficioTests(APITestCase):

    def setUp(self):

        # Crea el usuario de prueba usando el modelo personalizado
        self.user = Usuario.objects.create_user(correo='testuser@example.com', password='testpassword')
        admin_group, created = Group.objects.get_or_create(name='administrador')
        self.user.groups.add(admin_group)
        self.token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        file = SimpleUploadedFile("oficio.pdf", b"content of the pdf")

        # Crea los datos de Prueba
        self.data = {
            'detalle': 'Detalle de oficio',
            'ruta_archivo': file
        }
    
    def test_post_oficio(self):

        url = reverse('oficio-list')
        response = self.client.post(url, self.data, format='multipart')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Oficio.objects.count(), 1)
        self.assertEqual(Oficio.objects.get().detalle, 'Detalle de oficio')

    def test_put_oficio(self):
        file2 = SimpleUploadedFile("oficioEdit.pdf", b"Oficio editado")

        # Datos actualizados
        update_data = {
            'detalle': 'Detalle de oficio editado',
            'ruta_archivo': file2
        }

        self.client.post(reverse('oficio-list'), self.data, format='multipart')
        url = reverse('oficio-detail', args=[1])
        response = self.client.put(url, update_data, format='multipart')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Oficio.objects.get().detalle, 'Detalle de oficio editado')

    def test_get_lista_oficios(self):
        file2 = SimpleUploadedFile("oficio2.pdf", b"oficio 2")

        # Creando datos de prueba 2
        data2 = {
            'detalle': 'Otro detalle',
            'ruta_archivo': file2
        }

        data3 = {
            'detalle': 'Detalle Duplicado',
            'ruta_archivo': file2
        }

        self.client.post(reverse('oficio-list'), self.data, format='multipart')
        self.client.post(reverse('oficio-list'), data2, format='multipart')
        url = reverse('oficio-list')
        response = self.client.get(url)
        response2 = self.client.post(reverse('oficio-list'), data3, format='multipart')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[1]['detalle'], 'Otro detalle')
        self.assertEqual(response2.status_code, status.HTTP_400_BAD_REQUEST)\
    
    def test_get_buscar_oficio(self):

        self.client.post(reverse('oficio-list'), self.data, format='multipart')
        url = reverse('oficio-detail', args=[1])
        response = self.client.get(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['detalle'], 'Detalle de oficio')

    def test_delete_oficio(self):

        self.client.post(reverse('oficio-list'), self.data, format='multipart')
        url = reverse('oficio-detail', args=[1])
        response = self.client.delete(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Oficio.objects.count(), 0)