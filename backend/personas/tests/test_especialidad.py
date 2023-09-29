from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from ..models import AreaEspecialidad
from django.contrib.auth.models import Group
from usuario_personalizado.models import Usuario

class AreaEspecialidadTests(APITestCase):

    def setUp(self):

        # Crea el usuario de prueba usando el modelo personalizado
        self.user = Usuario.objects.create_user(correo='testuser@example.com', password='testpassword')
        admin_group, created = Group.objects.get_or_create(name='administrador')
        self.user.groups.add(admin_group)
        self.token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        # Crea los datos de Prueba
        self.data = {
            'nombre': 'Medicina'
        }

    def test_post_area_especialidad(self):

        url = reverse('areaespecialidad-list')
        response = self.client.post(url, self.data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(AreaEspecialidad.objects.count(), 1)
        self.assertEqual(AreaEspecialidad.objects.get().nombre, 'Medicina')

    def test_put_area_especialidad(self):

        # Datos actualizados
        update_data = {
            'nombre': 'Letras'
        }

        self.client.post(reverse('areaespecialidad-list'), self.data, format='json')
        url = reverse('areaespecialidad-detail', args=[1])
        response = self.client.put(url, update_data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(AreaEspecialidad.objects.get().nombre, 'Letras')

    def test_get_lista_areas_especialidad(self):
       
        #Carga de datos 2
        data2 = {
            'nombre': 'Derecho'
        }

        data3 = {
            'nombre': 'Derecho'
        }

        self.client.post(reverse('areaespecialidad-list'), self.data, format='json')
        self.client.post(reverse('areaespecialidad-list'), data2, format='json')
        url = reverse('areaespecialidad-list')
        response = self.client.get(url)
        url2 = reverse('areaespecialidad-detail', args=[2])
        response2 = self.client.get(url2)
        response3 = self.client.post(reverse('areaespecialidad-list'), data3, format='json') 
        

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        self.assertEqual(response2.data['nombre'], 'Derecho')
        self.assertEqual(response3.status_code, status.HTTP_400_BAD_REQUEST) # Evalua  que el nombre sea unique
        self.assertIn('nombre', response3.data)  

    def test_get_buscar_area_especialidad(self):

        self.client.post(reverse('areaespecialidad-list'), self.data, format='json')
        url = reverse('areaespecialidad-detail', args=[1])
        response = self.client.get(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nombre'], 'Medicina')

    def test_delete_area_especialidad(self):

        self.client.post(reverse('areaespecialidad-list'), self.data, format='json')
        url = reverse('areaespecialidad-detail', args=[1])
        response = self.client.delete(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(AreaEspecialidad.objects.count(), 0)