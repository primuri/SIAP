from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User, Group
from usuario_personalizado.models import Usuario
from ..models import Integrante, OrganoColegiado, Oficio, Vigencia
from django.core.files.uploadedfile import SimpleUploadedFile

class IntegranteTests(APITestCase):

    def setUp(self):
        # Crear usuario de prueba y autenticación
        self.user = Usuario.objects.create_user(correo='testuser@example.com', password='testpassword')
        admin_group, created = Group.objects.get_or_create(name='administrador')
        self.user.groups.add(admin_group)
        self.token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        # Crear datos de prueba para las dependencias
        self.organo_colegiado = {
            'nombre': 'Consejo Académico',
            'numero_miembros': 10,
            'quorum': 6,
            'acuerdo_firme': 8
        }
        
        response = self.client.post(reverse('organocolegiado-list'), self.organo_colegiado, format='json')
        self.id_organo_colegiado = response.data['id_organo_colegiado']

        file = SimpleUploadedFile("oficio.pdf", b"oficio 1")

        self.oficio = {
            'detalle': 'Detalle de oficio',
            'ruta_archivo': file
        }
        response = self.client.post(reverse('oficio-list'), self.oficio, format='multipart')
        self.oficio_id = response.data['id_oficio']

        self.vigencia_data = {
            'fecha_inicio': '2023-09-04T15:30:00',
            'fecha_fin': '2024-09-04T12:45:00'
        }

        response = self.client.post(reverse('vigencia-list'), self.vigencia_data, format='json')
        self.vigencia_id = response.data['id_vigencia']

        # Datos de prueba para Integrante
        self.data = {
            'id_organo_colegiado_fk': self.id_organo_colegiado,
            'id_oficio_fk':  self.oficio_id,
            'id_vigencia_fk': self.vigencia_id,
            'nombre_integrante': 'Juan Pérez',
            'puesto': 'Secretario',
            'normativa_reguladora': 'Regulación X',
            'inicio_funciones': '2022-01-01T00:00:00Z'
        }
    
    def test_post_integrante(self):
        url = reverse('integrante-list')
        response = self.client.post(url, self.data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Integrante.objects.count(), 1)
        self.assertEqual(Integrante.objects.get().nombre_integrante, 'Juan Pérez')
    
    def test_put_integrante(self):
        self.client.post(reverse('integrante-list'), self.data, format='json')

        # Datos para actualizar
        updated_data = {
            'id_organo_colegiado_fk': self.id_organo_colegiado,
            'id_oficio_fk': self.oficio_id,
            'id_vigencia_fk': self.vigencia_id,
            'nombre_integrante': 'Ana Gómez',
            'puesto': 'Tesorero',
            'normativa_reguladora': 'Regulación Z',
            'inicio_funciones': '2023-01-01T00:00:00Z'
        }

        url = reverse('integrante-detail', args=[1])
        response = self.client.put(url, updated_data, format='json')
        integrante = Integrante.objects.get(id_integrante=1)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(integrante.nombre_integrante, 'Ana Gómez')
        self.assertEqual(integrante.puesto, 'Tesorero')

    def test_get_lista_integrante(self):
        
        data2 = {
            'id_organo_colegiado_fk': self.id_organo_colegiado,
            'id_oficio_fk':  self.oficio_id,
            'id_vigencia_fk': self.vigencia_id,
            'nombre_integrante': 'Juan Pérez',
            'puesto': 'Secretario',
            'normativa_reguladora': 'Regulación X',
            'inicio_funciones': '2022-01-01T00:00:00Z'
        }

        self.client.post(reverse('integrante-list'), self.data, format='json')
        self.client.post(reverse('integrante-list'), data2, format='json')
        url = reverse('integrante-list')
        response = self.client.get(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[1]['nombre_integrante'], 'Juan Pérez')

    def test_get_buscar_integrante(self):
        self.client.post(reverse('integrante-list'), self.data, format='json')
        url = reverse('integrante-detail', args=[1])
        response = self.client.get(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nombre_integrante'], 'Juan Pérez')

    def test_delete_integrante(self):
        self.client.post(reverse('integrante-list'), self.data, format='json')
        url = reverse('integrante-detail', args=[1])
        response = self.client.delete(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Integrante.objects.count(), 0)