from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User, Group
from usuario_personalizado.models import Usuario
from ..models import Acuerdo, Documento, OrganoColegiado, Sesion, Seguimiento, Oficio, Convocatoria, Agenda, Acta
from django.core.files.uploadedfile import SimpleUploadedFile
import datetime
from django.utils import timezone

class AcuerdoTests(APITestCase):

    def setUp(self):
        # Usuario y autenticación
        self.user = Usuario.objects.create_user(correo='testuser@example.com', password='testpassword')
        admin_group, created = Group.objects.get_or_create(name='administrador')
        self.user.groups.add(admin_group)
        self.token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

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
        self.sesion = Sesion.objects.create(
            id_sesion= 'SES123',
            fecha= timezone.now(),
            id_organo_colegiado_fk= self.organo_colegiado,
            id_agenda_fk= self.agenda,
            id_acta_fk= self.acta,
            medio= 'Virtual',
            link_carpeta= 'http://link-a-la-carpeta.com'
        )

        self.seguimiento = Seguimiento.objects.create(
            id_documento_seguimiento_fk=self.documento
        )

        self.oficio = Oficio.objects.create(
            ruta_archivo=SimpleUploadedFile("oficio.pdf", b"contenido del oficio"),
            detalle="Detalle de oficio"
        )

        # Datos para el Acuerdo
        self.acuerdo_data = {
            'descripcion': 'Descripción del acuerdo',
            'estado': 'En trámite',
            'fecha_cumplimiento': '2023-12-31',
            'encargado': 'John Doe',
            'id_seguimiento_fk': self.seguimiento.id_seguimiento,
            'id_oficio_fk': self.oficio.id_oficio,
            'id_sesion_fk': self.sesion.id_sesion,
            'id_documento_acuerdo_fk': self.documento.id_documento
        }

    def test_post_acuerdo(self):
        url = reverse('acuerdo-list')
        response = self.client.post(url, self.acuerdo_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Acuerdo.objects.count(), 1)
        self.assertEqual(Acuerdo.objects.get().encargado, 'John Doe')

    def test_put_acuerdo(self):
        response = self.client.post(reverse('acuerdo-list'), self.acuerdo_data, format='json')
        acuerdo_id = response.data['id_acuerdo']
        updated_data = self.acuerdo_data.copy()
        updated_data['encargado'] = 'Jane Doe'
        url = reverse('acuerdo-detail', args=[acuerdo_id])
        response = self.client.put(url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Acuerdo.objects.get(id_acuerdo=acuerdo_id).encargado, 'Jane Doe')

    def test_get_lista_acuerdo(self):
        self.client.post(reverse('acuerdo-list'), self.acuerdo_data, format='json')
        another_acuerdo_data = self.acuerdo_data.copy()
        another_acuerdo_data['descripcion'] = 'Otro acuerdo'
        self.client.post(reverse('acuerdo-list'), another_acuerdo_data, format='json')
        url = reverse('acuerdo-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_get_buscar_acuerdo(self):
        response = self.client.post(reverse('acuerdo-list'), self.acuerdo_data, format='json')
        acuerdo_id = response.data['id_acuerdo']
        url = reverse('acuerdo-detail', args=[acuerdo_id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['encargado'], 'John Doe')

    def test_delete_acuerdo(self):
        response = self.client.post(reverse('acuerdo-list'), self.acuerdo_data, format='json')
        acuerdo_id = response.data['id_acuerdo']
        url = reverse('acuerdo-detail', args=[acuerdo_id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Acuerdo.objects.count(), 0)
