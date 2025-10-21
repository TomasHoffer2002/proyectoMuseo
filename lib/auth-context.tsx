"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  nombre: string
  usuario: string
  email: string
  rol: String
}

interface AuthContextType {
  user: User | null
  login: (usuario: string, password: string) => Promise<User | null>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_URL = "http://localhost:8012/apiLogin/login.php";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("museo_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false)
  }, [])

  const login = async (usuario: string, password: string): Promise<User | null> => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.usuario);
        localStorage.setItem("museo_token", data.token);
        localStorage.setItem("museo_user", JSON.stringify(data.usuario));
        return data.usuario;
      } else {
        console.error("Error de login:", data.mensaje);
        return null;
      }
    } catch (error) {
      console.error("Error de red o al conectar con la API:", error);
      return null;
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("museo_token")
    localStorage.removeItem("museo_user")
    window.location.href = '/login';
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}