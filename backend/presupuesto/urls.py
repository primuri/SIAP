from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CuentaBancariaViewSet, FacturaViewSet, GastoViewSet, PartidaViewSet, ProductoServicioViewSet, ProveedorViewSet, TipoPresupuestoViewSet, EnteFinancieroViewSet, PresupuestoViewSet, VersionPresupuestoViewSet, CodigoFinancieroViewSet

router = DefaultRouter()
router.register(r'tipo_presupuestos', TipoPresupuestoViewSet)
router.register(r'ente_financieros', EnteFinancieroViewSet)
router.register(r'presupuestos', PresupuestoViewSet)
router.register(r'version_presupuestos', VersionPresupuestoViewSet)
router.register(r'partidas', PartidaViewSet)
router.register(r'proveedores', ProveedorViewSet)
router.register(r'productos_servicios', ProductoServicioViewSet)
router.register(r'facturas', FacturaViewSet)
router.register(r'gastos', GastoViewSet)
router.register(r'cuentas_bancarias', CuentaBancariaViewSet)
router.register(r'codigos_financieros', CodigoFinancieroViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
