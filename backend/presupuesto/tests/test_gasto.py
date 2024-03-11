from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from ..models import Gasto
from django.contrib.auth.models import Group
from usuario_personalizado.models import Usuario
from django.core.files.uploadedfile import SimpleUploadedFile

class GastoTests(APITestCase):

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

        self.colaborador_data = {
            'tipo': 'Principal',
            'carga': '50%',
            'estado': 'Activo',
            'id_vigencia_fk': self.vigencia_id,
            'id_academico_fk': self.academico_id
        }

        response = self.client.post(reverse('colaboradorprincipal-list'), self.colaborador_data, format='json')
        self.colaborador_id = response.data['id_colaborador_principal']

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
            'id_codigo_vi': '1-2024'
        }

        response = self.client.post(reverse('proyecto-list'), self.proyecto, format='json')
        self.proyecto_id = response.data['id_codigo_vi']

        file = SimpleUploadedFile("oficio.pdf", b"oficio 1")

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

        self.version_proyecto = {
            'detalle': 'Detalle de la version de proyecto',
            'numero_version': '1',
            'id_oficio_fk': self.oficio_id,
            'id_vigencia_fk': self.vigencia_id,
            'id_codigo_vi_fk': self.proyecto_id
        }

        response = self.client.post(reverse('versionproyecto-list'), self.version_proyecto, format='json')
        self.version_proyecto_id = response.data['id_version_proyecto']

        self.tipo_presupuesto = {
            'tipo': 'Arte',
            'detalle': 'detalle'
        }   

        self.ente_financiero = {
            'nombre': 'Arte'
        }

        file2 = SimpleUploadedFile("oficio.pdf", b"content of the pdf")
        self.oficio2 = {
            'detalle': 'Detalle de oficio',
            'ruta_archivo': file2
        }

        self.codigo_financiero = {
            'codigo': 'Arte'
        }

        response = self.client.post(reverse('tipopresupuesto-list'), self.tipo_presupuesto, format='json')
        self.tipo_presupuesto_id = response.data['id_tipo_presupuesto']

        response = self.client.post(reverse('entefinanciero-list'), self.ente_financiero, format='json')
        self.ente_financiero_id = response.data['id_ente_financiero']

        response = self.client.post(reverse('oficio-list'), self.oficio2, format='multipart')
        self.oficio2_id = response.data['id_oficio']
        
        response = self.client.post(reverse('codigofinanciero-list'), self.codigo_financiero, format='json')
        self.codigo_financiero_id = response.data['id_codigo_financiero']

        self.presupuesto = {
            'anio_aprobacion': '2010',
            'id_tipo_presupuesto_fk' : self.tipo_presupuesto_id,
            'id_ente_financiero_fk' : self.ente_financiero_id,
            'id_oficio_fk': self.oficio2_id,
            'id_codigo_vi' : self.proyecto_id,
            'id_codigo_financiero_fk' : self.codigo_financiero_id,
            'id_version_proyecto_fk': self.version_proyecto_id
        } 

        response = self.client.post(reverse('presupuesto-list'), self.presupuesto, format='json')
        self.presupuesto_id = response.data['id_presupuesto']

        self.version_presupuesto ={
            'version': '2',
            'monto'  : '432',
            'saldo'  : '6531',
            'fecha'  : '2023-09-04T15:30:00',
            'detalle': 'hola',
            'id_presupuesto_fk' : self.presupuesto_id
        }

        response = self.client.post(reverse('versionpresupuesto-list'), self.version_presupuesto, format='json')
        self.version_presupuesto_id = response.data['id_version_presupuesto']
       
        self.partida = {
            'detalle' : 'prueba',
            'monto' : '200',
            'saldo' : '5000',
            'id_version_presupuesto_fk' : self.version_presupuesto_id
        }

        response = self.client.post(reverse('partida-list'), self.partida, format='json')
        self.partida_id = response.data['id_partida']

        file3 = SimpleUploadedFile("documento1.pdf", b"content of the pdf")

        # Crea los datos de Prueba
        self.documento = {
            'detalle': 'Detalle de documento',
            'tipo': 'Acceso',
            'documento': file3
        }

        response =self.client.post(reverse('documento-list'), self.documento, format='multipart')
        self.documento_id = response.data['id_documento']

        self.proveedor = {
            'id_cedula_proveedor': '123456789',
            'tipo' : 'Juridico',
            'correo': '1234@gmail.com',
            'nombre' : 'Sillas',
            'telefono' : '8888888',
            'id_documento_fk': self.documento_id
        }

        self.producto_servicio = {
            'id_producto_servicio' : '12',
            'detalle': 'Pintura'
        }

        response =self.client.post(reverse('proveedor-list'), self.proveedor, format='json')
        self.proveedor_id = response.data['id_cedula_proveedor']

        response =self.client.post(reverse('productoservicio-list'), self.producto_servicio, format='json')
        self.producto_servicio_id = response.data['id_producto_servicio']

        self.factura = {
            'id_cedula_proveedor_fk': self.proveedor_id,
            'id_producto_servicio_fk' : self.producto_servicio_id
        }

        response =self.client.post(reverse('factura-list'), self.factura, format='json')
        self.factura_id = response.data['id_factura']

        self.data = {
            'fecha': '2024-03-04T15:30:00',
            'detalle': 'Gasto de muebles',
            'monto': '5680',
            'id_partida_fk': self.partida_id,
            'id_factura_fk': self.factura_id,
            'tipo': 'Minimo'
        }

    def test_post_gasto(self):

        url = reverse('gasto-list')
        response = self.client.post(url, self.data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Gasto.objects.count(), 1)
        self.assertEqual(Gasto.objects.get().detalle, 'Gasto de muebles')

    def test_put_gasto(self):
        update_data = {
            'fecha': '2024-03-04T15:30:00',
            'detalle': 'Gasto de muebles',
            'monto': '5680',
            'id_partida_fk': self.partida_id,
            'id_factura_fk': self.factura_id,
            'tipo': 'Maximo'
        }
        
        self.client.post(reverse('gasto-list'), self.data, format='json')
        url = reverse('gasto-detail', args=[1])
        response = self.client.put(url, update_data, format='json')

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Gasto.objects.get().tipo, 'Maximo')
    
     
    def test_get_lista_gastos(self):
    
        data2 = {
            'fecha': '2024-01-04T15:30:00',
            'detalle': 'Camisa',
            'monto': '9253',
            'id_partida_fk': self.partida_id,
            'id_factura_fk': self.factura_id,
            'tipo': 'Medio'
        }

        self.client.post(reverse('gasto-list'), self.data, format='json')
        self.client.post(reverse('gasto-list'), data2, format='json')
        url = reverse('gasto-list')
        response = self.client.get(url)
        url2 = reverse('gasto-detail', args=[2])
        response2 = self.client.get(url2)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        self.assertEqual(response2.data['detalle'], 'Camisa')

        
    def test_get_buscar_gasto(self):

        self.client.post(reverse('gasto-list'), self.data, format='json')
        url = reverse('gasto-detail', args=[1])
        response = self.client.get(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['detalle'], 'Gasto de muebles')

    def test_delete_gasto(self):
        
        self.client.post(reverse('gasto-list'), self.data, format='json')
        url = reverse('gasto-detail', args=[1])
        response = self.client.delete(url)

        # Verificaciones
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Gasto.objects.count(), 0)
