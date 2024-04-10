from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from ..models import PropuestaProyecto
from django.contrib.auth.models import Group
from usuario_personalizado.models import Usuario

class PropuestaProyectoTests(APITestCase):

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
        self.data = {
            'id_codigo_cimpa': '1-2024',
            'detalle': 'Detalle de la propuesta',
            'estado': 'En revisión',
            'nombre': 'Proyecto ABC',
            'descripcion': 'Descripción del proyecto ABC',
            'fecha_vigencia': '2023-09-04T15:30:00',
            'actividad': 'Actividad XYZ',
            'id_colaborador_principal_fk': self.colaborador_id
        }

    def test_post_propuesta_proyecto(self):

        url = reverse('propuestaproyecto-list')
        response = self.client.post(url, self.data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(PropuestaProyecto.objects.count(), 1)
        self.assertEqual(PropuestaProyecto.objects.get().nombre, 'Proyecto ABC')

    def test_put_propuesta_proyecto(self):
        update_data = {
            'id_codigo_cimpa': '1-2024',
            'detalle': 'Detalle editado',
            'estado': 'En revisión',
            'nombre': 'Proyecto YYY',
            'descripcion': 'Descripción del proyecto XYZ',
            'fecha_vigencia': '2023-09-04T15:30:00',
            'actividad': 'Actividad XYZ',
            'id_colaborador_principal_fk': self.colaborador_id
        }
        
        self.client.post(reverse('propuestaproyecto-list'), self.data, format='json')
        url = reverse('propuestaproyecto-detail', args=['1-2024'])
        response = self.client.put(url, update_data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(PropuestaProyecto.objects.get().nombre, 'Proyecto YYY')


    def test_get_lista_propuestas_proyectos(self):
        nombre_completo_data2 = {
            'nombre': 'Brenda',
            'apellido': 'Cordero',
            'segundo_apellido': 'Gutierrez'
        }
        area_especialidad_data2 = {
            'nombre': 'Microbiologia'
        }
        area_especialidad2_data2 = {
            'nombre': 'Microbiologia'
        }
        universidad_data2 = {
            'pais': 'Nicaragua',
            'nombre': 'Universidad Nacional Autónoma de Managua'
        }
        vigencia_data2 = {
                'fecha_inicio': '2022-12-04T15:30:00',
                'fecha_fin': '2024-09-04T12:45:00'
            }

        response_nombre2 = self.client.post(reverse('nombrecompleto-list'), nombre_completo_data2, format='json')
        response_area2 = self.client.post(reverse('areaespecialidad-list'), area_especialidad_data2, format='json')
        response_universidad2 = self.client.post(reverse('universidad-list'), universidad_data2, format='json')
        response_vigencia2 = self.client.post(reverse('vigencia-list'), vigencia_data2, format='json')
        response2_area2 = self.client.post(reverse('areaespecialidad-list'), area_especialidad2_data2, format='json')
    
        academico_data2 = {
            'cedula': '89654321',
            'foto': None,
            'sitio_web': 'http://89654321.com',
            'grado_maximo': 'Doctorado',
            'correo': 'brenda.castillo@email.com',
            'correo_secundario': 'ariel@email.com',
            'unidad_base': 'Dermatología',
            'categoria_en_regimen': 'Senior',
            'pais_procedencia': 'Nicaragua',
            'id_area_especialidad_secundaria_fk': response2_area2.data['id_area_especialidad'],
            'id_nombre_completo_fk': response_nombre2.data['id_nombre_completo'],
            'id_area_especialidad_fk': response_area2.data['id_area_especialidad'], 
            'universidad_fk': response_universidad2.data['id_universidad']  
        }

        response_academico2 = self.client.post(reverse('academico-list'), academico_data2, format='json')
       
        
        # Ahora que ya tienes el academico creado, puedes agregarlo al colaborador principal
        colaborador_principal_data2 = {
            'tipo': 'Principal',
            'carga': '90%',
            'estado': 'Activo',
            'id_vigencia_fk': response_vigencia2.data['id_vigencia'], 
            'id_academico_fk': response_academico2.data['id_academico']
        }
        response_colaborador2 = self.client.post(reverse('colaboradorprincipal-list'), colaborador_principal_data2, format='json')
       
        # Carga de datos 2
        data2 = {
            'id_codigo_cimpa': '2-2024',
            'detalle': 'Otro Detalle',
            'estado': 'Aprobado',
            'nombre': 'Proyecto GHI',
            'descripcion': 'Descripción del proyecto GHI',
            'fecha_vigencia': '2024-01-01T12:00:00',
            'actividad': 'Otra Actividad',
            'id_colaborador_principal_fk': response_colaborador2.data['id_colaborador_principal']
        }

        self.client.post(reverse('propuestaproyecto-list'), self.data, format='json')
        self.client.post(reverse('propuestaproyecto-list'), data2, format='json')
        url = reverse('propuestaproyecto-list')
        response = self.client.get(url)
        url2 = reverse('propuestaproyecto-detail', args=['2-2024'])
        response2 = self.client.get(url2)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        self.assertEqual(response2.data['nombre'], 'Proyecto GHI')

    def test_get_buscar_propuesta_proyecto(self):

        self.client.post(reverse('propuestaproyecto-list'), self.data, format='json')
        url = reverse('propuestaproyecto-detail', args=['1-2024'])
        response = self.client.get(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nombre'], 'Proyecto ABC')

    def test_delete_propuesta_proyecto(self):
        
        self.client.post(reverse('propuestaproyecto-list'), self.data, format='json')
        url = reverse('propuestaproyecto-detail', args=['1-2024'])
        response = self.client.delete(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(PropuestaProyecto.objects.count(), 0)
