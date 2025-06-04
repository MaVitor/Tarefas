"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { servicoUsuario, type Usuario } from "../services/api"
import { Plus, Trash2, Edit, Mail, UserIcon } from "lucide-react"
import toast from "react-hot-toast"

function PaginaUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [carregando, setCarregando] = useState(true)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null)
  const [dadosFormulario, setDadosFormulario] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  })

  useEffect(() => {
    carregarUsuarios()
  }, [])

  // Adicionar tratamento de erros mais detalhado
  const carregarUsuarios = async () => {
    try {
      setCarregando(true)
      const dados = await servicoUsuario.obterTodos().catch((erro) => {
        console.error("Erro ao carregar usuários:", erro)
        toast.error("Não foi possível carregar os usuários")
        return []
      })
      setUsuarios(dados)
    } catch (erro) {
      console.error("Erro ao carregar usuários:", erro)
    } finally {
      setCarregando(false)
    }
  }

  const manipularEnvio = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (usuarioEditando) {
        // Atualizar usuário existente
        const { password, ...dadosAtualizacao } = dadosFormulario
        await servicoUsuario.atualizar(usuarioEditando.id, dadosAtualizacao)
        toast.success("Usuário atualizado com sucesso!")
      } else {
        // Criar novo usuário
        await servicoUsuario.criar(dadosFormulario)
        toast.success("Usuário criado com sucesso!")
      }

      setMostrarModal(false)
      setUsuarioEditando(null)
      setDadosFormulario({ username: "", email: "", password: "", first_name: "", last_name: "" })
      carregarUsuarios()
    } catch (erro) {
      console.error("Erro ao salvar usuário:", erro)
    }
  }

  const manipularEdicao = (usuario: Usuario) => {
    setUsuarioEditando(usuario)
    setDadosFormulario({
      username: usuario.username,
      email: usuario.email,
      password: "", // Não mostrar senha existente
      first_name: usuario.first_name,
      last_name: usuario.last_name,
    })
    setMostrarModal(true)
  }

  const manipularExclusao = async (id: number) => {
    if (window.confirm("Tem certeza que deseja deletar este usuário?")) {
      try {
        await servicoUsuario.deletar(id)
        toast.success("Usuário deletado com sucesso!")
        carregarUsuarios()
      } catch (erro) {
        console.error("Erro ao deletar usuário:", erro)
      }
    }
  }

  const abrirModalCriacao = () => {
    setUsuarioEditando(null)
    setDadosFormulario({ username: "", email: "", password: "", first_name: "", last_name: "" })
    setMostrarModal(true)
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
          <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
          <p className="text-gray-600">Gerencie os usuários do sistema</p>
        </div>
        <button
          onClick={abrirModalCriacao}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Usuário
        </button>
      </div>

      {/* Lista de usuários */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {usuarios.map((usuario) => (
          <div key={usuario.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{usuario.username}</h3>
                  <p className="text-sm text-gray-500">ID: {usuario.id}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => manipularEdicao(usuario)} className="text-gray-400 hover:text-blue-600">
                  <Edit className="h-4 w-4" />
                </button>
                <button onClick={() => manipularExclusao(usuario.id)} className="text-gray-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{usuario.email}</span>
              </div>

              {(usuario.first_name || usuario.last_name) && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Nome:</span> {usuario.first_name} {usuario.last_name}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal para criar/editar usuário */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {usuarioEditando ? "Editar Usuário" : "Novo Usuário"}
              </h3>

              <form onSubmit={manipularEnvio} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    value={dadosFormulario.username}
                    onChange={(e) => setDadosFormulario({ ...dadosFormulario, username: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={dadosFormulario.email}
                    onChange={(e) => setDadosFormulario({ ...dadosFormulario, email: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password {usuarioEditando && "(deixe em branco para manter a atual)"}
                  </label>
                  <input
                    type="password"
                    value={dadosFormulario.password}
                    onChange={(e) => setDadosFormulario({ ...dadosFormulario, password: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required={!usuarioEditando}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nome</label>
                    <input
                      type="text"
                      value={dadosFormulario.first_name}
                      onChange={(e) => setDadosFormulario({ ...dadosFormulario, first_name: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Sobrenome</label>
                    <input
                      type="text"
                      value={dadosFormulario.last_name}
                      onChange={(e) => setDadosFormulario({ ...dadosFormulario, last_name: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
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
                    {usuarioEditando ? "Atualizar" : "Criar"}
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

export default PaginaUsuarios
