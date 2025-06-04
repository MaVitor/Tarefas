from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Projeto, Tarefa

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class ProjetoSerializer(serializers.ModelSerializer):
    proprietario = UserSerializer(read_only=True)
    class Meta:
        model = Projeto
        fields = ['id', 'nome', 'descricao', 'data_criacao', 'proprietario']

class TarefaSerializer(serializers.ModelSerializer):
    projeto = ProjetoSerializer(read_only=True)
    atribuido_a = UserSerializer(read_only=True)
    class Meta:
        model = Tarefa
        fields = [
            'id', 'titulo', 'descricao', 'status', 'data_criacao',
            'data_conclusao', 'projeto', 'atribuido_a'
        ]
