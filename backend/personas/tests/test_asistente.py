from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from ..models import Asistente
from django.contrib.auth.models import Group
from usuario_personalizado.models import Usuario
from django.core.files.uploadedfile import SimpleUploadedFile

class AsistenteTests(APITestCase):

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

        self.data = {
            'cedula': '123456789',
            'condicion_estudiante': 'Activo',
            'id_nombre_completo_fk': self.academico_id  ,
            'carrera': 'Informatica',
            'promedio_ponderado': '8.95'

        }


    def test_post_asistente(self):

        url = reverse('asistente-list')
        response = self.client.post(url, self.data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Asistente.objects.count(), 1)
        self.assertEqual(Asistente.objects.get().cedula, '123456789')

    def test_put_asistente(self):
        update_data = {
            'cedula': '123456789',
            'condicion_estudiante': 'Inactivo',
            'id_nombre_completo_fk': self.academico_id  ,
            'carrera': 'Ciencias',
            'promedio_ponderado': '8.95'
        }
        
        self.client.post(reverse('asistente-list'), self.data, format='json')
        url = reverse('asistente-detail', args=['1'])
        response = self.client.put(url, update_data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Asistente.objects.get().condicion_estudiante, 'Inactivo')
        self.assertEqual(Asistente.objects.get().carrera, 'Ciencias')

    def test_get_lista_asistentes(self):

        nombre_completo2 = {
            'nombre': 'Juan',
            'apellido': 'Perez',
            'segundo_apellido': 'Ramirez'
        }
        response = self.client.post(reverse('nombrecompleto-list'), nombre_completo2, format='json')
        nombre_completo_id2 = response.data['id_nombre_completo']

        academico_data2 = {
            'cedula': '54646456',
            'foto': None,
            'sitio_web': 'http://google.com',
            'grado_maximo': 'Bachillerato',
            'correo': 'brandon.castillo.badilla@est.una.ac.cr',
            'correo_secundario': 'ariel@email.com',
            'unidad_base': 'Dermatología',
            'categoria_en_regimen': 'Junior',
            'pais_procedencia': 'Costa Rica',
            'id_area_especialidad_secundaria_fk': self.area_especialidad2_id,
            'id_nombre_completo_fk': nombre_completo_id2,
            'id_area_especialidad_fk': self.area_especialidad_id,
            'universidad_fk': self.universidad_id
        }
        response = self.client.post(reverse('academico-list'), academico_data2, format='json')
        academico_id2 = response.data['id_academico']


        data2 = {
            'cedula': '987654321',
            'condicion_estudiante': 'Activo',
            'id_nombre_completo_fk': academico_id2,
            'carrera': 'Artes',
            'promedio_ponderado': '1.28'
        }
    
        self.client.post(reverse('asistente-list'), self.data, format='json')
        self.client.post(reverse('asistente-list'), data2, format='json')
        url = reverse('asistente-list')
        response = self.client.get(url)
        url2 = reverse('asistente-detail', args=['2'])
        response2 = self.client.get(url2)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        self.assertEqual(response2.data['cedula'], '987654321')

        
    def test_get_buscar_asistente(self):

        self.client.post(reverse('asistente-list'), self.data, format='json')
        url = reverse('asistente-detail', args=['1'])
        response = self.client.get(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['carrera'], 'Informatica')

    def test_delete_asistente(self):
        
        self.client.post(reverse('asistente-list'), self.data, format='json')
        url = reverse('asistente-detail', args=['1'])
        response = self.client.delete(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Asistente.objects.count(), 0)
