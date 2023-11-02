from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from ..models import Proyecto
from django.contrib.auth.models import Group
from usuario_personalizado.models import Usuario

class ProyectoTests(APITestCase):

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

        self.data = {
            'id_codigo_cimpa_fk': self.propuesta_id,
            'id_codigo_vi': '5-2023'
        }

    def test_post_proyecto(self):

        url = reverse('proyecto-list')
        response = self.client.post(url, self.data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Proyecto.objects.count(), 1)
        self.assertEqual(Proyecto.objects.get().id_codigo_vi, '5-2023')

    def test_put_proyecto(self):
        propuesta2 = {
            'id_codigo_cimpa': '2-2023',
            'detalle': 'Detalle de la propuesta',
            'estado': 'En revisión',
            'nombre': 'Proyecto ABC',
            'descripcion': 'Descripción del proyecto ABC',
            'fecha_vigencia': '2023-09-04T15:30:00',
            'actividad': 'Actividad XYZ',
            'id_colaborador_principal_fk': self.colaborador_id
        }
        response = self.client.post(reverse('propuestaproyecto-list'), propuesta2, format='json')
        propuesta2_id = response.data['id_codigo_cimpa']
    
        update_data = {
            'id_codigo_cimpa_fk': propuesta2_id,
            'id_codigo_vi': '5-2023'
        }
        
        self.client.post(reverse('proyecto-list'), self.data, format='json')
        url = reverse('proyecto-detail', args=['5-2023'])
        response = self.client.put(url, update_data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Proyecto.objects.get().id_codigo_cimpa_fk.id_codigo_cimpa, '2-2023')

    def test_get_lista_proyectos(self):
        
        # Carga de datos 2
        propuesta2 = {
            'id_codigo_cimpa': '2-2023',
            'detalle': 'Detalle de la propuesta',
            'estado': 'En revisión',
            'nombre': 'Proyecto Pedro',
            'descripcion': 'Descripción del proyecto ABC',
            'fecha_vigencia': '2023-09-04T15:30:00',
            'actividad': 'Actividad XYZ',
            'id_colaborador_principal_fk': self.colaborador_id
        }
        response = self.client.post(reverse('propuestaproyecto-list'), propuesta2, format='json')
        propuesta2_id = response.data['id_codigo_cimpa']

        data2 = {
            'id_codigo_cimpa_fk': propuesta2_id,
            'id_codigo_vi': '3-2023'
        }

        self.client.post(reverse('proyecto-list'), self.data, format='json')
        self.client.post(reverse('proyecto-list'), data2, format='json')
        url = reverse('proyecto-list')
        response = self.client.get(url)
        url2 = reverse('proyecto-detail', args=['3-2023'])
        response2 = self.client.get(url2)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        self.assertEqual(response2.data['id_codigo_cimpa_fk']['nombre'], 'Proyecto Pedro')
      
    def test_get_buscar_proyecto(self):

        self.client.post(reverse('proyecto-list'), self.data, format='json')
        url = reverse('proyecto-detail', args=['5-2023'])
        response = self.client.get(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id_codigo_cimpa_fk']['nombre'], 'Proyecto ABC')

    def test_delete_proyecto(self):
        
        self.client.post(reverse('proyecto-list'), self.data, format='json')
        url = reverse('proyecto-detail', args=['5-2023'])
        response = self.client.delete(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Proyecto.objects.count(), 0)
