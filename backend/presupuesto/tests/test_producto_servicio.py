from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from ..models import ProductoServicio
from django.contrib.auth.models import Group
from usuario_personalizado.models import Usuario

class ProductoServicioTests(APITestCase):

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
            'id_producto_servicio' : '12',
            'detalle': 'Pintura'
        }
    
    def test_post_producto_servicio(self):

        url = reverse('productoservicio-list')
        response = self.client.post(url, self.data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ProductoServicio.objects.count(), 1)
        self.assertEqual(ProductoServicio.objects.get().detalle, 'Pintura')

    def test_put_producto_servicio(self):
        # Datos actualizados
        update_data = {
            'id_producto_servicio' : '12',
            'detalle': 'Marco'
        }

        self.client.post(reverse('productoservicio-list'), self.data, format='json')
        url = reverse('productoservicio-detail', args=['12'])
        response = self.client.put(url, update_data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(ProductoServicio.objects.get().detalle, 'Marco')

    def test_get_lista_producto_servicio(self):
      
        data2 = {
            'id_producto_servicio' : '15',
            'detalle': 'Escultura'
        }

        self.client.post(reverse('productoservicio-list'), self.data, format='json')
        self.client.post(reverse('productoservicio-list'), data2, format='json')
        url = reverse('productoservicio-list')
        response = self.client.get(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[1]['detalle'], 'Escultura')
    
    def test_get_buscar_producto_servicio(self):

        self.client.post(reverse('productoservicio-list'), self.data, format='json')
        url = reverse('productoservicio-detail', args=['12'])
        response = self.client.get(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['detalle'], 'Pintura')

    def test_delete_producto_servicio(self):
        self.client.post(reverse('productoservicio-list'), self.data, format='json')
        url = reverse('productoservicio-detail', args=['12'])
        response = self.client.delete(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(ProductoServicio.objects.count(), 0)