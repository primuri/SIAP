from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager, Group
from personas.models import Evaluador, Academico
import logging
from django.db.models.signals import pre_delete
from django.db.models.signals import pre_save
from django.core.mail import send_mail
from threading import Thread
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.db.models.signals import post_save,post_delete
from django.dispatch import receiver
from django.forms.models import model_to_dict
from django.core.mail import EmailMessage


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
    id = models.AutoField(primary_key=True)
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

@receiver(post_save, sender=Usuario)
def usuario_post_save(sender, instance, created, **kwargs):
    if created:
        asunto = f"Usuario Creado: {instance.correo}"
    else:
        asunto = f"Usuario Actualizado: {instance.correo}"
    correo_usuarios(instance, asunto, "brandonbadilla143@gmail.com") 


@receiver(post_delete, sender=Usuario)
def usuario_post_delete(sender, instance, **kwargs):
    asunto = f"Usuario Eliminado: {instance.correo}"
    correo_usuarios(instance, asunto,"brandonbadilla143@gmail.com" , es_eliminado=True)

logger = logging.getLogger(__name__)

def correo_usuarios(usuario, asunto, destinatario, es_eliminado=False):
    def enviar():
        try:
            rol_usuario = 'No Aplicable (Usuario Eliminado)' if es_eliminado else determinar_rol_usuario(usuario)
            mensaje_html = render_to_string('usuario_creado_email.html', {
                'usuario': usuario,
                'rol_usuario': rol_usuario,
                'es_eliminado': es_eliminado,
                'investigador': f"{usuario.academico_fk.id_nombre_completo_fk.nombre} {usuario.academico_fk.id_nombre_completo_fk.apellido} {usuario.academico_fk.id_nombre_completo_fk.segundo_apellido}" if usuario.academico_fk else "No tiene Investigador",
                'evaluador': f"{usuario.evaluador_fk.id_nombre_completo_fk.nombre} {usuario.evaluador_fk.id_nombre_completo_fk.apellido} {usuario.evaluador_fk.id_nombre_completo_fk.segundo_apellido}" if usuario.evaluador_fk else "No tiene Evaluador"
            })
            
            correo = EmailMessage(
                subject=asunto,
                body=mensaje_html,
                from_email=settings.EMAIL_HOST_USER,
                to=[destinatario],
            )
            correo.content_subtype = 'html'
            correo.send()
        except Exception as e:
            logger.error(f"Error al enviar el correo de notificación: {e}")
    Thread(target=enviar).start()

def determinar_rol_usuario(usuario):
    if usuario.is_superuser:
        return 'Root'
    elif usuario.evaluador_fk_id and usuario.academico_fk_id:
        return 'Evaluador/Investigador'
    elif usuario.academico_fk_id:
        return 'Investigador'
    elif usuario.evaluador_fk_id:
        return 'Evaluador'
    return 'Invitado'