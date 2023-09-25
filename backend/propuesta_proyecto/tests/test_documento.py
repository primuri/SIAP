from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from ..models import DocumentoAsociado, PropuestaProyecto
from django.contrib.auth.models import Group

class DocumentoAsociadoTests(APITestCase):

    def setUp(self):

        # Crea el usuario de prueba
        self.user = User.objects.create_user(username='testuser', password='testpassword', is_staff=True, is_superuser=True)
        admin_group, created = Group.objects.get_or_create(name='administrador')
        self.user.groups.add(admin_group)
        self.token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        # Crea los datos de Prueba relacionados
        self.propuesta_proyecto_data = {
            'id_codigo_cimpa': 'ABC123',
            'detalle': 'Detalle de propuesta',
            'estado': 'Pendiente',
            'nombre': 'Propuesta 1',
            'descripcion': 'Descripción de la propuesta',
            'fecha_vigencia': '2023-09-24T15:30:00',
            'actividad': 'Actividad de la propuesta'
        }

        response = self.client.post(reverse('propuestaproyecto-list'), self.propuesta_proyecto_data, format='json')
        self.propuesta_proyecto_id = response.data['id_codigo_cimpa']

        # Crea los datos de Prueba
        self.data = {
            'detalle': 'Detalle de documento',
            'documento': 'Enlace/documento1.pdf',
            'id_codigo_cimpa_fk': self.propuesta_proyecto_id
        }

    def test_post_documento_asociado(self):

        url = reverse('documentoasociado-list')
        response = self.client.post(url, self.data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(DocumentoAsociado.objects.count(), 1)
        self.assertEqual(DocumentoAsociado.objects.get().detalle, 'Detalle de documento')

    def test_put_documento_asociado(self):

        # Datos actualizados
        update_data = {
            'detalle': 'Detalle actualizado',
            'documento': 'Enlace/documento2.pdf',
            'id_codigo_cimpa_fk': self.propuesta_proyecto_id
        }

        self.client.post(reverse('documentoasociado-list'), self.data, format='json')
        url = reverse('documentoasociado-detail', args=[1])
        response = self.client.put(url, update_data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(DocumentoAsociado.objects.get().detalle, 'Detalle actualizado')

    def test_get_lista_documentos_asociados(self):

        # Creando datos de prueba 2
        data2 = {
            'detalle': 'Otro detalle',
            'documento': 'Enlace/documento3.pdf',
            'id_codigo_cimpa_fk': self.propuesta_proyecto_id
        }

        data3 = {
            'detalle': 'Detalle Duplicado',
            'documento': 'Enlace/documento3.pdf',  
            'id_codigo_cimpa_fk': self.propuesta_proyecto_id 
        }

        self.client.post(reverse('documentoasociado-list'), self.data, format='json')
        self.client.post(reverse('documentoasociado-list'), data2, format='json')
        url = reverse('documentoasociado-list')
        response = self.client.get(url)
        response2 = self.client.post(reverse('documentoasociado-list'), data3, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[1]['detalle'], 'Otro detalle')
        self.assertEqual(response2.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_buscar_documento_asociado(self):

        self.client.post(reverse('documentoasociado-list'), self.data, format='json')
        url = reverse('documentoasociado-detail', args=[1])
        response = self.client.get(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['detalle'], 'Detalle de documento')

    def test_delete_documento_asociado(self):

        self.client.post(reverse('documentoasociado-list'), self.data, format='json')
        url = reverse('documentoasociado-detail', args=[1])
        response = self.client.delete(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(DocumentoAsociado.objects.count(), 0)