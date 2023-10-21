from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User, Group
from ..models import Proveedor
from usuario_personalizado.models import Usuario

class ProveedorTests(APITestCase):

    def setUp(self):

        # Crea el usuario de prueba usando el modelo personalizado
        self.user = Usuario.objects.create_user(correo='testuser@example.com', password='testpassword')
        admin_group, created = Group.objects.get_or_create(name='administrador')
        self.user.groups.add(admin_group)
        self.token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        # Crea los datos de Prueba relacionados

        self.data = {
            'id_cedula_proveedor': '207270492',
            'correo': 'wendy.carballo.chavarria@est.una.ac.cr',
            'nombre': 'Wendy Carballo',
            'telefono': '85593522'
        }


    def test_post_proveedor(self):

        url = reverse('proveedor-list')
        response = self.client.post(url, self.data, format='json')
        

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Proveedor.objects.count(), 1)
        self.assertEqual(Proveedor.objects.get().id_cedula_proveedor, '207270492')
   
    def test_put_proveedor(self):
        
        self.client.post(reverse('proveedor-list'), self.data, format='json')

        # Datos actualizados
        update_data = {
            'id_cedula_proveedor': '207270492',
            'correo': 'wendy_carballo@ymail.com',
            'nombre': 'Wendy Josette Carballo',
            'telefono': '85593522'
        }

        
        url = reverse('proveedor-detail', args=[1])
        response = self.client.put(url, update_data, format='json')
        proveedor = Proveedor.objects.get(id_cedula_proveedor='207270492')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(proveedor.nombre, 'Wendy Josette Carballo')
        self.assertEqual(proveedor.correo, 'wendy_carballo@ymail.com')

    def test_get_lista_proveedores(self):

        # Creando datos de prueba 2
        data2 = {
            'id_cedula_proveedor': '207270492',
            'correo': 'wendy.carballo.chavarria@est.una.ac.cr',
            'nombre': 'Wendy Carballo',
            'telefono': '85593522'
        }

        data3 = {
            'id_cedula_proveedor': '207270492',
            'correo': 'wendy_carballo@ymail.com',
            'nombre': 'Josette Carballo',
            'telefono': '85593522'
        }

        self.client.post(reverse('proveedor-list'), self.data, format='json')
        self.client.post(reverse('proveedor-list'), data2, format='json')
        url = reverse('proveedor-list')
        response = self.client.get(url)
        response2 = self.client.post(reverse('proveedor-list'), data3, format='json')
         
        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response2.status_code, status.HTTP_400_BAD_REQUEST) # Evalua  que la cedula sea unique
        self.assertIn('id_cedula_proveedor', response2.data)  

    def test_get_buscar_proveedor(self):

        self.client.post(reverse('proveedor-list'), self.data, format='json')
        url = reverse('proveedor-detail', args=[1])
        response = self.client.get(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id_cedula_proveedor'], '207270492')

    def test_delete_proveedor(self):
       
        self.client.post(reverse('proveedor-list'), self.data, format='json')
        url = reverse('proveedor-detail', args=[1])
        response = self.client.delete(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Proveedor.objects.count(), 0)