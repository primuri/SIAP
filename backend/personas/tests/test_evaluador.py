from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User, Group
from ..models import Evaluador

class EvaluadorTests(APITestCase):

    def setUp(self):

    # Crea el usuario de prueba
        self.user = User.objects.create_user(username='testuser', password='testpassword', is_staff=True, is_superuser=True)
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

        self.universidad_data = {
            'pais': 'Costa Rica',
            'nombre': 'Universidad Nacional de Costa Rica'
        }

        response = self.client.post(reverse('nombrecompleto-list'), self.nombre_completo_data, format='json')
        self.nombre_completo_id = response.data['id_nombre_completo']

        response = self.client.post(reverse('areaespecialidad-list'), self.area_especialidad_data, format='json')
        self.area_especialidad_id = response.data['id_area_especialidad'] 

        response = self.client.post(reverse('universidad-list'), self.universidad_data, format='json')
        self.universidad_id = response.data['id_universidad']

        self.data = {
            'id_nombre_completo_fk': self.nombre_completo_id,
            'id_area_especialidad_fk': self.area_especialidad_id,
            'universidad_fk': self.universidad_id,
            'tipo': 'Interno',
            'correo': 'brandon.castillo.badilla@est.una.ac.cr'
        }


    def test_post_evaluador(self):

        url = reverse('evaluador-list')
        response = self.client.post(url, self.data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Evaluador.objects.count(), 1)
        self.assertEqual(Evaluador.objects.get().correo, 'brandon.castillo.badilla@est.una.ac.cr')
        self.assertEqual(Evaluador.objects.get().tipo, 'Interno')
   

    def test_put_evaluador(self):
        
        self.client.post(reverse('evaluador-list'), self.data, format='json')

        # Datos actualizados
        update_data = {
            'id_nombre_completo_fk': self.nombre_completo_id,
            'id_area_especialidad_fk': self.area_especialidad_id,
            'universidad_fk': self.universidad_id,
            'tipo': 'Interno',
            'correo': 'brandonchin07@gmail.com'
        }

        
        url = reverse('evaluador-detail', args=[1])
        response = self.client.put(url, update_data, format='json')
        evaluador = Evaluador.objects.get(id_evaluador=1)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(evaluador.tipo, 'Interno')
        self.assertEqual(evaluador.correo, 'brandonchin07@gmail.com')

    def test_get_lista_evaluadores(self):

        # Crea los datos de Prueba relacionados
        nombre_completo_data2 = {
            'nombre': 'Brenda',
            'apellido': 'Ramos',
            'segundo_apellido': 'Gutierrez'
        }
        area_especialidad_data2 = {
            'nombre': 'Dermatología'
        }
        universidad_data2 = {
            'pais': 'Nicaragua',
            'nombre': 'Universidad Nacional Autónoma de Nicaragua'
        }

        response_nombre = self.client.post(reverse('nombrecompleto-list'), nombre_completo_data2, format='json')
        response_area = self.client.post(reverse('areaespecialidad-list'), area_especialidad_data2, format='json')
        response_universidad = self.client.post(reverse('universidad-list'), universidad_data2, format='json')

        # Creando datos de prueba 2
        data2 = {
            'id_nombre_completo_fk': response_nombre.data['id_nombre_completo'],
            'id_area_especialidad_fk': response_area.data['id_area_especialidad'], 
            'universidad_fk': response_universidad.data['id_universidad'],
            'tipo': 'Externo',
            'correo': 'brandon.castillo@gmail.com'
        }

       

        self.client.post(reverse('evaluador-list'), self.data, format='json')
        self.client.post(reverse('evaluador-list'), data2, format='json')
        url = reverse('evaluador-list')
        response = self.client.get(url)
        
        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  

    def test_get_buscar_evaluador(self):

        self.client.post(reverse('evaluador-list'), self.data, format='json')
        url = reverse('evaluador-detail', args=[1])
        response = self.client.get(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['correo'], 'brandon.castillo.badilla@est.una.ac.cr')

    def test_delete_evaluador(self):
       
        self.client.post(reverse('evaluador-list'), self.data, format='json')
        url = reverse('evaluador-detail', args=[1])
        response = self.client.delete(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Evaluador.objects.count(), 0)