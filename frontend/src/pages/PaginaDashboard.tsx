"use client"

import { useState, useEffect } from "react"
import { servicoProjeto, servicoTarefa, servicoUsuario } from "../services/api"
import { FolderOpen, CheckSquare, Users, TrendingUp, RefreshCw } from "lucide-react"
import toast from "react-hot-toast"

interface EstatisticasDashboard {
  totalProjetos: number
  totalTarefas: number
  totalUsuarios: number
  tarefasConcluidas: number
  tarefasPendentes: number
  tarefasEmProgresso: number
}

function PaginaDashboard() {
  const [estatisticas, setEstatisticas] = useState<EstatisticasDashboard>({
    totalProjetos: 0,
    totalTarefas: 0,
    totalUsuarios: 0,
    tarefasConcluidas: 0,
    tarefasPendentes: 0,
    tarefasEmProgresso: 0,
  })
  const [carregando, setCarregando] = useState(true)
  const [recarregando, setRecarregando] = useState(false)

  useEffect(() => {
    carregarDadosDashboard()
  }, [])

  const carregarDadosDashboard = async () => {
    try {
      setCarregando(true)

      // Carregar dados
      const projetos = await servicoProjeto.obterTodos()
      const tarefas = await servicoTarefa.obterTodas()
      const usuarios = await servicoUsuario.obterTodos()

      // Calcular estatísticas das tarefas
      const tarefasConcluidas = tarefas.filter((tarefa) => tarefa?.status === "concluída").length
      const tarefasPendentes = tarefas.filter((tarefa) => tarefa?.status === "pendente").length
      const tarefasEmProgresso = tarefas.filter((tarefa) => tarefa?.status === "em_progresso").length

      const novasEstatisticas = {
        totalProjetos: projetos.length,
        totalTarefas: tarefas.length,
        totalUsuarios: usuarios.length,
        tarefasConcluidas,
        tarefasPendentes,
        tarefasEmProgresso,
      }

      setEstatisticas(novasEstatisticas)
      toast.success("Dados carregados com sucesso!")
    } catch (erro) {
      console.error("Erro ao carregar dados do dashboard:", erro)
      toast.error("Não foi possível carregar os dados do dashboard")
    } finally {
      setCarregando(false)
      setRecarregando(false)
    }
  }

  const handleRecarregar = () => {
    setRecarregando(true)
    carregarDadosDashboard()
  }

  if (carregando && !recarregando) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Carregando dados...</span>
      </div>
    )
  }

  const cartoesEstatisticas = [
    {
      nome: "Total de Projetos",
      valor: estatisticas.totalProjetos,
      icone: FolderOpen,
      cor: "bg-blue-500",
    },
    {
      nome: "Total de Tarefas",
      valor: estatisticas.totalTarefas,
      icone: CheckSquare,
      cor: "bg-green-500",
    },
    {
      nome: "Total de Usuários",
      valor: estatisticas.totalUsuarios,
      icone: Users,
      cor: "bg-purple-500",
    },
    {
      nome: "Tarefas Concluídas",
      valor: estatisticas.tarefasConcluidas,
      icone: TrendingUp,
      cor: "bg-emerald-500",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Visão geral do sistema de gerenciamento de tarefas</p>
        </div>
        <button
          onClick={handleRecarregar}
          disabled={recarregando}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {recarregando ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Recarregando...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Recarregar Dados
            </>
          )}
        </button>
      </div>

      {/* Cartões de estatísticas */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cartoesEstatisticas.map((cartao) => {
          const Icone = cartao.icone
          return (
            <div key={cartao.nome} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`${cartao.cor} p-3 rounded-md`}>
                      <Icone className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{cartao.nome}</dt>
                      <dd className="text-lg font-medium text-gray-900">{cartao.valor}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Resumo de status das tarefas */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Status das Tarefas</h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{estatisticas.tarefasPendentes}</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-yellow-800">Pendentes</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{estatisticas.tarefasEmProgresso}</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-800">Em Progresso</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{estatisticas.tarefasConcluidas}</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">Concluídas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaginaDashboard
