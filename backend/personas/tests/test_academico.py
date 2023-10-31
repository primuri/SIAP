from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User, Group
from ..models import Academico
from usuario_personalizado.models import Usuario

class AcademicoTests(APITestCase):

    def setUp(self):

        # Crea el usuario de prueba usando el modelo personalizado
        self.user = Usuario.objects.create_user(correo='testuser@example.com', password='testpassword')
        admin_group, created = Group.objects.get_or_create(name='administrador')
        self.user.groups.add(admin_group)
        self.token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        # Crea los datos de Prueba relacionados
        self.nombre_completo_data = {
            'nombre': 'Brandon',
            'apellido': 'Castillo',
            'segundo_apellido': 'Badilla'
        }
        self.area_especialidad_data = {
            'nombre': 'Artes'
        }

        self.area_especialidad2_data = {
            'nombre': 'Ciencias'
        }

        self.universidad_data = {
            'pais': 'Costa Rica',
            'nombre': 'Universidad Nacional de Costa Rica'
        }

        response = self.client.post(reverse('nombrecompleto-list'), self.nombre_completo_data, format='json')
        self.nombre_completo_id = response.data['id_nombre_completo']

        response = self.client.post(reverse('areaespecialidad-list'), self.area_especialidad_data, format='json')
        self.area_especialidad_id = response.data['id_area_especialidad'] 

        response = self.client.post(reverse('areaespecialidad-list'), self.area_especialidad2_data, format='json')
        self.area_especialidad2_id = response.data['id_area_especialidad'] 

        response = self.client.post(reverse('universidad-list'), self.universidad_data, format='json')
        self.universidad_id = response.data['id_universidad']

        self.data = {
            'cedula': '118240782',
            'foto': None,
            'sitio_web': 'http://google.com',
            'grado_maximo': 'Bachillerato',
            'correo': 'brandon.castillo.badilla@est.una.ac.cr',
            'correo_secundario': 'brancon@gmail.com',
            'unidad_base': 'Circo',
            'id_area_especialidad_secundaria_fk': self.area_especialidad2_id,
            'categoria_en_regimen': 'Junior',
            'pais_procedencia': 'Costa Rica',
            'id_nombre_completo_fk': self.nombre_completo_id,
            'id_area_especialidad_fk': self.area_especialidad_id,
            'universidad_fk': self.universidad_id
        }


    def test_post_academico(self):

        url = reverse('academico-list')
        response = self.client.post(url, self.data, format='json')
        

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Academico.objects.count(), 1)
        self.assertEqual(Academico.objects.get().cedula, '118240782')
   
    def test_put_academico(self):
        
        self.client.post(reverse('academico-list'), self.data, format='json')

        # Datos actualizados
        update_data = {
            'cedula': '118240782',
            'foto': None,
            'sitio_web': 'http://118240782.com',
            'grado_maximo': 'Bachillerato',
            'correo': 'brandonchin@gmail.com',
            'correo_secundario': 'casa@gmail.com',
            'unidad_base': 'Circo',
            'id_area_especialidad_secundaria_fk': self.area_especialidad2_id,
            'categoria_en_regimen': 'Junior',
            'pais_procedencia': 'China',
            'id_nombre_completo_fk': self.nombre_completo_id,
            'id_area_especialidad_fk': self.area_especialidad_id,
            'universidad_fk': self.universidad_id
        }

        
        url = reverse('academico-detail', args=[1])
        response = self.client.put(url, update_data, format='json')
        academico = Academico.objects.get(id_academico='1')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(academico.pais_procedencia, 'China')
        self.assertEqual(academico.sitio_web, 'http://118240782.com')
        self.assertEqual(academico.correo, 'brandonchin@gmail.com')

    def test_get_lista_academicos(self):

        # Crea los datos de Prueba relacionados
        nombre_completo_data2 = {
            'nombre': 'Brenda',
            'apellido': 'Ramos',
            'segundo_apellido': 'Gutierrez'
        }
        area_especialidad_data2 = {
            'nombre': 'Dermatología'
        }

        area_especialidad2_data2 = {
            'nombre': 'Anesteciologia'
        }
        universidad_data2 = {
            'pais': 'Nicaragua',
            'nombre': 'Universidad Nacional Autónoma de Nicaragua'
        }

        response_nombre = self.client.post(reverse('nombrecompleto-list'), nombre_completo_data2, format='json')
        response_area = self.client.post(reverse('areaespecialidad-list'), area_especialidad_data2, format='json')
        response_universidad = self.client.post(reverse('universidad-list'), universidad_data2, format='json')
        response_area2 = self.client.post(reverse('areaespecialidad-list'), area_especialidad2_data2, format='json')
        
        # Creando datos de prueba 2
        data2 = {
            'cedula': '87654321',
            'foto': None,
            'sitio_web': 'http://87654321.com',
            'grado_maximo': 'Licenciatura',
            'correo': 'brandon.castillo@email.com',
            'correo_secundario': 'ariel@email.com',
            'unidad_base': 'Dermatología',
            'categoria_en_regimen': 'Junior',
            'pais_procedencia': 'Nicaragua',
            'id_area_especialidad_secundaria_fk': response_area2.data['id_area_especialidad'],
            'id_nombre_completo_fk': response_nombre.data['id_nombre_completo'],
            'id_area_especialidad_fk': response_area.data['id_area_especialidad'], 
            'universidad_fk': response_universidad.data['id_universidad']  
        }

        data3 = {
            'cedula': '87654321',
            'foto': None,
            'sitio_web': 'http://87654321.com',
            'grado_maximo': 'Licenciatura',
            'correo': 'brandon.castillo@email.com',
            'correo_secundario': 'priscila@email.com',
            'unidad_base': 'Dermatología',
            'categoria_en_regimen': 'Junior',
            'pais_procedencia': 'Nicaragua',
            'id_area_especialidad_secundaria_fk': response_area2.data['id_area_especialidad'],
            'id_nombre_completo_fk': response_nombre.data['id_nombre_completo'],
            'id_area_especialidad_fk': response_area.data['id_area_especialidad'], 
            'universidad_fk': response_universidad.data['id_universidad']  
        }

        self.client.post(reverse('academico-list'), self.data, format='json')
        self.client.post(reverse('academico-list'), data2, format='json')
        url = reverse('academico-list')
        response = self.client.get(url)
        response2 = self.client.post(reverse('academico-list'), data3, format='json')
         
        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response2.status_code, status.HTTP_400_BAD_REQUEST) # Evalua  que la cedula sea unique
        self.assertIn('cedula', response2.data)  

    def test_get_buscar_academico(self):

        self.client.post(reverse('academico-list'), self.data, format='json')
        url = reverse('academico-detail', args=[1])
        response = self.client.get(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['cedula'], '118240782')

    def test_delete_academico(self):
       
        self.client.post(reverse('academico-list'), self.data, format='json')
        url = reverse('academico-detail', args=[1])
        response = self.client.delete(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Academico.objects.count(), 0)