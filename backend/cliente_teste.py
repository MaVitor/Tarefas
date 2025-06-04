import requests
import json

BASE_URL = "http://localhost:8000/api"

class APIClient:
    def __init__(self, base_url):
        self.base_url = base_url
    
    def menu_principal(self):
        while True:
            print("\n=== CLIENTE API GERENCIAMENTO DE TAREFAS ===")
            print("1. Gerenciar Usuários")
            print("2. Gerenciar Projetos") 
            print("3. Gerenciar Tarefas")
            print("0. Sair")
            
            opcao = input("Escolha uma opção: ")
            
            if opcao == "1":
                self.menu_usuarios()
            elif opcao == "2":
                self.menu_projetos()
            elif opcao == "3":
                self.menu_tarefas()
            elif opcao == "0":
                print("Saindo...")
                break
            else:
                print("Opção inválida!")
    
    def menu_usuarios(self):
        while True:
            print("\n=== GERENCIAR USUÁRIOS ===")
            print("1. Listar usuários")
            print("2. Criar usuário")
            print("3. Detalhar usuário")
            print("0. Voltar")
            
            opcao = input("Escolha uma opção: ")
            
            if opcao == "1":
                self.listar_usuarios()
            elif opcao == "2":
                self.criar_usuario()
            elif opcao == "3":
                self.detalhar_usuario()
            elif opcao == "0":
                break
            else:
                print("Opção inválida!")
    
    def menu_projetos(self):
        while True:
            print("\n=== GERENCIAR PROJETOS ===")
            print("1. Listar projetos")
            print("2. Criar projeto")
            print("3. Detalhar projeto")
            print("4. Atualizar projeto")
            print("5. Deletar projeto")
            print("6. Ver tarefas do projeto")
            print("7. Resumo de progresso")
            print("8. Atribuir proprietário")
            print("0. Voltar")
            
            opcao = input("Escolha uma opção: ")
            
            if opcao == "1":
                self.listar_projetos()
            elif opcao == "2":
                self.criar_projeto()
            elif opcao == "3":
                self.detalhar_projeto()
            elif opcao == "4":
                self.atualizar_projeto()
            elif opcao == "5":
                self.deletar_projeto()
            elif opcao == "6":
                self.tarefas_do_projeto()
            elif opcao == "7":
                self.resumo_progresso()
            elif opcao == "8":
                self.atribuir_proprietario()
            elif opcao == "0":
                break
            else:
                print("Opção inválida!")
    
    def menu_tarefas(self):
        while True:
            print("\n=== GERENCIAR TAREFAS ===")
            print("1. Listar tarefas")
            print("2. Criar tarefa")
            print("3. Detalhar tarefa")
            print("4. Atualizar tarefa")
            print("5. Deletar tarefa")
            print("6. Marcar como concluída")
            print("7. Atribuir usuário")
            print("8. Remover usuário")
            print("9. Mudar status")
            print("10. Tarefas por usuário")
            print("11. Número de tarefas por projeto")
            print("0. Voltar")
            
            opcao = input("Escolha uma opção: ")
            
            if opcao == "1":
                self.listar_tarefas()
            elif opcao == "2":
                self.criar_tarefa()
            elif opcao == "3":
                self.detalhar_tarefa()
            elif opcao == "4":
                self.atualizar_tarefa()
            elif opcao == "5":
                self.deletar_tarefa()
            elif opcao == "6":
                self.marcar_concluida()
            elif opcao == "7":
                self.atribuir_usuario_tarefa()
            elif opcao == "8":
                self.remover_usuario_tarefa()
            elif opcao == "9":
                self.mudar_status_tarefa()
            elif opcao == "10":
                self.tarefas_por_usuario()
            elif opcao == "11":
                self.numero_tarefas_por_projeto()
            elif opcao == "0":
                break
            else:
                print("Opção inválida!")
    
    # Métodos para Usuários
    def listar_usuarios(self):
        try:
            response = requests.get(f"{self.base_url}/usuarios/")
            if response.status_code == 200:
                usuarios = response.json()
                print("\n=== USUÁRIOS ===")
                for usuario in usuarios:
                    print(f"ID: {usuario['id']} - {usuario['username']} ({usuario['email']})")
            else:
                print(f"Erro: {response.status_code}")
        except Exception as e:
            print(f"Erro de conexão: {e}")
    
    def criar_usuario(self):
        username = input("Username: ")
        email = input("Email: ")
        password = input("Password: ")
        first_name = input("Primeiro nome: ")
        last_name = input("Último nome: ")
        
        data = {
            "username": username,
            "email": email,
            "password": password,
            "first_name": first_name,
            "last_name": last_name
        }
        
        try:
            response = requests.post(f"{self.base_url}/usuarios/", json=data)
            if response.status_code == 201:
                print("Usuário criado com sucesso!")
                print(json.dumps(response.json(), indent=2))
            else:
                print(f"Erro: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"Erro de conexão: {e}")
    
    def detalhar_usuario(self):
        user_id = input("ID do usuário: ")
        try:
            response = requests.get(f"{self.base_url}/usuarios/{user_id}/")
            if response.status_code == 200:
                print(json.dumps(response.json(), indent=2))
            else:
                print(f"Erro: {response.status_code}")
        except Exception as e:
            print(f"Erro de conexão: {e}")
    
    # Métodos para Projetos
    def listar_projetos(self):
        try:
            response = requests.get(f"{self.base_url}/projetos/")
            if response.status_code == 200:
                projetos = response.json()
                print("\n=== PROJETOS ===")
                for projeto in projetos:
                    print(f"ID: {projeto['id']} - {projeto['nome']}")
                    print(f"Descrição: {projeto['descricao']}")
                    print(f"Proprietário: {projeto['proprietario']['username']}")
                    print("-" * 40)
            else:
                print(f"Erro: {response.status_code}")
        except Exception as e:
            print(f"Erro de conexão: {e}")
    
    def criar_projeto(self):
        nome = input("Nome do projeto: ")
        descricao = input("Descrição: ")
        proprietario_id = input("ID do proprietário: ")
        
        data = {
            "nome": nome,
            "descricao": descricao,
            "proprietario": proprietario_id
        }
        
        try:
            response = requests.post(f"{self.base_url}/projetos/", json=data)
            if response.status_code == 201:
                print("Projeto criado com sucesso!")
                print(json.dumps(response.json(), indent=2))
            else:
                print(f"Erro: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"Erro de conexão: {e}")
    
    def detalhar_projeto(self):
        projeto_id = input("ID do projeto: ")
        try:
            response = requests.get(f"{self.base_url}/projetos/{projeto_id}/")
            if response.status_code == 200:
                print(json.dumps(response.json(), indent=2))
            else:
                print(f"Erro: {response.status_code}")
        except Exception as e:
            print(f"Erro de conexão: {e}")
    
    def atualizar_projeto(self):
        projeto_id = input("ID do projeto: ")
        nome = input("Novo nome: ")
        descricao = input("Nova descrição: ")
        proprietario_id = input("ID do proprietário: ")
        
        data = {
            "nome": nome,
            "descricao": descricao,
            "proprietario": proprietario_id
        }
        
        try:
            response = requests.put(f"{self.base_url}/projetos/{projeto_id}/", json=data)
            if response.status_code == 200:
                print("Projeto atualizado com sucesso!")
                print(json.dumps(response.json(), indent=2))
            else:
                print(f"Erro: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"Erro de conexão: {e}")
    
    def deletar_projeto(self):
        projeto_id = input("ID do projeto: ")
        confirmacao = input("Tem certeza? (s/n): ")
        
        if confirmacao.lower() == 's':
            try:
                response = requests.delete(f"{self.base_url}/projetos/{projeto_id}/")
                if response.status_code == 204:
                    print("Projeto deletado com sucesso!")
                else:
                    print(f"Erro: {response.status_code}")
            except Exception as e:
                print(f"Erro de conexão: {e}")
    
    def tarefas_do_projeto(self):
        projeto_id = input("ID do projeto: ")
        try:
            response = requests.get(f"{self.base_url}/projetos/{projeto_id}/tarefas_do_projeto/")
            if response.status_code == 200:
                print(json.dumps(response.json(), indent=2))
            else:
                print(f"Erro: {response.status_code}")
        except Exception as e:
            print(f"Erro de conexão: {e}")
    
    def resumo_progresso(self):
        projeto_id = input("ID do projeto: ")
        try:
            response = requests.get(f"{self.base_url}/projetos/{projeto_id}/resumo_progresso/")
            if response.status_code == 200:
                print(json.dumps(response.json(), indent=2))
            else:
                print(f"Erro: {response.status_code}")
        except Exception as e:
            print(f"Erro de conexão: {e}")
    
    def atribuir_proprietario(self):
        projeto_id = input("ID do projeto: ")
        user_id = input("ID do usuário: ")
        
        data = {"user_id": user_id}
        
        try:
            response = requests.post(f"{self.base_url}/projetos/{projeto_id}/atribuir_proprietario/", json=data)
            if response.status_code == 200:
                print(json.dumps(response.json(), indent=2))
            else:
                print(f"Erro: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"Erro de conexão: {e}")
    
    # Métodos para Tarefas
    def listar_tarefas(self):
        try:
            response = requests.get(f"{self.base_url}/tarefas/")
            if response.status_code == 200:
                tarefas = response.json()
                print("\n=== TAREFAS ===")
                for tarefa in tarefas:
                    print(f"ID: {tarefa['id']} - {tarefa['titulo']}")
                    print(f"Status: {tarefa['status']}")
                    print(f"Projeto: {tarefa['projeto']['nome']}")
                    print("-" * 40)
            else:
                print(f"Erro: {response.status_code}")
        except Exception as e:
            print(f"Erro de conexão: {e}")
    
    def criar_tarefa(self):
        titulo = input("Título da tarefa: ")
        descricao = input("Descrição: ")
        projeto_id = input("ID do projeto: ")
        
        data = {
            "titulo": titulo,
            "descricao": descricao,
            "projeto": projeto_id
        }
        
        try:
            response = requests.post(f"{self.base_url}/tarefas/", json=data)
            if response.status_code == 201:
                print("Tarefa criada com sucesso!")
                print(json.dumps(response.json(), indent=2))
            else:
                print(f"Erro: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"Erro de conexão: {e}")
    
    def detalhar_tarefa(self):
        tarefa_id = input("ID da tarefa: ")
        try:
            response = requests.get(f"{self.base_url}/tarefas/{tarefa_id}/")
            if response.status_code == 200:
                print(json.dumps(response.json(), indent=2))
            else:
                print(f"Erro: {response.status_code}")
        except Exception as e:
            print(f"Erro de conexão: {e}")
    
    def atualizar_tarefa(self):
        tarefa_id = input("ID da tarefa: ")
        titulo = input("Novo título: ")
        descricao = input("Nova descrição: ")
        projeto_id = input("ID do projeto: ")
        
        data = {
            "titulo": titulo,
            "descricao": descricao,
            "projeto": projeto_id
        }
        
        try:
            response = requests.put(f"{self.base_url}/tarefas/{tarefa_id}/", json=data)
            if response.status_code == 200:
                print("Tarefa atualizada com sucesso!")
                print(json.dumps(response.json(), indent=2))
            else:
                print(f"Erro: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"Erro de conexão: {e}")
    
    def deletar_tarefa(self):
        tarefa_id = input("ID da tarefa: ")
        confirmacao = input("Tem certeza? (s/n): ")
        
        if confirmacao.lower() == 's':
            try:
                response = requests.delete(f"{self.base_url}/tarefas/{tarefa_id}/")
                if response.status_code == 204:
                    print("Tarefa deletada com sucesso!")
                else:
                    print(f"Erro: {response.status_code}")
            except Exception as e:
                print(f"Erro de conexão: {e}")
    
    def marcar_concluida(self):
        tarefa_id = input("ID da tarefa: ")
        try:
            response = requests.post(f"{self.base_url}/tarefas/{tarefa_id}/marcar_concluida/")
            if response.status_code == 200:
                print(json.dumps(response.json(), indent=2))
            else:
                print(f"Erro: {response.status_code}")
        except Exception as e:
            print(f"Erro de conexão: {e}")
    
    def atribuir_usuario_tarefa(self):
        tarefa_id = input("ID da tarefa: ")
        user_id = input("ID do usuário: ")
        
        data = {"user_id": user_id}
        
        try:
            response = requests.post(f"{self.base_url}/tarefas/{tarefa_id}/atribuir_usuario/", json=data)
            if response.status_code == 200:
                print(json.dumps(response.json(), indent=2))
            else:
                print(f"Erro: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"Erro de conexão: {e}")
    
    def remover_usuario_tarefa(self):
        tarefa_id = input("ID da tarefa: ")
        try:
            response = requests.post(f"{self.base_url}/tarefas/{tarefa_id}/remover_usuario/")
            if response.status_code == 200:
                print(json.dumps(response.json(), indent=2))
            else:
                print(f"Erro: {response.status_code}")
        except Exception as e:
            print(f"Erro de conexão: {e}")
    
    def mudar_status_tarefa(self):
        tarefa_id = input("ID da tarefa: ")
        print("Status disponíveis: pendente, em_progresso, concluída")
        status = input("Novo status: ")
        
        data = {"status": status}
        
        try:
            response = requests.post(f"{self.base_url}/tarefas/{tarefa_id}/mudar_status/", json=data)
            if response.status_code == 200:
                print(json.dumps(response.json(), indent=2))
            else:
                print(f"Erro: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"Erro de conexão: {e}")
    
    def tarefas_por_usuario(self):
        user_id = input("ID do usuário: ")
        try:
            response = requests.get(f"{self.base_url}/tarefas/tarefas_por_usuario/?user_id={user_id}")
            if response.status_code == 200:
                print(json.dumps(response.json(), indent=2))
            else:
                print(f"Erro: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"Erro de conexão: {e}")
    
    def numero_tarefas_por_projeto(self):
        try:
            response = requests.get(f"{self.base_url}/tarefas/numero_tarefas_por_projeto/")
            if response.status_code == 200:
                print(json.dumps(response.json(), indent=2))
            else:
                print(f"Erro: {response.status_code}")
        except Exception as e:
            print(f"Erro de conexão: {e}")

if __name__ == "__main__":
    client = APIClient(BASE_URL)
    client.menu_principal()
