from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager, Group
from personas.models import Evaluador, Academico

class UsuarioManager(BaseUserManager):

    def _create_user(self, correo, password, **extra_fields):
        if not correo:
            raise ValueError("Debe ingresar una dirección de correo electrónico")
        
        if not password:
            raise ValueError("Debe ingresar una contraseña")

        user = self.model(
            correo=self.normalize_email(correo),
            **extra_fields
        )

        user.set_password(password)
        user.save(using=self._db)
    
        return user

    def create_user(self, correo, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(correo, password, **extra_fields)

    def create_superuser(self, correo, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_superuser', True)
        return self._create_user(correo, password, **extra_fields)

class Usuario(AbstractBaseUser, PermissionsMixin): 
    correo = models.EmailField(db_index=True, unique=True, max_length=254)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)

    evaluador_fk = models.ForeignKey(Evaluador, on_delete=models.SET_NULL, blank=True, null=True)
    academico_fk = models.ForeignKey(Academico, on_delete=models.SET_NULL, blank=True, null=True)

    objects = UsuarioManager()

    USERNAME_FIELD = 'correo'
    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
