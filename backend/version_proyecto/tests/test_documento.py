from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from ..models import Documento
from django.contrib.auth.models import Group
from usuario_personalizado.models import Usuario
from django.core.files.uploadedfile import SimpleUploadedFile

class DocumentoTests(APITestCase):

    def setUp(self):

        # Crea el usuario de prueba usando el modelo personalizado
        self.user = Usuario.objects.create_user(correo='testuser@example.com', password='testpassword')
        admin_group, created = Group.objects.get_or_create(name='administrador')
        self.user.groups.add(admin_group)
        self.token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        file = SimpleUploadedFile("documento.pdf", b"doc prueba")

        # Crea los datos de Prueba
        self.data = {
            'tipo': 'tipo',
            'detalle': 'Detalle de documento',
            'documento': file
        }
    
    def test_post_documento(self):

        url = reverse('documento-list')
        response = self.client.post(url, self.data, format='multipart')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Documento.objects.count(), 1)
        self.assertEqual(Documento.objects.get().detalle, 'Detalle de documento')

    def test_put_documento(self):
        file2 = SimpleUploadedFile("documentoEdit.pdf", b"Documento editado")

        # Datos actualizados
        update_data = {
            'tipo': 'tipo 2',
            'detalle': 'Detalle de documento editado',
            'documento': file2
        }

        self.client.post(reverse('documento-list'), self.data, format='multipart')
        url = reverse('documento-detail', args=[1])
        response = self.client.put(url, update_data, format='multipart')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Documento.objects.get().detalle, 'Detalle de documento editado')

    def test_get_lista_documentos(self):
        file2 = SimpleUploadedFile("documentoPut2.pdf", b"documento 2")

        # Creando datos de prueba 2
        data2 = {
            'tipo': 'tipo 2',
            'detalle': 'Otro detalle',
            'documento': file2
        }

        data3 = {
            'tipo': 'tipo 3',
            'detalle': 'Detalle Duplicado',
            'documento': file2
        }

        self.client.post(reverse('documento-list'), self.data, format='multipart')
        self.client.post(reverse('documento-list'), data2, format='multipart')
        url = reverse('documento-list')
        response = self.client.get(url)
        response2 = self.client.post(reverse('documento-list'), data3, format='multipart')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[1]['detalle'], 'Otro detalle')
        self.assertEqual(response.data[1]['tipo'], 'tipo 2')
        self.assertEqual(response2.status_code, status.HTTP_400_BAD_REQUEST)\
    
    def test_get_buscar_documento(self):

        self.client.post(reverse('documento-list'), self.data, format='multipart')
        url = reverse('documento-detail', args=[1])
        response = self.client.get(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['detalle'], 'Detalle de documento')

    def test_delete_documento(self):

        self.client.post(reverse('documento-list'), self.data, format='multipart')
        url = reverse('documento-detail', args=[1])
        response = self.client.delete(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Documento.objects.count(), 0)