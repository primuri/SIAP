from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from ..models import ColaboradorPrincipal, Academico, Vigencia
from django.contrib.auth.models import Group
from usuario_personalizado.models import Usuario

class ColaboradorPrincipalTests(APITestCase):

    def setUp(self):

        # Crea el usuario de prueba usando el modelo personalizado
        self.user = Usuario.objects.create_user(correo='testuser@example.com', password='testpassword')
        admin_group, created = Group.objects.get_or_create(name='administrador')
        self.user.groups.add(admin_group)
        self.token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        # Crear datos de prueba para Academico y Vigencia
        self.nombre_completo_data = {
            'nombre': 'Juan',
            'apellido': 'Perez',
            'segundo_apellido': 'Ramirez'
        }

        self.area_especialidad_data = {
            'nombre': 'Física'
        }

        self.area_especialidad2_data = {
            'nombre': 'Ciencias'
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
        self.data = {
            'tipo': 'Principal',
            'carga': '50%',
            'estado': 'Activo',
            'id_vigencia_fk': self.vigencia_id,
            'id_academico_fk': self.academico_id
        }

    def test_post_colaborador_principal(self):
        url = reverse('colaboradorprincipal-list')
        response = self.client.post(url, self.data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ColaboradorPrincipal.objects.count(), 1)
        self.assertEqual(ColaboradorPrincipal.objects.get().tipo, 'Principal')

    def test_put_colaborador_principal(self):
        self.client.post(reverse('colaboradorprincipal-list'), self.data, format='json')

        # Datos actualizados
        update_data = {
            'tipo': 'Secundario',
            'carga': '25%',
            'estado': 'Inactivo',
            'id_vigencia_fk': self.vigencia_id,
            'id_academico_fk': self.academico_id
        }

        url = reverse('colaboradorprincipal-detail', args=[1])
        response = self.client.put(url, update_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(ColaboradorPrincipal.objects.get().tipo, 'Secundario')

    def test_get_lista_colaboradores_principales(self):
        # Crea los datos del primer académico
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
        colaborador_principal_data = {
            'tipo': 'Principal',
            'carga': '90%',
            'estado': 'Activo',
            'id_vigencia_fk': response_vigencia2.data['id_vigencia'], 
            'id_academico_fk': response_academico2.data['id_academico']
        }
       
        self.client.post(reverse('colaboradorprincipal-list'), self.data, format='json')
        self.client.post(reverse('colaboradorprincipal-list'), colaborador_principal_data, format='json')
        
        url = reverse('colaboradorprincipal-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[1]['carga'], '90%')
        # ... y cualquier otra verificación que necesites

    def test_get_buscar_colaborador_principal(self):
        self.client.post(reverse('colaboradorprincipal-list'), self.data, format='json')

        url = reverse('colaboradorprincipal-detail', args=[1])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['tipo'], 'Principal')

    def test_delete_colaborador_principal(self):
        self.client.post(reverse('colaboradorprincipal-list'), self.data, format='json')

        url = reverse('colaboradorprincipal-detail', args=[1])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(ColaboradorPrincipal.objects.count(), 0)