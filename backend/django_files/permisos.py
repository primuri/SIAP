from rest_framework import permissions


class PermisoPorRol(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.groups.filter(name='evaluador').exists():
            return ((request.method in ['GET'] and view.view_name in ['proyectos', 'versiones_proyectos', 'informes']) or 
                    (request.method in ['GET', 'POST', 'PATCH'] and view.view_name in ['evaluaciones', 'respuestas_evaluaciones']))
        else:
            if request.user.groups.filter(name='investigador').exists():
                return (request.method in ['GET'] and (view.view_name in ['propuestas_proyectos', 'proyectos','academicos', 'documentos', 'documentos_asociados',  'versiones_proyectos', 'informes']))
            else:
                if request.user.groups.filter(name='invitado').exists():
                    return (request.method in ['GET'] and (view.view_name in ['organos_colegiados', 'integrantes', 'convocatorias', 'agendas', 'actas', 'sesiones', 'invitados', 'seguimientos', 'acuerdos', 'participantes']))
        return (request.user.groups.filter(name='administrador').exists())

    def has_object_permission(self, request, view, obj):
        if request.user.groups.filter(name='evaluador').exists():
            return ((request.method in ['GET'] and view.view_name in ['proyectos', 'versiones_proyectos', 'informes']) or 
                    (request.method in ['GET', 'POST', 'PATCH'] and view.view_name in ['evaluaciones', 'respuestas_evaluaciones']))
        else:
            if request.user.groups.filter(name='investigador').exists():
                return (request.method in ['GET'] and (view.view_name in ['propuestas_proyectos','academicos', 'proyectos', 'documentos','documentos_asociados', 'version_proyecto', 'informes']))
            else:
                if request.user.groups.filter(name='invitado').exists():
                    return (request.method in ['GET'] and (view.view_name in ['organos_colegiados', 'integrantes', 'convocatorias', 'agendas', 'actas', 'sesiones', 'invitados', 'seguimientos', 'acuerdos', 'participantes']))
        return (request.user.groups.filter(name='administrador').exists())
    