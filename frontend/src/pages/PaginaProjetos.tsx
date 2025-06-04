"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { servicoProjeto, servicoUsuario, type Projeto, type Usuario } from "../services/api"
import { Plus, Trash2, Edit, FolderOpen } from "lucide-react"
import toast from "react-hot-toast"

function PaginaProjetos() {
  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [carregando, setCarregando] = useState(true)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [projetoEditando, setProjetoEditando] = useState<Projeto | null>(null)
  const [dadosFormulario, setDadosFormulario] = useState({
    nome: "",
    descricao: "",
    proprietario: "",
  })

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      setCarregando(true)
      console.log("🔄 Carregando dados da página de projetos...")

      // Carregar dados com Promise.allSettled para melhor tratamento de erros
      const resultados = await Promise.allSettled([servicoProjeto.obterTodos(), servicoUsuario.obterTodos()])

      // Processar projetos
      if (resultados[0].status === "fulfilled") {
        const dadosProjetos = resultados[0].value
        if (Array.isArray(dadosProjetos)) {
          setProjetos(dadosProjetos)
          console.log(`✅ ${dadosProjetos.length} projetos carregados`)
        } else {
          console.error("❌ Dados de projetos não são um array:", dadosProjetos)
          setProjetos([])
        }
      } else {
        console.error("❌ Erro ao carregar projetos:", resultados[0].reason)
        toast.error("Não foi possível carregar os projetos")
        setProjetos([])
      }

      // Processar usuários
      if (resultados[1].status === "fulfilled") {
        const dadosUsuarios = resultados[1].value
        if (Array.isArray(dadosUsuarios)) {
          setUsuarios(dadosUsuarios)
          console.log(`✅ ${dadosUsuarios.length} usuários carregados`)
        } else {
          console.error("❌ Dados de usuários não são um array:", dadosUsuarios)
          setUsuarios([])
        }
      } else {
        console.error("❌ Erro ao carregar usuários:", resultados[1].reason)
        toast.error("Não foi possível carregar os usuários")
        setUsuarios([])
      }
    } catch (erro) {
      console.error("❌ Erro geral ao carregar dados:", erro)
      toast.error("Erro ao carregar dados da página")
    } finally {
      setCarregando(false)
    }
  }

  const manipularEnvio = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (projetoEditando) {
        // Atualizar projeto existente
        await servicoProjeto.atualizar(projetoEditando.id, {
          nome: dadosFormulario.nome,
          descricao: dadosFormulario.descricao,
          proprietario_id: Number.parseInt(dadosFormulario.proprietario),
        })
        toast.success("Projeto atualizado com sucesso!")
      } else {
        // Criar novo projeto
        await servicoProjeto.criar({
          nome: dadosFormulario.nome,
          descricao: dadosFormulario.descricao,
          proprietario_id: Number.parseInt(dadosFormulario.proprietario),
        })
        toast.success("Projeto criado com sucesso!")
      }

      setMostrarModal(false)
      setProjetoEditando(null)
      setDadosFormulario({ nome: "", descricao: "", proprietario: "" })
      carregarDados()
    } catch (erro) {
      console.error("Erro ao salvar projeto:", erro)
    }
  }

  const manipularEdicao = (projeto: Projeto) => {
    setProjetoEditando(projeto)
    setDadosFormulario({
      nome: projeto.nome,
      descricao: projeto.descricao,
      proprietario: projeto.proprietario.id.toString(),
    })
    setMostrarModal(true)
  }

  const manipularExclusao = async (id: number) => {
    if (window.confirm("Tem certeza que deseja deletar este projeto?")) {
      try {
        await servicoProjeto.deletar(id)
        toast.success("Projeto deletado com sucesso!")
        carregarDados()
      } catch (erro) {
        console.error("Erro ao deletar projeto:", erro)
      }
    }
  }

  const abrirModalCriacao = () => {
    setProjetoEditando(null)
    setDadosFormulario({ nome: "", descricao: "", proprietario: "" })
    setMostrarModal(true)
  }

  if (carregando) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Carregando projetos...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projetos</h1>
          <p className="text-gray-600">Gerencie seus projetos ({projetos.length} projetos)</p>
        </div>
        <button
          onClick={abrirModalCriacao}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Projeto
        </button>
      </div>

      {/* Mostrar mensagem se não houver projetos */}
      {projetos.length === 0 ? (
        <div className="text-center py-12">
          <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum projeto encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">Comece criando um novo projeto.</p>
          <div className="mt-6">
            <button
              onClick={abrirModalCriacao}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Projeto
            </button>
          </div>
        </div>
      ) : (
        /* Lista de projetos */
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projetos.map((projeto) => (
            <div key={projeto.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-900">{projeto.nome}</h3>
                <div className="flex space-x-2">
                  <button onClick={() => manipularEdicao(projeto)} className="text-gray-400 hover:text-blue-600">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button onClick={() => manipularExclusao(projeto.id)} className="text-gray-400 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4">{projeto.descricao}</p>

              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium text-gray-700">Proprietário:</span> {projeto.proprietario.username}
                </p>
                <p className="text-sm text-gray-500">
                  Criado em: {new Date(projeto.data_criacao).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para criar/editar projeto */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {projetoEditando ? "Editar Projeto" : "Novo Projeto"}
              </h3>

              <form onSubmit={manipularEnvio} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nome</label>
                  <input
                    type="text"
                    value={dadosFormulario.nome}
                    onChange={(e) => setDadosFormulario({ ...dadosFormulario, nome: e.target.value })}
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
                  <label className="block text-sm font-medium text-gray-700">Proprietário</label>
                  <select
                    value={dadosFormulario.proprietario}
                    onChange={(e) => setDadosFormulario({ ...dadosFormulario, proprietario: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Selecione um proprietário</option>
                    {usuarios.map((usuario) => (
                      <option key={usuario.id} value={usuario.id.toString()}>
                        {usuario.username}
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
                    {projetoEditando ? "Atualizar" : "Criar"}
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

export default PaginaProjetos
