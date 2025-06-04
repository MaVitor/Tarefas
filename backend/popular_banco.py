import os
import sys
import django

# Configurando o Django
sys.path.append('/workspaces/tp4-api-de-gerenciamento-de-tarefas-MaVitor/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from tarefas.models import Projeto, Tarefa
from django.utils import timezone

def setup_database():
    print("Configurando banco de dados...")
    
    # Criar usuário de teste se não existir
    if not User.objects.filter(username='teste').exists():
        user = User.objects.create_user(
            username='teste',
            email='teste@email.com',
            password='123456',
            first_name='Usuário',
            last_name='Teste'
        )
        print(f"Usuário criado: {user.username}")
        
        # Criar token para o usuário
        token, created = Token.objects.get_or_create(user=user)
        print(f"Token criado: {token.key}")
    else:
        user = User.objects.get(username='teste')
        print(f"Usuário já existe: {user.username}")
    
    # Criar usuário admin se não existir
    if not User.objects.filter(username='admin').exists():
        admin = User.objects.create_superuser(
            username='admin',
            email='admin@email.com',
            password='admin123',
            first_name='Admin',
            last_name='Sistema'
        )
        print(f"Admin criado: {admin.username}")
        
        # Criar token para o admin
        token, created = Token.objects.get_or_create(user=admin)
        print(f"Token admin criado: {token.key}")
    else:
        admin = User.objects.get(username='admin')
        print(f"Admin já existe: {admin.username}")
    
    # Criar projeto de exemplo se não existir
    if not Projeto.objects.filter(nome='Projeto de Exemplo').exists():
        projeto = Projeto.objects.create(
            nome='Projeto de Exemplo',
            descricao='Este é um projeto de exemplo para demonstrar o sistema',
            proprietario=user
        )
        print(f"Projeto criado: {projeto.nome}")
        
        # Criar tarefas de exemplo
        tarefas_exemplo = [
            {
                'titulo': 'Configurar ambiente de desenvolvimento',
                'descricao': 'Instalar e configurar todas as dependências necessárias',
                'status': 'concluída'
            },
            {
                'titulo': 'Implementar autenticação',
                'descricao': 'Adicionar sistema de login e logout com tokens',
                'status': 'em_progresso'
            },
            {
                'titulo': 'Criar documentação',
                'descricao': 'Documentar todas as APIs e funcionalidades',
                'status': 'pendente'
            }
        ]
        
        for tarefa_data in tarefas_exemplo:
            tarefa = Tarefa.objects.create(
                titulo=tarefa_data['titulo'],
                descricao=tarefa_data['descricao'],
                status=tarefa_data['status'],
                projeto=projeto,
                atribuido_a=user if tarefa_data['status'] != 'pendente' else None
            )
            
            if tarefa_data['status'] == 'concluída':
                tarefa.data_conclusao = timezone.now()
                tarefa.save()
            
            print(f"Tarefa criada: {tarefa.titulo}")
    
    print("\nBanco de dados configurado com sucesso!")
    print("\nCredenciais de acesso:")
    print("Usuário: teste | Senha: 123456")
    print("Admin: admin | Senha: admin123")

if __name__ == '__main__':
    setup_database()
