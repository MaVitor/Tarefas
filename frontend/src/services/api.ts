import axios from "axios"
import toast from "react-hot-toast"

// Configuração base do axios
const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 segundos de timeout
})

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken")
    if (token) {
      config.headers.Authorization = `Token ${token}`
    }
    return config
  },
  (erro) => {
    console.error("Erro no interceptor de request:", erro)
    return Promise.reject(erro)
  },
)

// Interceptor para tratar erros globalmente
api.interceptors.response.use(
  (resposta) => {
    return resposta
  },
  (erro) => {
    console.error("Erro na API:", {
      url: erro.config?.url,
      status: erro.response?.status,
    })

    if (erro.response?.status === 401) {
      // Token inválido ou expirado
      localStorage.removeItem("authToken")
      localStorage.removeItem("usuarioAtual")
      window.location.href = "/login"
      return Promise.reject(erro)
    }

    const mensagem = erro.response?.data?.detail || erro.response?.data?.message || erro.message || "Erro na requisição"
    toast.error(mensagem)
    return Promise.reject(erro)
  },
)

// Função auxiliar para extrair dados paginados
const extrairResultados = <T>(resposta: any): T[] => {
  // Verifica se a resposta tem o formato paginado
  if (resposta && typeof resposta === 'object' && 'results' in resposta && Array.isArray(resposta.results)) {
    return resposta.results as T[]
  }
  
  // Se não for paginado, verifica se é um array
  if (Array.isArray(resposta)) {
    return resposta as T[]
  }
  
  // Se não for nenhum dos dois, retorna array vazio
  return [] as T[]
}

// Tipos para nossa API
export interface Usuario {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
}

export interface Projeto {
  id: number
  nome: string
  descricao: string
  data_criacao: string
  proprietario: Usuario
}

export interface Tarefa {
  id: number
  titulo: string
  descricao: string
  status: "pendente" | "em_progresso" | "concluída"
  data_criacao: string
  data_conclusao: string | null
  projeto: Projeto
  atribuido_a: Usuario | null
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: Usuario
}

// Serviço de Autenticação
export const servicoAuth = {
  // Fazer login
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const resposta = await api.post("/auth/login/", credentials)
    return resposta.data
  },

  // Fazer logout
  logout: async (): Promise<void> => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("usuarioAtual")
  },
}

// Serviços para Usuários
export const servicoUsuario = {
  // Listar todos os usuários
  obterTodos: async (): Promise<Usuario[]> => {
    const resposta = await api.get("/usuarios/")
    return extrairResultados<Usuario>(resposta.data)
  },

  // Buscar usuário por ID
  obterPorId: async (id: number): Promise<Usuario> => {
    const resposta = await api.get(`/usuarios/${id}/`)
    return resposta.data
  },

  // Criar novo usuário
  criar: async (dadosUsuario: Omit<Usuario, "id"> & { password: string }): Promise<Usuario> => {
    const resposta = await api.post("/usuarios/", dadosUsuario)
    return resposta.data
  },

  // Atualizar usuário
  atualizar: async (id: number, dadosUsuario: Partial<Usuario>): Promise<Usuario> => {
    const resposta = await api.put(`/usuarios/${id}/`, dadosUsuario)
    return resposta.data
  },

  // Deletar usuário
  deletar: async (id: number): Promise<void> => {
    await api.delete(`/usuarios/${id}/`)
  },
}

// Serviços para Projetos
export const servicoProjeto = {
  // Listar todos os projetos
  obterTodos: async (): Promise<Projeto[]> => {
    const resposta = await api.get("/projetos/")
    return extrairResultados<Projeto>(resposta.data)
  },

  // Buscar projeto por ID
  obterPorId: async (id: number): Promise<Projeto> => {
    const resposta = await api.get(`/projetos/${id}/`)
    return resposta.data
  },

  // Criar novo projeto
  criar: async (dadosProjeto: { nome: string; descricao: string; proprietario_id?: number }): Promise<Projeto> => {
    const resposta = await api.post("/projetos/", dadosProjeto)
    return resposta.data
  },

  // Atualizar projeto
  atualizar: async (
    id: number,
    dadosProjeto: { nome: string; descricao: string; proprietario_id: number },
  ): Promise<Projeto> => {
    const resposta = await api.put(`/projetos/${id}/`, dadosProjeto)
    return resposta.data
  },

  // Deletar projeto
  deletar: async (id: number): Promise<void> => {
    await api.delete(`/projetos/${id}/`)
  },

  // Buscar tarefas do projeto
  obterTarefas: async (id: number): Promise<Tarefa[]> => {
    const resposta = await api.get(`/projetos/${id}/tarefas_do_projeto/`)
    return extrairResultados<Tarefa>(resposta.data)
  },

  // Resumo de progresso do projeto
  obterResumoProgresso: async (id: number) => {
    const resposta = await api.get(`/projetos/${id}/resumo_progresso/`)
    return resposta.data
  },

  // Atribuir proprietário
  atribuirProprietario: async (id: number, idUsuario: number) => {
    const resposta = await api.post(`/projetos/${id}/atribuir_proprietario/`, { user_id: idUsuario })
    return resposta.data
  },
}

// Serviços para Tarefas
export const servicoTarefa = {
  // Listar todas as tarefas
  obterTodas: async (): Promise<Tarefa[]> => {
    const resposta = await api.get("/tarefas/")
    return extrairResultados<Tarefa>(resposta.data)
  },

  // Buscar tarefa por ID
  obterPorId: async (id: number): Promise<Tarefa> => {
    const resposta = await api.get(`/tarefas/${id}/`)
    return resposta.data
  },

  // Criar nova tarefa
  criar: async (dadosTarefa: { titulo: string; descricao: string; projeto_id: number }): Promise<Tarefa> => {
    const resposta = await api.post("/tarefas/", dadosTarefa)
    return resposta.data
  },

  // Atualizar tarefa
  atualizar: async (
    id: number,
    dadosTarefa: { titulo: string; descricao: string; projeto_id: number },
  ): Promise<Tarefa> => {
    const resposta = await api.put(`/tarefas/${id}/`, dadosTarefa)
    return resposta.data
  },

  // Deletar tarefa
  deletar: async (id: number): Promise<void> => {
    await api.delete(`/tarefas/${id}/`)
  },

  // Marcar como concluída
  marcarConcluida: async (id: number) => {
    const resposta = await api.post(`/tarefas/${id}/marcar_concluida/`)
    return resposta.data
  },

  // Atribuir usuário à tarefa
  atribuirUsuario: async (id: number, idUsuario: number) => {
    const resposta = await api.post(`/tarefas/${id}/atribuir_usuario/`, { user_id: idUsuario })
    return resposta.data
  },

  // Remover usuário da tarefa
  removerUsuario: async (id: number) => {
    const resposta = await api.post(`/tarefas/${id}/remover_usuario/`)
    return resposta.data
  },

  // Mudar status da tarefa
  mudarStatus: async (id: number, status: string) => {
    const resposta = await api.post(`/tarefas/${id}/mudar_status/`, { status })
    return resposta.data
  },

  // Tarefas por usuário
  obterPorUsuario: async (idUsuario: number): Promise<Tarefa[]> => {
    const resposta = await api.get(`/tarefas/tarefas_por_usuario/?user_id=${idUsuario}`)
    return extrairResultados<Tarefa>(resposta.data)
  },

  // Número de tarefas por projeto
  obterContagemPorProjeto: async () => {
    const resposta = await api.get("/tarefas/numero_tarefas_por_projeto/")
    return resposta.data
  },
}

export default api
