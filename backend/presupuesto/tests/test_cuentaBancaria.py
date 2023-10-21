from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from ..models import CuentaBancaria
from django.contrib.auth.models import Group
from usuario_personalizado.models import Usuario

class CuentaBancariaTests(APITestCase):

    def setUp(self):

        # Crea el usuario de prueba usando el modelo personalizado
        self.user = Usuario.objects.create_user(correo='testuser@example.com', password='testpassword')
        admin_group, created = Group.objects.get_or_create(name='administrador')
        self.user.groups.add(admin_group)
        self.token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        # Crea los datos de Prueba relacionados

        self.proveedor_data = {
            'id_cedula_proveedor': '207270492',
            'correo': 'wendy.carballo.chavarria@est.una.ac.cr',
            'nombre': 'Wendy Carballo',
            'telefono': '85593522'
        }

        response = self.client.post(reverse('proveedor-list'), self.proveedor_data, format='json')
        self.proveedor_id = response.data['id_cedula_proveedor']

        # Crea los datos de Prueba
        self.data = {
            'id_proveedor_fk': self.proveedor_id,
            'id_numero': 1111111,
            'banco': 'BCR',
            'tipo': 'Ahorros',
            'moneda': 'Dolares',
            'cuenta_principal': True
        }
        

    def test_post_cuenta_bancaria(self):

        url = reverse('cuentaBancaria-list')
        response = self.client.post(url, self.data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CuentaBancaria.objects.count(), 1)
        self.assertEqual(CuentaBancaria.objects.get().banco, 'BCR')
        self.assertEqual(CuentaBancaria.objects.get().tipo, 'Ahorros')
        self.assertEqual(CuentaBancaria.objects.get().moneda, 'Dolares')

    def test_put_cuenta_bancaria(self):

        # Datos actualizados
        update_data = {
            'id_proveedor_fk': self.proveedor_id,
            'id_numero': 1111111,
            'banco': 'BAC',
            'tipo': 'Corriente',
            'moneda': 'Colones',
            'cuenta_principal': True
        }

        self.client.post(reverse('cuentaBancaria-list'), self.data, format='json')
        url = reverse('cuentaBancaria-detail', args=[1])
        response = self.client.put(url, update_data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(CuentaBancaria.objects.get().banco, 'BAC')
        self.assertEqual(CuentaBancaria.objects.get().tipo, 'Corriente')
        self.assertEqual(CuentaBancaria.objects.get().moneda, 'Colones')

    def test_get_lista_cuenta_bancaria(self):
       
        
        # Crea los datos de Prueba relacionados

        proveeedor_data2 = {
            'id_cedula_proveedor': '207720223',
            'correo': 'wendy_carballo@ymail.com',
            'nombre': 'Wendy Josette Carballo',
            'telefono': '85593544'
        }

        response_proveeedor = self.client.post(reverse('proveedor-list'), proveeedor_data2, format='json')

        # Creando datos de prueba 2
        data2 = {
            'id_proveedor_fk': response_proveeedor.data['id_cedula_proveedor'],
            'id_numero': 1111111,
            'banco': 'BAC',
            'tipo': 'Corriente',
            'moneda': 'Colones',
            'cuenta_principal': True
        }

        data3 = {
            'id_proveedor_fk': response_proveeedor.data['id_cedula_proveedor'],
            'id_numero': 2222222,
            'banco': 'BCR',
            'tipo': 'Ahorros',
            'moneda': 'Dolares',
            'cuenta_principal': False
        }

        data4 = {
            'id_proveedor_fk': response_proveeedor.data['id_cedula_proveedor'],
            'id_numero': 1111111,
            'banco': 'BAC',
            'tipo': 'Corriente',
            'moneda': 'Colones',
            'cuenta_principal': True
        }
        
        self.client.post(reverse('cuentaBancaria-list'), self.data, format='json')
        self.client.post(reverse('cuentaBancaria-list'), data2, format='json')
        url = reverse('cuentaBancaria-list')
        response = self.client.get(url)
        response3 = self.client.post(reverse('cuentaBancaria-list'), data3, format='json')
        response4 = self.client.post(reverse('cuentaBancaria-list'), data4, format='json')
        

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response3.status_code, status.HTTP_200_OK)
        self.assertEqual(response4.status_code, status.HTTP_400_BAD_REQUEST)
        

    def test_get_buscar_cuenta_bancaria(self):

        self.client.post(reverse('cuentaBancaria-list'), self.data, format='json')
        url = reverse('cuentaBancaria-detail', args=[1])
        response = self.client.get(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id_numero'], 1111111)
        self.assertEqual(response.data['banco'], 'BCR')
        self.assertEqual(response.data['tipo'], 'Ahorros')
        self.assertEqual(response.data['moneda'], 'Dolares')

    def test_delete_cuenta_bancaria(self):

        self.client.post(reverse('cuentaBancaria-list'), self.data, format='json')
        url = reverse('cuentaBancaria-detail', args=[1])
        response = self.client.delete(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(CuentaBancaria.objects.count(), 0)