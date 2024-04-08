from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from ..models import Factura
from django.contrib.auth.models import Group
from usuario_personalizado.models import Usuario
from django.core.files.uploadedfile import SimpleUploadedFile


class FacturaTests(APITestCase):

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

        self.producto_servicio = {
            'id_producto_servicio' : '12',
            'detalle': 'Pintura'
        }

        response =self.client.post(reverse('proveedor-list'), self.proveedor, format='json')
        self.proveedor_id = response.data['id_cedula_proveedor']

        response =self.client.post(reverse('productoservicio-list'), self.producto_servicio, format='json')
        self.producto_servicio_id = response.data['id_producto_servicio']

        self.data = {
            'id_cedula_proveedor_fk': self.proveedor_id,
            'id_producto_servicio_fk' : self.producto_servicio_id
        }

    def test_post_factura(self):

        url = reverse('factura-list')
        response = self.client.post(url, self.data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Factura.objects.count(), 1)
        self.assertEqual(Factura.objects.get().id_producto_servicio_fk.detalle, 'Pintura')
    
    def test_put_factura(self):

        producto_servicio2 = {
            'id_producto_servicio' : '11',
            'detalle': 'Marco'
        }
        response =self.client.post(reverse('productoservicio-list'), producto_servicio2, format='json')
        producto_servicio_id2 = response.data['id_producto_servicio']

        update_data = {
            'id_cedula_proveedor_fk': self.proveedor_id,
            'id_producto_servicio_fk' : producto_servicio_id2
        }
        
        self.client.post(reverse('factura-list'), self.data, format='json')
        url = reverse('factura-detail', args=[1])
        response = self.client.put(url, update_data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Factura.objects.get().id_producto_servicio_fk.detalle, 'Marco')
    
    def test_get_lista_facturas(self):
         
        producto_servicio3 = {
            'id_producto_servicio' : '13',
            'detalle': 'Cuadro'
        }
        response =self.client.post(reverse('productoservicio-list'), producto_servicio3, format='json')
        producto_servicio_id3 = response.data['id_producto_servicio']

        data2 = {
            'id_cedula_proveedor_fk': self.proveedor_id,
            'id_producto_servicio_fk' : producto_servicio_id3
        }
      

        self.client.post(reverse('factura-list'), self.data, format='json')
        self.client.post(reverse('factura-list'), data2, format='json')
        url = reverse('factura-list')
        response = self.client.get(url)
        url2 = reverse('factura-detail', args=[2])
        response2 = self.client.get(url2)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        self.assertEqual(response2.data['id_producto_servicio_fk']['detalle'], 'Cuadro')

        
    def test_get_buscar_factura(self):

        self.client.post(reverse('factura-list'), self.data, format='json')
        url = reverse('factura-detail', args=[1])
        response = self.client.get(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id_producto_servicio_fk']['detalle'], 'Pintura')

    def test_delete_factura(self):
        
        self.client.post(reverse('factura-list'), self.data, format='json')
        url = reverse('factura-detail', args=[1])
        response = self.client.delete(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Factura.objects.count(), 0)
