"use client"

import type React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import { Toaster } from "react-hot-toast"
import PaginaLogin from "./pages/PaginaLogin"
import PaginaDashboard from "./pages/PaginaDashboard"
import PaginaProjetos from "./pages/PaginaProjetos"
import PaginaTarefas from "./pages/PaginaTarefas"
import PaginaUsuarios from "./pages/PaginaUsuarios"
import Layout from "./components/Layout"
import "./styles/globais.css"

// Componente para rotas protegidas
function RotaProtegida({ children }: { children: React.ReactNode }) {
  const { estaAutenticado } = useAuth()

  if (!estaAutenticado) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

// Componente principal da aplicação
function ConteudoApp() {
  const { estaAutenticado } = useAuth()

  return (
    <Router>
      <Routes>
        <Route path="/login" element={estaAutenticado ? <Navigate to="/" replace /> : <PaginaLogin />} />
        <Route
          path="/*"
          element={
            <RotaProtegida>
              <Layout>
                <Routes>
                  <Route path="/" element={<PaginaDashboard />} />
                  <Route path="/projetos" element={<PaginaProjetos />} />
                  <Route path="/tarefas" element={<PaginaTarefas />} />
                  <Route path="/usuarios" element={<PaginaUsuarios />} />
                </Routes>
              </Layout>
            </RotaProtegida>
          }
        />
      </Routes>
      <Toaster position="top-right" />
    </Router>
  )
}

function App() {
  return (
    <AuthProvider>
      <ConteudoApp />
    </AuthProvider>
  )
}

export default App
