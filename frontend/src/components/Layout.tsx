"use client"

import type { ReactNode } from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { FolderOpen, CheckSquare, Users, LogOut, User, Home, Menu, X } from "lucide-react"
import { useState } from "react"

interface PropsLayout {
  children: ReactNode
}

function Layout({ children }: PropsLayout) {
  const { usuarioAtual, fazerLogout } = useAuth()
  const localizacao = useLocation()
  const [barraLateralAberta, setBarraLateralAberta] = useState(false)

  // Itens de navegação
  const itensNavegacao = [
    { nome: "Dashboard", href: "/", icone: Home },
    { nome: "Projetos", href: "/projetos", icone: FolderOpen },
    { nome: "Tarefas", href: "/tarefas", icone: CheckSquare },
    { nome: "Usuários", href: "/usuarios", icone: Users },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar para mobile */}
      <div className={`fixed inset-0 z-50 lg:hidden ${barraLateralAberta ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setBarraLateralAberta(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4">
            <h1 className="text-lg font-semibold text-gray-900">Sistema de Tarefas</h1>
            <button onClick={() => setBarraLateralAberta(false)} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {itensNavegacao.map((item) => {
              const Icone = item.icone
              const estaAtivo = localizacao.pathname === item.href
              return (
                <Link
                  key={item.nome}
                  to={item.href}
                  onClick={() => setBarraLateralAberta(false)}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    estaAtivo ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icone className="mr-3 h-5 w-5" />
                  {item.nome}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Sidebar para desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-4">
            <h1 className="text-lg font-semibold text-gray-900">Sistema de Tarefas</h1>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {itensNavegacao.map((item) => {
              const Icone = item.icone
              const estaAtivo = localizacao.pathname === item.href
              return (
                <Link
                  key={item.nome}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    estaAtivo ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icone className="mr-3 h-5 w-5" />
                  {item.nome}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setBarraLateralAberta(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1" />
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-700">{usuarioAtual?.username}</span>
              </div>
              <button
                onClick={fazerLogout}
                className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>

        {/* Conteúdo principal */}
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}

export default Layout
