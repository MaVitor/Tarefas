# Sistema de Gerenciamento de Tarefas

sistema completo de gerenciamento de tarefas desenvolvido com Django Rest Framework (backend) e React (frontend).

## Requisitos

### Backend
- Python 3.8+
- Django 4.2+
- Django REST Framework
- PostgreSQL

### Frontend
- Node.js 16+
- npm ou yarn

## Configuração e Execução

### Backend

1. **Configurar ambiente virtual**:
   \`\`\`bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # No Windows: venv\Scripts\activate
   \`\`\`

2. **Instalar dependências**:
   \`\`\`bash
   pip install django djangorestframework django-cors-headers drf-yasg psycopg2-binary
   \`\`\`

3. **Configurar banco de dados**:
   - Certifique-se de que o PostgreSQL está instalado e rodando
   - Crie um banco de dados chamado "tarefas"
   - Ajuste as configurações em `backend/settings.py` se necessário

4. **Aplicar migrações**:
   \`\`\`bash
   python manage.py makemigrations
   python manage.py migrate
   \`\`\`

5. **Configurar dados iniciais**:
   \`\`\`bash
   python scripts/setup_database.py
   \`\`\`

6. **Iniciar servidor**:
   \`\`\`bash
   python manage.py runserver
   \`\`\`
   O servidor estará disponível em http://localhost:8000

### Frontend

1. **Instalar dependências**:
   \`\`\`bash
   npm install
   \`\`\`

2. **Iniciar aplicação em modo de desenvolvimento**:
   \`\`\`bash
   npm run dev
   \`\`\`
   A aplicação estará disponível em http://localhost:3000

## Credenciais de Acesso

Para acessar o sistema, utilize as seguintes credenciais:

- **Usuário**: teste
- **Senha**: 123456

Ou

- **Usuário**: admin
- **Senha**: admin123

## Funcionalidades

### Dashboard
- Visão geral com estatísticas do sistema
- Contagem de projetos, tarefas e usuários
- Distribuição de tarefas por status

### Projetos
- Listagem de projetos
- Criação, edição e exclusão de projetos
- Atribuição de proprietários

### Tarefas
- Listagem de tarefas
- Criação, edição e exclusão de tarefas
- Atribuição de usuários
- Mudança de status (pendente, em progresso, concluída)

### Usuários
- Listagem de usuários
- Criação, edição e exclusão de usuários

## API Endpoints

### Autenticação
- `POST /api/auth/login/` - Login

### Usuários
- `GET /api/usuarios/` - Listar usuários
- `POST /api/usuarios/` - Criar usuário
- `GET /api/usuarios/{id}/` - Detalhar usuário
- `PUT /api/usuarios/{id}/` - Atualizar usuário
- `DELETE /api/usuarios/{id}/` - Deletar usuário

### Projetos
- `GET /api/projetos/` - Listar projetos
- `POST /api/projetos/` - Criar projeto
- `GET /api/projetos/{id}/` - Detalhar projeto
- `PUT /api/projetos/{id}/` - Atualizar projeto
- `DELETE /api/projetos/{id}/` - Deletar projeto
- `GET /api/projetos/{id}/tarefas_do_projeto/` - Tarefas do projeto
- `GET /api/projetos/{id}/resumo_progresso/` - Resumo de progresso
- `POST /api/projetos/{id}/atribuir_proprietario/` - Atribuir proprietário

### Tarefas
- `GET /api/tarefas/` - Listar tarefas
- `POST /api/tarefas/` - Criar tarefa
- `GET /api/tarefas/{id}/` - Detalhar tarefa
- `PUT /api/tarefas/{id}/` - Atualizar tarefa
- `DELETE /api/tarefas/{id}/` - Deletar tarefa
- `POST /api/tarefas/{id}/marcar_concluida/` - Marcar como concluída
- `POST /api/tarefas/{id}/atribuir_usuario/` - Atribuir usuário
- `POST /api/tarefas/{id}/remover_usuario/` - Remover usuário
- `POST /api/tarefas/{id}/mudar_status/` - Mudar status
- `GET /api/tarefas/tarefas_por_usuario/` - Tarefas por usuário
- `GET /api/tarefas/numero_tarefas_por_projeto/` - Número de tarefas por projeto

## Documentação

Acesse a documentação Swagger em: `http://localhost:8000/swagger/`

## Solução de Problemas

Se encontrar problemas ao executar o sistema:

1. **Verifique se o backend está rodando**:
   \`\`\`bash
   curl http://localhost:8000/admin/
   \`\`\`

2. **Verifique o banco de dados**:
   \`\`\`bash
   python scripts/check_database.py
   \`\`\`

3. **Teste a API**:
   \`\`\`bash
   python scripts/test_backend.py
   \`\`\`

4. **Verifique os logs do console** no navegador (F12)

## Tecnologias Utilizadas

### Backend
- Django 5.2
- Django Rest Framework
- PostgreSQL
- drf-yasg (Swagger)

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Axios
- React Router
- React Hot Toast
