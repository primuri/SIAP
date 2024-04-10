from rest_framework import viewsets
from rest_framework import status
from rest_framework.response import Response
from .models import TipoPresupuesto, EnteFinanciero, Presupuesto, VersionPresupuesto, Partida, Proveedor, ProductoServicio, Factura, Gasto, CuentaBancaria, CodigoFinanciero
from .serializers import TipoPresupuestoSerializer, EnteFinancieroSerializer, PresupuestoSerializer, VersionPresupuestoSerializer, PartidaSerializer, ProveedorSerializer, ProductoServicioSerializer, FacturaSerializer, GastoSerializer, CuentaBancariaSerializer, CodigoFinancieroSerializer

from django_files.permisos import PermisoPorRol
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class TipoPresupuestoViewSet(viewsets.ModelViewSet):
    view_name = 'tipo_presupuestoss'
    queryset = TipoPresupuesto.objects.all()
    serializer_class = TipoPresupuestoSerializer

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class EnteFinancieroViewSet(viewsets.ModelViewSet):
    view_name = 'entes_financieros'
    queryset = EnteFinanciero.objects.all()
    serializer_class = EnteFinancieroSerializer
    def get_queryset(self):
        queryset = EnteFinanciero.objects.all()
        nombre = self.request.query_params.get('nombre', None)
        if nombre is not None:
            queryset = queryset.filter(nombre=nombre)
        return queryset

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class CodigoFinancieroViewSet(viewsets.ModelViewSet):
    view_name = 'codigo_financieross'
    queryset = CodigoFinanciero.objects.all()
    serializer_class = CodigoFinancieroSerializer

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class PresupuestoViewSet(viewsets.ModelViewSet):
    view_name = 'presupuestos'
    queryset = Presupuesto.objects.all()
    serializer_class = PresupuestoSerializer
    def get_queryset(self):
        queryset = super().get_queryset()
        id_version_proyecto = self.request.query_params.get('id_version_proyecto', None)
        if id_version_proyecto is not None:
            queryset = queryset.filter(id_version_proyecto_fk=id_version_proyecto)

        return queryset

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class VersionPresupuestoViewSet(viewsets.ModelViewSet):
    view_name = 'versiones_presupuestos'
    queryset = VersionPresupuesto.objects.all()
    serializer_class = VersionPresupuestoSerializer

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class PartidaViewSet(viewsets.ModelViewSet):
    view_name = 'partidas'
    queryset = Partida.objects.all()
    serializer_class = PartidaSerializer

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class ProveedorViewSet(viewsets.ModelViewSet):
    view_name = 'proveedores'
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class ProductoServicioViewSet(viewsets.ModelViewSet):
    view_name = 'productos_servicios'
    queryset = ProductoServicio.objects.all()
    serializer_class = ProductoServicioSerializer

    def create(self, request, *args, **kwargs):
        detalle = request.data.get('detalle')

        # Verificar si ya existe un ProductoServicio con el mismo detalle
        producto_servicio_existente = ProductoServicio.objects.filter(detalle=detalle).first()
        if producto_servicio_existente:
            # Devolver el ID del ProductoServicio existente
            return Response({'id_producto_servicio': producto_servicio_existente.id_producto_servicio}, status=status.HTTP_200_OK)

        # Si no existe, continuar con la creación normal
        return super().create(request, *args, **kwargs)

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class FacturaViewSet(viewsets.ModelViewSet):
    view_name = 'facturas'
    queryset = Factura.objects.all()
    serializer_class = FacturaSerializer

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class GastoViewSet(viewsets.ModelViewSet):
    view_name = 'gastos'
    queryset = Gasto.objects.all()
    serializer_class = GastoSerializer

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated, PermisoPorRol])
class CuentaBancariaViewSet(viewsets.ModelViewSet):
    view_name = 'cuentas_bancarias'
    queryset = CuentaBancaria.objects.all()
    serializer_class = CuentaBancariaSerializer
