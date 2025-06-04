"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import toast from "react-hot-toast"

function PaginaLogin() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  })
  const [carregando, setCarregando] = useState(false)
  const { fazerLogin } = useAuth()

  const manipularEnvio = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!credentials.username || !credentials.password) {
      toast.error("Preencha todos os campos")
      return
    }

    try {
      setCarregando(true)
      await fazerLogin(credentials)
    } catch (erro) {
      console.error("Erro no login:", erro)
      toast.error("Credenciais inválidas")
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sistema de Gerenciamento de Tarefas
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">Faça login para acessar o sistema</p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <form onSubmit={manipularEnvio} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Usuário
              </label>
              <input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Digite seu usuário"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Digite sua senha"
                required
              />
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {carregando ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Credenciais de teste:</strong>
            </p>
            <p className="text-xs text-gray-500">
              Usuário: <code>teste</code>
              <br />
              Senha: <code>123456</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaginaLogin
