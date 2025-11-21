"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image" 
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useOnlineStatus } from "@/hooks/use-online-status"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()
  const isOnline = useOnlineStatus()

  useEffect(() => {
    if (!isOnline) {
      setError("Sin conexión a Internet. No es posible iniciar sesión.")
    } else {
      setError("")
    }
  }, [isOnline])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isOnline) {
      setError("Sin conexión a Internet. Por favor, conéctese para iniciar sesión.")
      return
    }

    setError("")
    setIsLoading(true)

    try {
      const loggedInUser = await login(username, password)

      if (loggedInUser) {
        if (loggedInUser.rol === 'admin') {
          router.push("/admin")
        } else {
          router.push("/")
        }
      } else {
        setError("Credenciales incorrectas. Por favor, intente nuevamente.")
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor. Verifique su conexión a internet.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative p-4">
      
      {/* Imagen de fondo */}
      <Image
        src="http://localhost:8012/apiLogin/imagenes/login.jpg"
        alt="Fondo del Museo"
        fill
        className="object-cover -z-20" // Se envía al fondo absoluto
        priority // Carga prioritaria
      />
      
      {/* Capa oscura (Overlay) para mejorar lectura */}
      <div className="absolute inset-0 bg-black/50 -z-10" />

      <div className="w-full max-w-md z-10"> {/* z-10 para asegurar que esté encima */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-md">
            Museo de Ciencias Naturales
          </h1>
          <p className="text-gray-200 drop-shadow-sm">Catálogo Digital</p>
        </div>

        {/* Tarjeta de login */}
        <Card className="bg-card/95 backdrop-blur-sm border-none shadow-xl">
          <CardHeader>
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription>Ingrese sus credenciales para acceder al sistema</CardDescription>
          </CardHeader>
          <CardContent>
            {!isOnline && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>
                  Estás desconectado. Por favor, revisa tu conexión a internet.
                </AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nombre de Usuario</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="ej: javier_perez"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading || !isOnline}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading || !isOnline}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading || !isOnline}>
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}