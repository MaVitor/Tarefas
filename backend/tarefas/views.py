from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from .models import Projeto, Tarefa
from .serializers import ProjetoSerializer, TarefaSerializer, UserSerializer
from django.utils import timezone
from django.db.models import Count

class CustomAuthToken(ObtainAuthToken):
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data
        })

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]  # Permitir acesso sem autenticação para criar usuários
    
    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]

class ProjetoViewSet(viewsets.ModelViewSet):
    queryset = Projeto.objects.all()
    serializer_class = ProjetoSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Se não especificar proprietário, usar o usuário atual
        if not serializer.validated_data.get('proprietario'):
            serializer.save(proprietario=self.request.user)
        else:
            serializer.save()

    @action(detail=True, methods=['get'])
    def tarefas_do_projeto(self, request, pk=None):
        projeto = self.get_object()
        tarefas = projeto.tarefas.all()
        serializer = TarefaSerializer(tarefas, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def resumo_progresso(self, request, pk=None):
        projeto = self.get_object()
        total = projeto.tarefas.count()
        concluidas = projeto.tarefas.filter(status='concluída').count()
        pendentes = projeto.tarefas.filter(status='pendente').count()
        em_progresso = projeto.tarefas.filter(status='em_progresso').count()
        return Response({
            "total_tarefas": total,
            "concluidas": concluidas,
            "pendentes": pendentes,
            "em_progresso": em_progresso
        })

    @action(detail=True, methods=['post'])
    def atribuir_proprietario(self, request, pk=None):
        projeto = self.get_object()
        user_id = request.data.get('user_id')
        try:
            user = User.objects.get(pk=user_id)
            projeto.proprietario = user
            projeto.save()
            return Response({'status': 'Proprietário atualizado'})
        except User.DoesNotExist:
            return Response({'error': 'Usuário não encontrado'}, status=404)

class TarefaViewSet(viewsets.ModelViewSet):
    queryset = Tarefa.objects.all()
    serializer_class = TarefaSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['post'])
    def marcar_concluida(self, request, pk=None):
        tarefa = self.get_object()
        tarefa.status = 'concluída'
        tarefa.data_conclusao = timezone.now()
        tarefa.save()
        return Response({'status': 'Tarefa marcada como concluída'})

    @action(detail=True, methods=['post'])
    def atribuir_usuario(self, request, pk=None):
        tarefa = self.get_object()
        user_id = request.data.get('user_id')
        try:
            user = User.objects.get(pk=user_id)
            tarefa.atribuido_a = user
            tarefa.save()
            return Response({'status': 'Usuário atribuído'})
        except User.DoesNotExist:
            return Response({'error': 'Usuário não encontrado'}, status=404)

    @action(detail=True, methods=['post'])
    def remover_usuario(self, request, pk=None):
        tarefa = self.get_object()
        tarefa.atribuido_a = None
        tarefa.save()
        return Response({'status': 'Usuário removido da tarefa'})

    @action(detail=True, methods=['post'])
    def mudar_status(self, request, pk=None):
        tarefa = self.get_object()
        novo_status = request.data.get('status')
        if novo_status not in dict(Tarefa.STATUS_CHOICES):
            return Response({'error': 'Status inválido'}, status=400)
        tarefa.status = novo_status
        if novo_status == 'concluída':
            tarefa.data_conclusao = timezone.now()
        tarefa.save()
        return Response({'status': f'Status alterado para {novo_status}'})

    @action(detail=False, methods=['get'])
    def tarefas_por_usuario(self, request):
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response({'error': 'user_id é obrigatório'}, status=400)
        tarefas = Tarefa.objects.filter(atribuido_a__id=user_id)
        serializer = self.get_serializer(tarefas, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def numero_tarefas_por_projeto(self, request):
        dados = (
            Tarefa.objects.values('projeto__nome')
            .annotate(total=Count('id'))
            .order_by('total')
        )
        return Response(list(dados))
