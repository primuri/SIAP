from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from ..models import Evaluacion
from django.contrib.auth.models import Group
from usuario_personalizado.models import Usuario
from django.core.files.uploadedfile import SimpleUploadedFile

class EvaluacionTests(APITestCase):

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
            'nombre': 'Microbiologia'
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


        # Crea los datos de Prueba
        self.propuesta = {
            'id_codigo_cimpa': '1-2023',
            'detalle': 'Detalle de la propuesta',
            'estado': 'En revisión',
            'nombre': 'Proyecto ABC',
            'descripcion': 'Descripción del proyecto ABC',
            'fecha_vigencia': '2023-09-04T15:30:00',
            'actividad': 'Actividad XYZ',
            'id_colaborador_principal_fk': self.colaborador_id
        }
        response = self.client.post(reverse('propuestaproyecto-list'), self.propuesta, format='json')
        self.propuesta_id = response.data['id_codigo_cimpa']

        self.proyecto = {
            'id_codigo_cimpa_fk': self.propuesta_id,
            'id_codigo_vi': '5-2023'
        }
        response = self.client.post(reverse('proyecto-list'), self.proyecto, format='json')
        self.proyecto_id = response.data['id_codigo_vi']

        file = SimpleUploadedFile("oficio.pdf", b"oficio 1")

        # Crea los datos de Prueba
        self.oficio = {
            'detalle': 'Detalle de oficio',
            'ruta_archivo': file
        }
        response = self.client.post(reverse('oficio-list'), self.oficio, format='multipart')
        self.oficio_id = response.data['id_oficio']

        self.vigencia = {
            'fecha_inicio': '2023-09-04T15:30:00',
            'fecha_fin': '2024-09-04T12:45:00'
        }

        response = self.client.post(reverse('vigencia-list'), self.vigencia, format='json')
        self.vigencia_id = response.data['id_vigencia']

        self.version_proyecto = {
            'detalle': 'Detalle de la version de proyecto',
            'numero_version': '1',
            'id_oficio_fk': self.oficio_id,
            'id_vigencia_fk': self.vigencia_id,
            'id_codigo_vi_fk': self.proyecto_id
        }

        response = self.client.post(reverse('versionproyecto-list'), self.version_proyecto, format='json')
        self.version_proyecto_id = response.data['id_version_proyecto']

        self.nombre_completo_data2 = {
            'nombre': 'Brandon',
            'apellido': 'Castillo',
            'segundo_apellido': 'Badilla'
        }
        self.area_especialidad_data2 = {
            'nombre': 'Artes'
        }

        self.universidad_data2 = {
            'pais': 'Costa Rica',
            'nombre': 'Universidad Nacional de Costa Rica'
        }

        response = self.client.post(reverse('nombrecompleto-list'), self.nombre_completo_data2, format='json')
        self.nombre_completo_id2 = response.data['id_nombre_completo']

        response = self.client.post(reverse('areaespecialidad-list'), self.area_especialidad_data2, format='json')
        self.area_especialidad_id2 = response.data['id_area_especialidad'] 

        response = self.client.post(reverse('universidad-list'), self.universidad_data2, format='json')
        self.universidad_id2 = response.data['id_universidad']

        self.evaluador = {
            'id_nombre_completo_fk': self.nombre_completo_id2,
            'id_area_especialidad_fk': self.area_especialidad_id2,
            'universidad_fk': self.universidad_id2,
            'tipo': 'Interno',
            'correo': 'brandon.castillo.badilla@est.una.ac.cr'
        }

        response = self.client.post(reverse('evaluador-list'), self.evaluador, format='json')
        self.evaluador_id = response.data['id_evaluador']

        file2 = SimpleUploadedFile("documento.pdf", b"doc prueba")

        self.documento = {
            'tipo': 'tipo',
            'detalle': 'Detalle de documento',
            'documento': file2
        }

        response =self.client.post(reverse('documento-list'), self.documento, format='multipart')
        self.documento_id = response.data['id_documento']

        self.data = {
            'detalle': 'Evaluacion 11',
            'estado': 'Activo',
            'id_version_proyecto_fk': self.version_proyecto_id,
            'id_evaluador_fk': self.evaluador_id,
            'id_documento_evaluacion_fk': self.documento_id
        }


    def test_post_evaluacion(self):

        url = reverse('evaluacion-list')
        response = self.client.post(url, self.data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Evaluacion.objects.count(), 1)
        self.assertEqual(Evaluacion.objects.get().detalle, 'Evaluacion 11')

    def test_put_evaluacion(self):
        update_data = {
            'detalle': 'Evaluacion 12',
            'estado': 'Inactivo',
            'id_version_proyecto_fk': self.version_proyecto_id,
            'id_evaluador_fk': self.evaluador_id,
            'id_documento_evaluacion_fk': self.documento_id
        }
        
        self.client.post(reverse('evaluacion-list'), self.data, format='json')
        url = reverse('evaluacion-detail', args=['1'])
        response = self.client.put(url, update_data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Evaluacion.objects.get().detalle, 'Evaluacion 12')

    def test_get_lista_evaluaciones(self):
        data2 = {
            'detalle': 'Evaluacion 13',
            'estado': 'Inactivo',
            'id_version_proyecto_fk': self.version_proyecto_id,
            'id_evaluador_fk': self.evaluador_id,
            'id_documento_evaluacion_fk': self.documento_id
        }

        self.client.post(reverse('evaluacion-list'), self.data, format='json')
        self.client.post(reverse('evaluacion-list'), data2, format='json')
        url = reverse('evaluacion-list')
        response = self.client.get(url)
        url2 = reverse('evaluacion-detail', args=['2'])
        response2 = self.client.get(url2)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        self.assertEqual(response2.data['detalle'], 'Evaluacion 13')

        
    def test_get_buscar_evaluacion(self):

        self.client.post(reverse('evaluacion-list'), self.data, format='json')
        url = reverse('evaluacion-detail', args=['1'])
        response = self.client.get(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['detalle'], 'Evaluacion 11')

    def test_delete_evaluacion(self):
        
        self.client.post(reverse('evaluacion-list'), self.data, format='json')
        url = reverse('evaluacion-detail', args=['1'])
        response = self.client.delete(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Evaluacion.objects.count(), 0)
