from django.contrib.auth.models import Group
from rest_framework import serializers
from usuario_personalizado.models import Usuario
from personas.models import Academico, Evaluador
from personas.serializers import EvaluadorSerializer, AcademicoSerializer


class UserSerializer(serializers.ModelSerializer):
    groups = serializers.SlugRelatedField(
        many=True,
        slug_field='name',
        queryset=Group.objects.all(),
        required=False
    )

    class Meta(object):
        model = Usuario
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['groups'] = [group.name for group in instance.groups.all()]
        data['evaluador_fk'] = EvaluadorSerializer(instance.evaluador_fk).data
        data['academico_fk'] = AcademicoSerializer(instance.academico_fk).data
        return data

    def create(self, validated_data):
        groups_data = validated_data.pop('groups')
        user = Usuario.objects.create(**validated_data)
        for group_name in groups_data:
            group, created = Group.objects.get_or_create(name=group_name)
            user.groups.add(group)
        return user
