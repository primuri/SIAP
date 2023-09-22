from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import InformeViewSet, VersionInformeViewSet, AccionViewSet

router = DefaultRouter()
router.register(r'informes', InformeViewSet)
router.register(r'versioninformes', VersionInformeViewSet)
router.register(r'acciones', AccionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
