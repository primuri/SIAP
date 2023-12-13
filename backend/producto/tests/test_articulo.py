from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from ..models import Articulo
from django.contrib.auth.models import Group
from usuario_personalizado.models import Usuario
from django.core.files.uploadedfile import SimpleUploadedFile


class ArticuloTests(APITestCase):

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

        file = SimpleUploadedFile("documentoArticulo.pdf", b"doc prueba producto articulo")

        # Crea los datos de Prueba
        self.documento = {
            'tipo': 'tipo',
            'detalle': 'Detalle de documento articulo',
            'documento': file
        }

        response = self.client.post(reverse('documento-list'), self.documento, format='multipart')
        self.documento_id = response.data['id_documento']

        self.revista = {
            'nombre': 'Arte',
            'pais': 'Costa Rica'
        }

        response = self.client.post(reverse('revista-list'), self.revista, format='json')
        self.revista_id = response.data['id_revista']

        self.nombre = {
            'nombre': 'Juan',
            'apellido': 'Perez',
            'segundo_apellido': 'Rodriguez'
        }

        self.autor = {
            'id_nombre_completo_fk': self.nombre
        }

        response = self.client.post(reverse('autor-list'), self.autor, format='json')
        self.autor_id = response.data['id_autor']

        self.data = {
            'nombre': 'Articulo numeros',
            'fecha_publicacion': '2023-10-30T00:00:00Z',
            'tipo': 'articulo',
            'doi': '1234',
            'isbn': '5566t',
            'cant_paginas': 25,
            'observaciones': '4rt',
            'id_producto_fk': self.producto_id,
            'id_documento_articulo_fk': self.documento_id,
            'id_revista_fk': self.revista_id,
            'id_autor_fk': self.autor_id
        }

    def test_post_articulo(self):

        url = reverse('articulo-list')
        response = self.client.post(url, self.data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Articulo.objects.count(), 1)
        self.assertEqual(Articulo.objects.get().nombre, 'Articulo numeros')

    def test_put_articulo(self):
        update_data = {
            'nombre': 'Articulo revista',
            'fecha_publicacion': '2023-10-30T00:00:00Z',
            'tipo': 'articulo',
            'doi': '1234',
            'isbn': '5566t',
            'cant_paginas': 25,
            'observaciones': '4rt',
            'id_producto_fk': self.producto_id,
            'id_documento_articulo_fk': self.documento_id,
            'id_revista_fk': self.revista_id,
            'id_autor_fk': self.autor_id
        }
        
        self.client.post(reverse('articulo-list'), self.data, format='json')
        url = reverse('articulo-detail', args=['1'])
        response = self.client.put(url, update_data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Articulo.objects.get().nombre, 'Articulo revista')

    def test_get_lista_articulos(self):
        data2 = {
            'nombre': 'Articulo news',
            'fecha_publicacion': '2023-10-30T00:00:00Z',
            'tipo': 'articulo2',
            'doi': '1234',
            'isbn': '455767',
            'cant_paginas': 25,
            'observaciones': '4rt',
            'id_producto_fk': self.producto_id,
            'id_documento_articulo_fk': self.documento_id,
            'id_revista_fk': self.revista_id,
            'id_autor_fk': self.autor_id
        }

        self.client.post(reverse('articulo-list'), self.data, format='json')
        self.client.post(reverse('articulo-list'), data2, format='json')
        url = reverse('articulo-list')
        response = self.client.get(url)
        url2 = reverse('articulo-detail', args=['2'])
        response2 = self.client.get(url2)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        self.assertEqual(response2.data['nombre'], 'Articulo news')

        
    def test_get_buscar_articulo(self):

        self.client.post(reverse('articulo-list'), self.data, format='json')
        url = reverse('articulo-detail', args=['1'])
        response = self.client.get(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nombre'], 'Articulo numeros')

    def test_delete_articulo(self):
        
        self.client.post(reverse('articulo-list'), self.data, format='json')
        url = reverse('articulo-detail', args=['1'])
        response = self.client.delete(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Articulo.objects.count(), 0)
