from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from ..models import DocumentoAsociado, PropuestaProyecto
from django.contrib.auth.models import Group
from usuario_personalizado.models import Usuario
from django.core.files.uploadedfile import SimpleUploadedFile


class DocumentoAsociadoTests(APITestCase):

    def setUp(self):

        # Crea el usuario de prueba usando el modelo personalizado
        self.user = Usuario.objects.create_user(correo='testuser@example.com', password='testpassword')
        admin_group, created = Group.objects.get_or_create(name='administrador')
        self.user.groups.add(admin_group)
        self.token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        self.nombre_completo_data = {
            'nombre': 'Juan',
            'apellido': 'Perez',
            'segundo_apellido': 'Ramirez'
        }

        self.area_especialidad_data = {
            'nombre': 'Física'
        }

        self.area_especialidad2_data = {
            'nombre': 'Fisiologia'
        }

        self.universidad_data = {
            'pais': 'Costa Rica',
            'nombre': 'Universidad de Costa Rica'
        }

        self.vigencia_data = {
            'fecha_inicio': '2023-09-04T15:30:00',
            'fecha_fin': '2024-09-04T12:45:00'
        }

        # Guardar estos datos y almacenar sus IDs
        response = self.client.post(reverse('nombrecompleto-list'), self.nombre_completo_data, format='json')
        self.nombre_completo_id = response.data['id_nombre_completo']

        response = self.client.post(reverse('areaespecialidad-list'), self.area_especialidad_data, format='json')
        self.area_especialidad_id = response.data['id_area_especialidad']

        response = self.client.post(reverse('areaespecialidad-list'), self.area_especialidad2_data, format='json')
        self.area_especialidad2_id = response.data['id_area_especialidad']


        response = self.client.post(reverse('universidad-list'), self.universidad_data, format='json')
        self.universidad_id = response.data['id_universidad']

        response = self.client.post(reverse('vigencia-list'), self.vigencia_data, format='json')
        self.vigencia_id = response.data['id_vigencia']

        self.academico_data = {
            'cedula': '118240782',
            'foto': None,
            'sitio_web': 'http://google.com',
            'grado_maximo': 'Bachillerato',
            'correo': 'brandon.castillo.badilla@est.una.ac.cr',
            'correo_secundario': 'ariel@email.com',
            'unidad_base': 'Dermatología',
            'categoria_en_regimen': 'Junior',
            'pais_procedencia': 'Costa Rica',
            'id_area_especialidad_secundaria_fk': self.area_especialidad2_id,
            'id_nombre_completo_fk': self.nombre_completo_id,
            'id_area_especialidad_fk': self.area_especialidad_id,
            'universidad_fk': self.universidad_id
        }

        response = self.client.post(reverse('academico-list'), self.academico_data, format='json')
        self.academico_id = response.data['id_academico']

        # Crear datos para ColaboradorPrincipal
        self.colaborador_data = {
            'tipo': 'Principal',
            'carga': '50%',
            'estado': 'Activo',
            'id_vigencia_fk': self.vigencia_id,
            'id_academico_fk': self.academico_id
        }
        response = self.client.post(reverse('colaboradorprincipal-list'), self.colaborador_data, format='json')
        self.colaborador_id = response.data['id_colaborador_principal']


        # Crea los datos de Prueba relacionados
        self.propuesta_proyecto_data = {
            'id_codigo_cimpa': 'ABC123',
            'detalle': 'Detalle de propuesta',
            'estado': 'Pendiente',
            'nombre': 'Propuesta 1',
            'descripcion': 'Descripción de la propuesta',
            'fecha_vigencia': '2023-09-24T15:30:00',
            'actividad': 'Actividad de la propuesta',
            'id_colaborador_principal_fk': self.colaborador_id,
        }

        response = self.client.post(reverse('propuestaproyecto-list'), self.propuesta_proyecto_data, format='json')
        self.propuesta_proyecto_id = response.data['id_codigo_cimpa']

        file = SimpleUploadedFile("documento1.pdf", b"content of the pdf")

        # Crea los datos de Prueba
        self.data = {
            'detalle': 'Detalle de documento',
            'documento': file,
            'id_codigo_cimpa_fk': self.propuesta_proyecto_id
        }

    def test_post_documento_asociado(self):

        url = reverse('documentoasociado-list')
        response = self.client.post(url, self.data, format='multipart')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(DocumentoAsociado.objects.count(), 1)
        self.assertEqual(DocumentoAsociado.objects.get().detalle, 'Detalle de documento')

    def test_put_documento_asociado(self):
        file = SimpleUploadedFile("documento6.pdf", b"content of the pdf66")

        # Datos actualizados
        update_data = {
            'detalle': 'Detalle actualizado',
            'documento': file,
            'id_codigo_cimpa_fk': self.propuesta_proyecto_id
        }

        self.client.post(reverse('documentoasociado-list'), self.data, format='multipart')
        url = reverse('documentoasociado-detail', args=[1])
        response = self.client.put(url, update_data, format='multipart')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(DocumentoAsociado.objects.get().detalle, 'Detalle actualizado')

    def test_get_lista_documentos_asociados(self):
        file2 = SimpleUploadedFile("documento2.pdf", b"content of the pdf2")

        # Creando datos de prueba 2
        data2 = {
            'detalle': 'Otro detalle',
            'documento': file2,
            'id_codigo_cimpa_fk': self.propuesta_proyecto_id
        }

        data3 = {
            'detalle': 'Detalle Duplicado',
            'documento': file2,  
            'id_codigo_cimpa_fk': self.propuesta_proyecto_id 
        }

        self.client.post(reverse('documentoasociado-list'), self.data, format='multipart')
        self.client.post(reverse('documentoasociado-list'), data2, format='multipart')
        url = reverse('documentoasociado-list')
        response = self.client.get(url)
        response2 = self.client.post(reverse('documentoasociado-list'), data3, format='multipart')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[1]['detalle'], 'Otro detalle')
        self.assertEqual(response2.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_buscar_documento_asociado(self):

        self.client.post(reverse('documentoasociado-list'), self.data, format='multipart')
        url = reverse('documentoasociado-detail', args=[1])
        response = self.client.get(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['detalle'], 'Detalle de documento')

    def test_delete_documento_asociado(self):

        self.client.post(reverse('documentoasociado-list'), self.data, format='multipart')
        url = reverse('documentoasociado-detail', args=[1])
        response = self.client.delete(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(DocumentoAsociado.objects.count(), 0)