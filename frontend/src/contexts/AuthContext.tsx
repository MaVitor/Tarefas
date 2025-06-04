"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { servicoAuth, type Usuario, type LoginCredentials } from "../services/api"
import toast from "react-hot-toast"

interface TipoContextoAuth {
  estaAutenticado: boolean
  usuarioAtual: Usuario | null
  fazerLogin: (credentials: LoginCredentials) => Promise<void>
  fazerLogout: () => void
  carregando: boolean
}

const AuthContext = createContext<TipoContextoAuth | undefined>(undefined)

export function useAuth() {
  const contexto = useContext(AuthContext)
  if (contexto === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return contexto
}

interface PropsAuthProvider {
  children: ReactNode
}

export function AuthProvider({ children }: PropsAuthProvider) {
  const [estaAutenticado, setEstaAutenticado] = useState(false)
  const [usuarioAtual, setUsuarioAtual] = useState<Usuario | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    // Verificar se há usuário salvo no localStorage
    const usuarioSalvo = localStorage.getItem("usuarioAtual")
    const token = localStorage.getItem("authToken")

    if (usuarioSalvo && token) {
      try {
        const usuario = JSON.parse(usuarioSalvo)
        setUsuarioAtual(usuario)
        setEstaAutenticado(true)
      } catch (erro) {
        console.error("Erro ao recuperar usuário salvo:", erro)
        localStorage.removeItem("usuarioAtual")
        localStorage.removeItem("authToken")
      }
    }

    setCarregando(false)
  }, [])

  const fazerLogin = async (credentials: LoginCredentials) => {
    try {
      const resposta = await servicoAuth.login(credentials)

      localStorage.setItem("authToken", resposta.token)
      localStorage.setItem("usuarioAtual", JSON.stringify(resposta.user))

      setUsuarioAtual(resposta.user)
      setEstaAutenticado(true)

      toast.success(`Bem-vindo, ${resposta.user.username}!`)
    } catch (erro) {
      console.error("Erro no login:", erro)
      throw erro
    }
  }

  const fazerLogout = () => {
    servicoAuth.logout()
    setUsuarioAtual(null)
    setEstaAutenticado(false)
    toast.success("Logout realizado com sucesso!")
  }

  const valor = {
    estaAutenticado,
    usuarioAtual,
    fazerLogin,
    fazerLogout,
    carregando,
  }

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}
