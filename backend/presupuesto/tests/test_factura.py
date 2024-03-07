from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from ..models import Factura
from django.contrib.auth.models import Group
from usuario_personalizado.models import Usuario

class FacturaTests(APITestCase):

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
            'id_cedula_proveedor' : '207270492',
            'tipo' : 'Fisica',
            'correo' : 'wendy@wendy.com',
            'nombre' : 'Wendy Carballo',
            'telefono' : '85593522',
            'id_documento_fk' : None
        }

        self.producto_servicio_data = {
            'id_producto_servicio' : '100',
            'detalle' : 'Una asistente'
        }

        response = self.client.post(reverse('proveedor-list'), self.proveedor_data, format='json')
        self.proveedor_id = response.data['id_cedula_proveedor']

        response = self.client.post(reverse('productoservicio-list'), self.producto_servicio_data, format='json')
        self.productoservicio_id = response.data['id_producto_servicio'] 

        self.data = {
            'id_cedula_proveedor_fk' : self.proveedor_id,
            'id_producto_servicio_fk' : self.productoservicio_id
        }
    
    def test_post_factura(self):

        url = reverse('factura-list')
        response = self.client.post(url, self.data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Factura.objects.count(), 1)
        self.assertEqual(Factura.objects.get().id_factura, 1)
        self.assertEqual(Factura.objects.get().id_producto_servicio_fk.id_producto_servicio, 100)

    def test_put_factura(self):
        producto_servicio_data3 = {
            'id_producto_servicio' : '150',
            'detalle' : 'Un vendedor'
        }

        response_producto3 = self.client.post(reverse('productoservicio-list'), producto_servicio_data3, format='json')

        # Datos actualizados
        update_data = {
            'id_producto_servicio_fk': response_producto3.data['id_producto_servicio'],
        }

        self.client.post(reverse('factura-list'), self.data, format='json')
        url = reverse('factura-detail', args=[1])
        response = self.client.put(url, update_data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id_producto_servicio_fk']['id_producto_servicio'], 200)


    def test_get_lista_facturas(self):
      
        proveedor_data2 = {
            'id_cedula_proveedor' : '111111111',
            'tipo' : 'Fisica',
            'correo' : 'wendy@wendy.com',
            'nombre' : 'J Carballo',
            'telefono' : '85593522',
            'id_documento_fk' : None
        }

        producto_servicio_data2 = {
            'id_producto_servicio' : '200',
            'detalle' : 'Un vendedor por ahi'
        }

        response_proveedor2 = self.client.post(reverse('proveedor-list'), proveedor_data2, format='json')
        response_producto2 = self.client.post(reverse('productoservicio-list'), producto_servicio_data2, format='json')

        data2 = {
            'id_cedula_proveedor_fk' : response_proveedor2.data['id_cedula_proveedor'],
            'id_producto_servicio_fk' : response_producto2.data['id_producto_servicio']
        }

        self.client.post(reverse('factura-list'), self.data, format='json')
        self.client.post(reverse('factura-list'), data2, format='json')
        url = reverse('factura-list')
        response = self.client.get(url)
        url2 = reverse('factura-detail', args=['2'])
        response2 = self.client.get(url2)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        self.assertEqual(response2.data['id_producto_servicio_fk']['id_producto_servicio'], 200)
        self.assertEqual(response2.data['id_producto_servicio_fk']['detalle'], 'Un vendedor por ahi')
    
    def test_get_buscar_factura(self):

        self.client.post(reverse('factura-list'), self.data, format='json')
        url = reverse('factura-detail', args=['1'])
        response = self.client.get(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id_producto_servicio_fk']['id_producto_servicio'], 100)
        self.assertEqual(response.data['id_producto_servicio_fk']['detalle'], 'Una asistente')

    def test_delete_factura(self):
        self.client.post(reverse('factura-list'), self.data, format='json')
        url = reverse('factura-detail', args=['1'])
        response = self.client.delete(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Factura.objects.count(), 0)