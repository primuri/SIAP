from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from ..models import CuentaBancaria
from django.contrib.auth.models import Group
from usuario_personalizado.models import Usuario
from django.core.files.uploadedfile import SimpleUploadedFile


class CuentaBancariaTests(APITestCase):

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

        self.proveedor = {
            'id_cedula_proveedor': '123456789',
            'tipo' : 'Juridico',
            'correo': '1234@gmail.com',
            'nombre' : 'Sillas',
            'telefono' : '8888888',
            'id_documento_fk': self.documento_id
        }

        response =self.client.post(reverse('proveedor-list'), self.proveedor, format='json')
        self.proveedor_id = response.data['id_cedula_proveedor']

        self.data = {
            'id_numero' : '123' ,
            'banco': 'BCR',
            'tipo' : 'Corriente',
            'moneda' : 'Colones',
            'cuenta_principal': 'True',
            'id_proveedor_fk': self.proveedor_id
        }

    def test_post_cuenta_bancaria(self):

        url = reverse('cuentabancaria-list')
        response = self.client.post(url, self.data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CuentaBancaria.objects.count(), 1)
        self.assertEqual(CuentaBancaria.objects.get().banco, 'BCR')
    
    def test_put_cuenta_bancaria(self):
        update_data = {
            'id_numero' : '123' ,
            'banco': 'BN',
            'tipo' : 'Ahorros',
            'moneda' : 'Dolares',
            'cuenta_principal': 'True',
            'id_proveedor_fk': self.proveedor_id
        }
        
        self.client.post(reverse('cuentabancaria-list'), self.data, format='json')
        url = reverse('cuentabancaria-detail', args=['123'])
        response = self.client.put(url, update_data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(CuentaBancaria.objects.get().banco, 'BN')
    
    def test_get_lista_cuentas_bancarias(self):
        file2 = SimpleUploadedFile("documento2.pdf", b"content of the pdf2")

        # Crea los datos de Prueba
        documento2 = {
            'detalle': 'Detalle de documento2',
            'tipo': 'Acceso2',
            'documento': file2
        }

        response = self.client.post(reverse('documento-list'), documento2, format='multipart')
        documento_id2 = response.data['id_documento']
    
        proveedor2 = {
            'id_cedula_proveedor': '987654321',
            'tipo' : 'Juridica',
            'correo': '94535@gmail.com',
            'nombre' : 'Casas',
            'telefono' : '999999',
            'id_documento_fk': documento_id2
        }

        response =self.client.post(reverse('proveedor-list'), proveedor2, format='json')
        proveedor_id2 = response.data['id_cedula_proveedor']

        data2 = {
            'id_numero' : '456' ,
            'banco': 'BN',
            'tipo' : 'Ahorros',
            'moneda' : 'Dolares',
            'cuenta_principal': 'True',
            'id_proveedor_fk': proveedor_id2
        }

        self.client.post(reverse('cuentabancaria-list'), self.data, format='json')
        self.client.post(reverse('cuentabancaria-list'), data2, format='json')
        url = reverse('cuentabancaria-list')
        response = self.client.get(url)
        url2 = reverse('cuentabancaria-detail', args=['456'])
        response2 = self.client.get(url2)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        self.assertEqual(response2.data['moneda'], 'Dolares')

        
    def test_get_buscar_cuenta_bancaria(self):

        self.client.post(reverse('cuentabancaria-list'), self.data, format='json')
        url = reverse('cuentabancaria-detail', args=['123'])
        response = self.client.get(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['tipo'], 'Corriente')

    def test_delete_cuenta_bancaria(self):
        
        self.client.post(reverse('cuentabancaria-list'), self.data, format='json')
        url = reverse('cuentabancaria-detail', args=['123'])
        response = self.client.delete(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(CuentaBancaria.objects.count(), 0)