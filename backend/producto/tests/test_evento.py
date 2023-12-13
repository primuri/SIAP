from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from ..models import Evento
from django.contrib.auth.models import Group
from usuario_personalizado.models import Usuario
from django.core.files.uploadedfile import SimpleUploadedFile


class EventoTests(APITestCase):

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

        self.version = {
            'detalle': 'Detalle de la version de proyecto',
            'numero_version': '1',
            'id_oficio_fk': self.oficio_id,
            'id_vigencia_fk': self.vigencia_id,
            'id_codigo_vi_fk': self.proyecto_id
        }

        response = self.client.post(reverse('versionproyecto-list'), self.version, format='json')
        self.version_id = response.data['id_version_proyecto']

        self.producto = {
            'id_version_proyecto_fk': self.version_id,
            'fecha': '2023-10-30T00:00:00Z',
            'detalle': 'Producto asociado'
        }

        response = self.client.post(reverse('producto-list'), self.producto, format='json')
        self.producto_id = response.data['id_producto']



        file = SimpleUploadedFile("documentoEvento.pdf", b"doc prueba producto evento")

        # Crea los datos de Prueba
        self.oficio = {
            'detalle': 'Detalle de oficio',
            'ruta_archivo': file
        }

        response = self.client.post(reverse('oficio-list'), self.oficio, format='multipart')
        self.oficio_id = response.data['id_oficio']

        self.area = {
            'nombre': 'Arte'
        }

        response = self.client.post(reverse('area-list'), self.area, format='json')
        self.area_id = response.data['id_area']

        self.institucion = {
            'nombre': 'UCR'
        }

        response = self.client.post(reverse('institucion-list'), self.institucion, format='json')
        self.institucion_id = response.data['id_institucion']

        self.data = {
             'nombre': 'Evento simposio',
             'resumen': 'evento de concurso',
             'pais': 'Colombia',
             'tipo_participacion': 'Activa',
             'enlace': 'cimpa.com',
             'id_producto_fk': self.producto_id,
             'id_oficio_fk': self.oficio_id,
             'id_area_fk': self.area_id,
             'id_institucion_fk': self.institucion_id
        } 

    def test_post_evento(self):

        url = reverse('evento-list')
        response = self.client.post(url, self.data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Evento.objects.count(), 1)
        self.assertEqual(Evento.objects.get().nombre, 'Evento simposio')

    def test_put_evento(self):
        update_data = {
            'nombre': 'Evento concurso',
            'resumen': 'evento de concurso',
            'pais': 'Peru',
            'tipo_participacion': 'Activa',
            'enlace': 'cimpa.com',
            'id_producto_fk': self.producto_id,
            'id_oficio_fk': self.oficio_id,
            'id_area_fk': self.area_id,
            'id_institucion_fk': self.institucion_id
        }
        
        self.client.post(reverse('evento-list'), self.data, format='json')
        url = reverse('evento-detail', args=['1'])
        response = self.client.put(url, update_data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Evento.objects.get().nombre, 'Evento concurso')

    def test_get_lista_eventos(self):
        data2 = {
            'nombre': 'Evento concurso 2',
            'resumen': 'evento de concurso',
            'pais': 'Peru',
            'tipo_participacion': 'Activa',
            'enlace': 'cimpa.com',
            'id_producto_fk': self.producto_id,
            'id_oficio_fk': self.oficio_id,
            'id_area_fk': self.area_id,
            'id_institucion_fk': self.institucion_id
        }

        self.client.post(reverse('evento-list'), self.data, format='json')
        self.client.post(reverse('evento-list'), data2, format='json')
        url = reverse('evento-list')
        response = self.client.get(url)
        url2 = reverse('evento-detail', args=['2'])
        response2 = self.client.get(url2)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        self.assertEqual(response2.data['nombre'], 'Evento concurso 2')
        
    def test_get_buscar_evento(self):

        self.client.post(reverse('evento-list'), self.data, format='json')
        url = reverse('evento-detail', args=['1'])
        response = self.client.get(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nombre'], 'Evento simposio')

    def test_delete_evento(self):
        
        self.client.post(reverse('evento-list'), self.data, format='json')
        url = reverse('evento-detail', args=['1'])
        response = self.client.delete(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Evento.objects.count(), 0)