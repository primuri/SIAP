from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from ..models import EvaluacionCC
from django.contrib.auth.models import Group
from usuario_personalizado.models import Usuario
from django.core.files.uploadedfile import SimpleUploadedFile

class EvaluacionCCTests(APITestCase):

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
        self.documento = {
            'tipo': 'tipo',
            'detalle': 'Detalle de documento',
            'documento': file
        }

        response =self.client.post(reverse('documento-list'), self.documento, format='multipart')
        self.documento_id = response.data['id_documento']

        self.data = {
            'detalle': 'Evaluacion 1',
            'id_documento_evualuacion_fk': self.documento_id
        }

    
    def test_post_evaluacioncc(self):

        url = reverse('evaluacioncc-list')
        response = self.client.post(url, self.data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(EvaluacionCC.objects.count(), 1)
        self.assertEqual(EvaluacionCC.objects.get().detalle, 'Evaluacion 1')

    def test_put_evaluacioncc(self):

        # Datos actualizados
        update_data = {
            'detalle': 'Evaluacion 2',
            'id_documento_evualuacion_fk': self.documento_id
        }

        self.client.post(reverse('evaluacioncc-list'), self.data, format='json')
        url = reverse('evaluacioncc-detail', args=[1])
        response = self.client.put(url, update_data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(EvaluacionCC.objects.get().detalle, 'Evaluacion 2')

    def test_get_lista_evaluacioncc(self):

        file2 = SimpleUploadedFile("documento.pdf", b"doc prueba")
        documento2 = {
            'tipo': 'tipo',
            'detalle': 'Detalle de documento',
            'documento': file2
        }

        response =self.client.post(reverse('documento-list'), documento2, format='multipart')
        documento_id2 = response.data['id_documento']

        data2 = {
            'detalle': 'Evaluacion 3',
            'id_documento_evualuacion_fk': documento_id2
        }

        self.client.post(reverse('evaluacioncc-list'), self.data, format='json')
        self.client.post(reverse('evaluacioncc-list'), data2, format='json')
        url = reverse('evaluacioncc-list')
        response = self.client.get(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[1]['detalle'], 'Evaluacion 3')
    
    def test_get_buscar_evaluacioncc(self):

        self.client.post(reverse('evaluacioncc-list'), self.data, format='json')
        url = reverse('evaluacioncc-detail', args=[1])
        response = self.client.get(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['detalle'], 'Evaluacion 1')

    def test_delete_evaluacioncc(self):

        self.client.post(reverse('evaluacioncc-list'), self.data, format='json')
        url = reverse('evaluacioncc-detail', args=[1])
        response = self.client.delete(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(EvaluacionCC.objects.count(), 0)