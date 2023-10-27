from django.contrib import admin
from .models import TipoPresupuesto, EnteFinanciero, Presupuesto, VersionPresupuesto, Partida, Proveedor, ProductoServicio, Factura, Gasto, CuentaBancaria, CodigoFinanciero

# Register your models here.
admin.site.register(TipoPresupuesto)
admin.site.register(EnteFinanciero)
admin.site.register(Presupuesto)
admin.site.register(VersionPresupuesto)
admin.site.register(Partida)
admin.site.register(Proveedor)
admin.site.register(ProductoServicio)
admin.site.register(Factura)
admin.site.register(Gasto)
admin.site.register(CuentaBancaria)
admin.site.register(CodigoFinanciero)