from rest_framework import viewsets
from .models import TipoPresupuesto, EnteFinanciero, Presupuesto, VersionPresupuesto, Partida, Proveedor, ProductoServicio, Factura, Gasto, CuentaBancaria
from .serializers import TipoPresupuestoSerializer, EnteFinancieroSerializer, PresupuestoSerializer, VersionPresupuestoSerializer, PartidaSerializer, ProveedorSerializer, ProductoServicioSerializer, FacturaSerializer, GastoSerializer, CuentaBancariaSerializer

class TipoPresupuestoViewSet(viewsets.ModelViewSet):
    queryset = TipoPresupuesto.objects.all()
    serializer_class = TipoPresupuestoSerializer

class EnteFinancieroViewSet(viewsets.ModelViewSet):
    queryset = EnteFinanciero.objects.all()
    serializer_class = EnteFinancieroSerializer

class PresupuestoViewSet(viewsets.ModelViewSet):
    queryset = Presupuesto.objects.all()
    serializer_class = PresupuestoSerializer

class VersionPresupuestoViewSet(viewsets.ModelViewSet):
    queryset = VersionPresupuesto.objects.all()
    serializer_class = VersionPresupuestoSerializer

class PartidaViewSet(viewsets.ModelViewSet):
    queryset = Partida.objects.all()
    serializer_class = PartidaSerializer

class ProveedorViewSet(viewsets.ModelViewSet):
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer

class ProductoServicioViewSet(viewsets.ModelViewSet):
    queryset = ProductoServicio.objects.all()
    serializer_class = ProductoServicioSerializer

class FacturaViewSet(viewsets.ModelViewSet):
    queryset = Factura.objects.all()
    serializer_class = FacturaSerializer

class GastoViewSet(viewsets.ModelViewSet):
    queryset = Gasto.objects.all()
    serializer_class = GastoSerializer

class CuentaBancariaViewSet(viewsets.ModelViewSet):
    queryset = CuentaBancaria.objects.all()
    serializer_class = CuentaBancariaSerializer
