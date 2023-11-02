from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from ..models import TipoPresupuesto
from django.contrib.auth.models import Group
from usuario_personalizado.models import Usuario

class TipoPresupuestoTests(APITestCase):

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
            'tipo': 'Arte',
            'detalle': 'detalle'
        }
    
    def test_post_tipo_presupuesto(self):

        url = reverse('tipopresupuesto-list')
        response = self.client.post(url, self.data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(TipoPresupuesto.objects.count(), 1)
        self.assertEqual(TipoPresupuesto.objects.get().tipo, 'Arte')

    def test_put_tipo_presupuesto(self):
        # Datos actualizados
        update_data = {
            'tipo': 'Ciencias',
            'detalle': 'detalle'
        }

        self.client.post(reverse('tipopresupuesto-list'), self.data, format='json')
        url = reverse('tipopresupuesto-detail', args=[1])
        response = self.client.put(url, update_data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(TipoPresupuesto.objects.get().tipo, 'Ciencias')

    def test_get_lista_tipo_presupuestos(self):
      
        data2 = {
            'tipo': 'Danza',
            'detalle': 'detalle 2'
        }

        self.client.post(reverse('tipopresupuesto-list'), self.data, format='json')
        self.client.post(reverse('tipopresupuesto-list'), data2, format='json')
        url = reverse('tipopresupuesto-list')
        response = self.client.get(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[1]['tipo'], 'Danza')
    
    def test_get_buscar_tipo_presupuesto(self):

        self.client.post(reverse('tipopresupuesto-list'), self.data, format='json')
        url = reverse('tipopresupuesto-detail', args=[1])
        response = self.client.get(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['tipo'], 'Arte')

    def test_delete_area(self):
        self.client.post(reverse('tipopresupuesto-list'), self.data, format='json')
        url = reverse('tipopresupuesto-detail', args=[1])
        response = self.client.delete(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(TipoPresupuesto.objects.count(), 0)