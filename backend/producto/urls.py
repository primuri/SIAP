from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventoViewSet, ProductoViewSet, RevistaViewSet, ArticuloViewSet, AreaViewSet, SoftwareViewSet

router = DefaultRouter()
router.register(r'productos', ProductoViewSet)
router.register(r'revistas', RevistaViewSet)
router.register(r'articulos', ArticuloViewSet)
router.register(r'areas', AreaViewSet)
router.register(r'eventos', EventoViewSet)
router.register(r'softwares', SoftwareViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
