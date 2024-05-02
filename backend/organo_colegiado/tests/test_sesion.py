from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from ..models import Sesion, OrganoColegiado, Agenda, Acta, Documento,Convocatoria
from django.core.files.uploadedfile import SimpleUploadedFile
import datetime
from usuario_personalizado.models import Usuario
from django.contrib.auth.models import User, Group
from django.utils import timezone

class SesionTests(APITestCase):

    def setUp(self):
        # Crear usuario de prueba y autenticación
        self.user = Usuario.objects.create_user(correo='testuser@example.com', password='testpassword')
        admin_group, created = Group.objects.get_or_create(name='administrador')
        self.user.groups.add(admin_group)
        self.token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        # Crear datos de prueba para las dependencias
        self.documento = Documento.objects.create(
            tipo='Convocatoria',
            detalle='Detalle de la convocatoria',
            documento=SimpleUploadedFile("convocatoria.pdf", b"contenido de archivo")
        )

        # Crear convocatoria
        self.convocatoria = Convocatoria.objects.create(
            id_documento_convocatoria_fk=self.documento
        )

        # Crear organo colegiado
        self.organo_colegiado = OrganoColegiado.objects.create(
            nombre='Consejo Académico',
            numero_miembros=10,
            quorum=6,
            acuerdo_firme=8
        )

        # Crear agenda asociada a la convocatoria
        self.agenda = Agenda.objects.create(
            tipo='Ordinaria',
            detalle='Agenda ordinaria',
            id_convocatoria_fk=self.convocatoria
        )

        # Crear acta
        self.acta = Acta.objects.create(
            id_documento_acta_fk=self.documento
        )

        # Datos de prueba para Sesion
        self.sesion_data = {
            'id_sesion': 'SES123',
            'fecha': timezone.now(),
            'id_organo_colegiado_fk': self.organo_colegiado.id_organo_colegiado,
            'id_agenda_fk': self.agenda.id_agenda,
            'id_acta_fk': self.acta.id_acta,
            'medio': 'Virtual',
            'link_carpeta': 'http://link-a-la-carpeta.com'
        }
    

    def test_post_sesion(self):
        url = reverse('sesion-list')
        response = self.client.post(url, self.sesion_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Sesion.objects.count(), 1)
        self.assertEqual(Sesion.objects.get().id_sesion, 'SES123')

    def test_put_sesion(self):
        response = self.client.post(reverse('sesion-list'), self.sesion_data, format='json')
        sesion_id = response.data['id_sesion']

        updated_data = self.sesion_data.copy()
        updated_data['medio'] = 'Presencial'
        url = reverse('sesion-detail', args=[sesion_id])
        response = self.client.put(url, updated_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Sesion.objects.get(id_sesion=sesion_id).medio, 'Presencial')

    def test_get_lista_sesion(self):
        self.client.post(reverse('sesion-list'), self.sesion_data, format='json')
        self.sesion_data['id_sesion'] = 'SES124'
        self.client.post(reverse('sesion-list'), self.sesion_data, format='json')
        
        url = reverse('sesion-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_get_buscar_sesion(self):
        response = self.client.post(reverse('sesion-list'), self.sesion_data, format='json')
        sesion_id = response.data['id_sesion']
        url = reverse('sesion-detail', args=[sesion_id])
        response = self.client.get(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id_sesion'], 'SES123')
        self.assertEqual(response.data['medio'], self.sesion_data['medio'])

    def test_delete_sesion(self):
        response = self.client.post(reverse('sesion-list'), self.sesion_data, format='json')
        sesion_id = response.data['id_sesion']
        url = reverse('sesion-detail', args=[sesion_id])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Sesion.objects.count(), 0)