## Estrutura do Projeto

- `backend/`: Configurações principais do Django
- `tarefas/`: App principal com os modelos, views e serializers
- `cliente_teste.py`: Cliente para testar a API
- `popular_banco.py`: Script para popular o banco de dados

## Funcionalidades Implementadas

- CRUD completo para Usuários, Projetos e Tarefas
- Ações personalizadas para Projetos:
  - Listar tarefas de um projeto
  - Resumo de progresso
  - Atribuir proprietário
- Ações personalizadas para Tarefas:
  - Marcar como concluída
  - Atribuir usuário
  - Remover usuário
  - Mudar status
  - Listar tarefas por usuário
  - Número de tarefas por projeto

## Como Executar

1. Instalar as dependências:
\`\`\`
pip install -r requirements.txt
\`\`\`

2. Executar as migrações:
\`\`\`
python manage.py makemigrations tarefas
python manage.py migrate
\`\`\`

3. Popular o banco de dados (opcional):
\`\`\`
python popular_banco.py
\`\`\`
Este script cria um usuário de teste, um projeto e três tarefas com diferentes status.

4. Iniciar o servidor:
\`\`\`
python manage.py runserver
\`\`\`

5. Acessear a documentação Swagger:
\`\`\`
http://localhost:8000/swagger/
\`\`\`

## Cliente de Teste

O arquivo `cliente_teste.py` contém um cliente Python para testar todos os endpoints da API. Ele oferece um menu interativo para:

- Gerenciar Usuários (listar, criar, detalhar)
- Gerenciar Projetos (listar, criar, atualizar, deletar, ver tarefas, resumo de progresso)
- Gerenciar Tarefas (listar, criar, atualizar, deletar, marcar como concluída, atribuir usuário)

Para executar o cliente:
\`\`\`
python cliente_teste.py
\`\`\`

## Requisitos

Os requisitos estão listados no arquivo `requirements.txt` e incluem:
- Django
- Django Rest Framework
- drf-yasg
- psycopg2
- requests

## Observações

- O banco de dados padrão ta como SQLite, mas tem uma configuração para PostgreSQL comentada no settings.py
- O admin do Django tá configurado para gerenciar os modelos
