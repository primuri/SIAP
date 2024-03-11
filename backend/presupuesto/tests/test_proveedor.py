from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from ..models import Proveedor
from django.contrib.auth.models import Group
from usuario_personalizado.models import Usuario
from django.core.files.uploadedfile import SimpleUploadedFile


class ProveedorTests(APITestCase):

    def setUp(self):

        # Crea el usuario de prueba usando el modelo personalizado
        self.user = Usuario.objects.create_user(correo='testuser@example.com', password='testpassword')
        admin_group, created = Group.objects.get_or_create(name='administrador')
        self.user.groups.add(admin_group)
        self.token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
    
        file = SimpleUploadedFile("documento1.pdf", b"content of the pdf")

        # Crea los datos de Prueba
        self.documento = {
            'detalle': 'Detalle de documento',
            'tipo': 'Acceso',
            'documento': file
        }

        response =self.client.post(reverse('documento-list'), self.documento, format='multipart')
        self.documento_id = response.data['id_documento']

        self.data = {
            'id_cedula_proveedor': '123456789',
            'tipo' : 'Juridico',
            'correo': '1234@gmail.com',
            'nombre' : 'Sillas',
            'telefono' : '8888888',
            'id_documento_fk': self.documento_id
        }

    def test_post_proveedor(self):

        url = reverse('proveedor-list')
        response = self.client.post(url, self.data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Proveedor.objects.count(), 1)
        self.assertEqual(Proveedor.objects.get().id_cedula_proveedor, '123456789')
    
    def test_put_proveedor(self):
        file2 = SimpleUploadedFile("documento2.pdf", b"content of the pdf2")

        # Crea los datos de Prueba
        documento2 = {
            'detalle': 'Detalle de documento2',
            'tipo': 'Acceso2',
            'documento': file2
        }

        response = self.client.post(reverse('documento-list'), documento2, format='multipart')
        documento_id2 = response.data['id_documento']
    

        update_data = {
            'id_cedula_proveedor': '123456789',
            'tipo' : 'Fisica',
            'correo': '98765@gmail.com',
            'nombre' : 'Mesas',
            'telefono' : '55555',
            'id_documento_fk': documento_id2
        }
        
        self.client.post(reverse('proveedor-list'), self.data, format='json')
        url = reverse('proveedor-detail', args=['123456789'])
        response = self.client.put(url, update_data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Proveedor.objects.get().nombre, 'Mesas')
    
    def test_get_lista_proveedores(self):
        file2 = SimpleUploadedFile("documento2.pdf", b"content of the pdf2")

        # Crea los datos de Prueba
        documento2 = {
            'detalle': 'Detalle de documento2',
            'tipo': 'Acceso2',
            'documento': file2
        }

        response = self.client.post(reverse('documento-list'), documento2, format='multipart')
        documento_id2 = response.data['id_documento']
    
        data2 = {
            'id_cedula_proveedor': '987654321',
            'tipo' : 'Juridica',
            'correo': '94535@gmail.com',
            'nombre' : 'Casas',
            'telefono' : '999999',
            'id_documento_fk': documento_id2
        }

        self.client.post(reverse('proveedor-list'), self.data, format='json')
        self.client.post(reverse('proveedor-list'), data2, format='json')
        url = reverse('proveedor-list')
        response = self.client.get(url)
        url2 = reverse('proveedor-detail', args=['987654321'])
        response2 = self.client.get(url2)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        self.assertEqual(response2.data['telefono'], '999999')

        
    def test_get_buscar_proveedor(self):

        self.client.post(reverse('proveedor-list'), self.data, format='json')
        url = reverse('proveedor-detail', args=['123456789'])
        response = self.client.get(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nombre'], 'Sillas')

    def test_delete_proveedor(self):
        
        self.client.post(reverse('proveedor-list'), self.data, format='json')
        url = reverse('proveedor-detail', args=['123456789'])
        response = self.client.delete(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Proveedor.objects.count(), 0)
