from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from ..models import PropuestaProyecto
from django.contrib.auth.models import Group

class PropuestaProyectoTests(APITestCase):

    def setUp(self):

        # Crea el usuario de prueba
        self.user = User.objects.create_user(username='testuser', password='testpassword', is_staff=True, is_superuser=True)
        admin_group, created = Group.objects.get_or_create(name='administrador')
        self.user.groups.add(admin_group)
        self.token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        # Crea los datos de Prueba
        self.data = {
            'id_codigo_cimpa': 'COD001-2023',
            'detalle': 'Detalle de la propuesta',
            'estado': 'En revisión',
            'nombre': 'Proyecto ABC',
            'descripcion': 'Descripción del proyecto ABC',
            'fecha_vigencia': '2023-09-04T15:30:00',
            'actividad': 'Actividad XYZ'
        }

    def test_post_propuesta_proyecto(self):

        url = reverse('propuestaproyecto-list')
        response = self.client.post(url, self.data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(PropuestaProyecto.objects.count(), 1)
        self.assertEqual(PropuestaProyecto.objects.get().nombre, 'Proyecto ABC')

    def test_put_propuesta_proyecto(self):
       
       # Datos actualizados
        update_data = {
            'id_codigo_cimpa': 'COD001-2023',
            'detalle': 'Detalle Actualizado',
            'estado': 'En revisión',
            'nombre': 'Proyecto DEF',
            'descripcion': 'Descripción del proyecto ABC',
            'fecha_vigencia': '2023-09-04T15:30:00',
            'actividad': 'Actividad XYZ'
        }

        self.client.post(reverse('propuestaproyecto-list'), self.data, format='json')
        url = reverse('propuestaproyecto-detail', args=['COD001-2023'])
        response = self.client.put(url, update_data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(PropuestaProyecto.objects.get().nombre, 'Proyecto DEF')

    def test_get_lista_propuestas_proyectos(self):

        # Carga de datos 2
        data2 = {
            'id_codigo_cimpa': 'COD002-2022',
            'detalle': 'Otro Detalle',
            'estado': 'Aprobado',
            'nombre': 'Proyecto GHI',
            'descripcion': 'Descripción del proyecto GHI',
            'fecha_vigencia': '2024-01-01T12:00:00',
            'actividad': 'Otra Actividad'
        }

        self.client.post(reverse('propuestaproyecto-list'), self.data, format='json')
        self.client.post(reverse('propuestaproyecto-list'), data2, format='json')
        url = reverse('propuestaproyecto-list')
        response = self.client.get(url)
        url2 = reverse('propuestaproyecto-detail', args=['COD002-2022'])
        response2 = self.client.get(url2)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        self.assertEqual(response2.data['nombre'], 'Proyecto GHI')

    def test_get_buscar_propuesta_proyecto(self):

        self.client.post(reverse('propuestaproyecto-list'), self.data, format='json')
        url = reverse('propuestaproyecto-detail', args=['COD001-2023'])
        response = self.client.get(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nombre'], 'Proyecto ABC')

    def test_delete_propuesta_proyecto(self):
        
        self.client.post(reverse('propuestaproyecto-list'), self.data, format='json')
        url = reverse('propuestaproyecto-detail', args=['COD001-2023'])
        response = self.client.delete(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(PropuestaProyecto.objects.count(), 0)
