"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { servicoTarefa, servicoProjeto, servicoUsuario, type Tarefa, type Projeto, type Usuario } from "../services/api"
import { Plus, Trash2, Edit } from "lucide-react"
import toast from "react-hot-toast"

function PaginaTarefas() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([])
  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [carregando, setCarregando] = useState(true)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [tarefaEditando, setTarefaEditando] = useState<Tarefa | null>(null)
  const [dadosFormulario, setDadosFormulario] = useState({
    titulo: "",
    descricao: "",
    projeto: "",
  })

  useEffect(() => {
    carregarDados()
  }, [])

  // Adicionar tratamento de erros mais detalhado
  const carregarDados = async () => {
    try {
      setCarregando(true)

      // Carregar tarefas
      const dadosTarefas = await servicoTarefa.obterTodas().catch((erro) => {
        console.error("Erro ao carregar tarefas:", erro)
        toast.error("Não foi possível carregar as tarefas")
        return []
      })

      // Carregar projetos
      const dadosProjetos = await servicoProjeto.obterTodos().catch((erro) => {
        console.error("Erro ao carregar projetos:", erro)
        toast.error("Não foi possível carregar os projetos")
        return []
      })

      // Carregar usuários
      const dadosUsuarios = await servicoUsuario.obterTodos().catch((erro) => {
        console.error("Erro ao carregar usuários:", erro)
        toast.error("Não foi possível carregar os usuários")
        return []
      })

      setTarefas(dadosTarefas)
      setProjetos(dadosProjetos)
      setUsuarios(dadosUsuarios)
    } catch (erro) {
      console.error("Erro ao carregar dados:", erro)
    } finally {
      setCarregando(false)
    }
  }

  const manipularEnvio = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (tarefaEditando) {
        // Atualizar tarefa existente
        await servicoTarefa.atualizar(tarefaEditando.id, {
          titulo: dadosFormulario.titulo,
          descricao: dadosFormulario.descricao,
          projeto_id: Number.parseInt(dadosFormulario.projeto),
        })
        toast.success("Tarefa atualizada com sucesso!")
      } else {
        // Criar nova tarefa
        await servicoTarefa.criar({
          titulo: dadosFormulario.titulo,
          descricao: dadosFormulario.descricao,
          projeto_id: Number.parseInt(dadosFormulario.projeto),
        })
        toast.success("Tarefa criada com sucesso!")
      }

      setMostrarModal(false)
      setTarefaEditando(null)
      setDadosFormulario({ titulo: "", descricao: "", projeto: "" })
      carregarDados()
    } catch (erro) {
      console.error("Erro ao salvar tarefa:", erro)
    }
  }

  const manipularEdicao = (tarefa: Tarefa) => {
    setTarefaEditando(tarefa)
    setDadosFormulario({
      titulo: tarefa.titulo,
      descricao: tarefa.descricao,
      projeto: tarefa.projeto.id.toString(),
    })
    setMostrarModal(true)
  }

  const manipularExclusao = async (id: number) => {
    if (window.confirm("Tem certeza que deseja deletar esta tarefa?")) {
      try {
        await servicoTarefa.deletar(id)
        toast.success("Tarefa deletada com sucesso!")
        carregarDados()
      } catch (erro) {
        console.error("Erro ao deletar tarefa:", erro)
      }
    }
  }

  const manipularMudancaStatus = async (idTarefa: number, novoStatus: string) => {
    try {
      await servicoTarefa.mudarStatus(idTarefa, novoStatus)
      toast.success("Status atualizado com sucesso!")
      carregarDados()
    } catch (erro) {
      console.error("Erro ao atualizar status:", erro)
    }
  }

  const manipularAtribuicaoUsuario = async (idTarefa: number, idUsuario: string) => {
    try {
      if (idUsuario) {
        await servicoTarefa.atribuirUsuario(idTarefa, Number.parseInt(idUsuario))
        toast.success("Usuário atribuído com sucesso!")
      } else {
        await servicoTarefa.removerUsuario(idTarefa)
        toast.success("Usuário removido da tarefa!")
      }
      carregarDados()
    } catch (erro) {
      console.error("Erro ao atribuir usuário:", erro)
    }
  }

  const abrirModalCriacao = () => {
    setTarefaEditando(null)
    setDadosFormulario({ titulo: "", descricao: "", projeto: "" })
    setMostrarModal(true)
  }

  const obterCorStatus = (status: string) => {
    switch (status) {
      case "pendente":
        return "bg-yellow-100 text-yellow-800"
      case "em_progresso":
        return "bg-blue-100 text-blue-800"
      case "concluída":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const obterTextoStatus = (status: string) => {
    switch (status) {
      case "pendente":
        return "Pendente"
      case "em_progresso":
        return "Em Progresso"
      case "concluída":
        return "Concluída"
      default:
        return status
    }
  }

  if (carregando) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tarefas</h1>
          <p className="text-gray-600">Gerencie suas tarefas</p>
        </div>
        <button
          onClick={abrirModalCriacao}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Tarefa
        </button>
      </div>

      {/* Lista de tarefas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tarefas.map((tarefa) => (
          <div key={tarefa.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">{tarefa.titulo}</h3>
              <div className="flex space-x-2">
                <button onClick={() => manipularEdicao(tarefa)} className="text-gray-400 hover:text-blue-600">
                  <Edit className="h-4 w-4" />
                </button>
                <button onClick={() => manipularExclusao(tarefa.id)} className="text-gray-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4">{tarefa.descricao}</p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={tarefa.status}
                  onChange={(e) => manipularMudancaStatus(tarefa.id, e.target.value)}
                  className="block w-full text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="pendente">Pendente</option>
                  <option value="em_progresso">Em Progresso</option>
                  <option value="concluída">Concluída</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Atribuído a</label>
                <select
                  value={tarefa.atribuido_a?.id.toString() || ""}
                  onChange={(e) => manipularAtribuicaoUsuario(tarefa.id, e.target.value)}
                  className="block w-full text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Nenhum usuário</option>
                  {usuarios.map((usuario) => (
                    <option key={usuario.id} value={usuario.id.toString()}>
                      {usuario.username}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${obterCorStatus(tarefa.status)}`}
                >
                  {obterTextoStatus(tarefa.status)}
                </span>
                <span className="text-xs text-gray-500">{tarefa.projeto.nome}</span>
              </div>

              <div className="text-xs text-gray-500 pt-2 border-t">
                Criado em: {new Date(tarefa.data_criacao).toLocaleDateString("pt-BR")}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para criar/editar tarefa */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {tarefaEditando ? "Editar Tarefa" : "Nova Tarefa"}
              </h3>

              <form onSubmit={manipularEnvio} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Título</label>
                  <input
                    type="text"
                    value={dadosFormulario.titulo}
                    onChange={(e) => setDadosFormulario({ ...dadosFormulario, titulo: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Descrição</label>
                  <textarea
                    value={dadosFormulario.descricao}
                    onChange={(e) => setDadosFormulario({ ...dadosFormulario, descricao: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Projeto</label>
                  <select
                    value={dadosFormulario.projeto}
                    onChange={(e) => setDadosFormulario({ ...dadosFormulario, projeto: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Selecione um projeto</option>
                    {projetos.map((projeto) => (
                      <option key={projeto.id} value={projeto.id.toString()}>
                        {projeto.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setMostrarModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                  >
                    {tarefaEditando ? "Atualizar" : "Criar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PaginaTarefas
