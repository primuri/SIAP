from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from ..models import PreguntaEvaluacionCC
from django.contrib.auth.models import Group
from usuario_personalizado.models import Usuario
from django.core.files.uploadedfile import SimpleUploadedFile

class PreguntaEvaluacionCCTests(APITestCase):

    def setUp(self):

        # Crea el usuario de prueba usando el modelo personalizado
        self.user = Usuario.objects.create_user(correo='testuser@example.com', password='testpassword')
        admin_group, created = Group.objects.get_or_create(name='administrador')
        self.user.groups.add(admin_group)
        self.token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        file = SimpleUploadedFile("documento.pdf", b"doc prueba")

        self.documento = {
            'tipo': 'tipo',
            'detalle': 'Detalle de documento',
            'documento': file
        }

        response =self.client.post(reverse('documento-list'), self.documento, format='multipart')
        self.documento_id = response.data['id_documento']

        self.evaluacioncc = {
            'detalle': 'Evaluacion 1',
            'id_documento_evualuacion_fk': self.documento_id
        }

        response = self.client.post(reverse('evaluacioncc-list'), self.evaluacioncc, format='multipart')
        self.evaluacioncc_id = response.data['id_evaluacion_cc']

        self.data = {
            'pregunta': '¿Que hora es?',
            'respuesta' : '8:00',
            'id_evaluacion_cc_fk' : self.evaluacioncc_id
        }
    
    def test_post_pregunta_evaluacioncc(self):

        url = reverse('preguntaevaluacioncc-list')
        response = self.client.post(url, self.data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(PreguntaEvaluacionCC.objects.count(), 1)
        self.assertEqual(PreguntaEvaluacionCC.objects.get().pregunta, '¿Que hora es?')

    def test_put_pregunta_evaluacioncc(self):

        # Datos actualizados
        update_data = {
            'pregunta': '¿Cuantos son?',
            'respuesta' : '20',
            'id_evaluacion_cc_fk' : self.evaluacioncc_id
        }

        self.client.post(reverse('preguntaevaluacioncc-list'), self.data, format='json')
        url = reverse('preguntaevaluacioncc-detail', args=[1])
        response = self.client.put(url, update_data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(PreguntaEvaluacionCC.objects.get().respuesta, '20')

    def test_get_lista_preguntas_evaluacioncc(self):

        data2 = {
            'pregunta': '¿Como eres?',
            'respuesta' : 'Bueno',
            'id_evaluacion_cc_fk' : self.evaluacioncc_id
        }

        self.client.post(reverse('preguntaevaluacioncc-list'), self.data, format='json')
        self.client.post(reverse('preguntaevaluacioncc-list'), data2, format='json')
        url = reverse('preguntaevaluacioncc-list')
        response = self.client.get(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[1]['respuesta'], 'Bueno')
    
    def test_get_buscar_pregunta_evaluacioncc(self):

        self.client.post(reverse('preguntaevaluacioncc-list'), self.data, format='json')
        url = reverse('preguntaevaluacioncc-detail', args=[1])
        response = self.client.get(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['respuesta'], '8:00')

    def test_delete_pregunta_evaluacioncc(self):

        self.client.post(reverse('preguntaevaluacioncc-list'), self.data, format='json')
        url = reverse('preguntaevaluacioncc-detail', args=[1])
        response = self.client.delete(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(PreguntaEvaluacionCC.objects.count(), 0)