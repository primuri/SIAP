from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User, Group
from usuario_personalizado.models import Usuario
from ..models import OrganoColegiado

class OrganoColegiadoTests(APITestCase):

    def setUp(self):
        # Crea el usuario de prueba usando el modelo personalizado
        self.user = Usuario.objects.create_user(correo='testuser@example.com', password='testpassword')
        admin_group, created = Group.objects.get_or_create(name='administrador')
        self.user.groups.add(admin_group)
        self.token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        # Crea los datos de Prueba para OrganoColegiado
        self.data = {
            'nombre': 'Consejo Académico',
            'numero_miembros': 10,
            'quorum': 6,
            'acuerdo_firme': 8
        }
    
    def test_post_organocolegiado(self):
        url = reverse('organocolegiado-list')
        response = self.client.post(url, self.data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(OrganoColegiado.objects.count(), 1)
        self.assertEqual(OrganoColegiado.objects.get().nombre, 'Consejo Académico')

    def test_put_organocolegiado(self):
        # Datos actualizados
        update_data = {
            'nombre': 'Consejo Directivo',
            'numero_miembros': 12,
            'quorum': 7,
            'acuerdo_firme': 9
        }

        self.client.post(reverse('organocolegiado-list'), self.data, format='json')
        url = reverse('organocolegiado-detail', args=[1])
        response = self.client.put(url, update_data, format='json')
        organo = OrganoColegiado.objects.get(id_organo_colegiado=1)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(organo.nombre, 'Consejo Directivo')
        self.assertEqual(organo.numero_miembros, 12)

    def test_get_lista_organocolegiado(self):
        data2 = {
            'nombre': 'Consejo de Estudiantes',
            'numero_miembros': 5,
            'quorum': 3,
            'acuerdo_firme': 4
        }

        self.client.post(reverse('organocolegiado-list'), self.data, format='json')
        self.client.post(reverse('organocolegiado-list'), data2, format='json')
        url = reverse('organocolegiado-list')
        response = self.client.get(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[1]['nombre'], 'Consejo de Estudiantes')

    def test_get_buscar_organo_colegiado(self):
        self.client.post(reverse('organocolegiado-list'), self.data, format='json')
        url = reverse('organocolegiado-detail', args=[1])
        response = self.client.get(url)

        #Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nombre'], 'Consejo Académico')


    def test_delete_organocolegiado(self):
        self.client.post(reverse('organocolegiado-list'), self.data, format='json')
        url = reverse('organocolegiado-detail', args=[1])
        response = self.client.delete(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(OrganoColegiado.objects.count(), 0)