"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useOnlineStatus } from "@/hooks/use-online-status" // Importar el hook

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()
  const isOnline = useOnlineStatus() // Usar el hook para obtener el estado de la conexión

  useEffect(() => {
    if (!isOnline) {
      setError("Sin conexión a Internet. No es posible iniciar sesión.")
    } else {
      setError("") // Limpiar el error si vuelve a estar en línea
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
      // Este error se captura si la API no está disponible (offline)
      setError("No se pudo conectar con el servidor. Verifique su conexión a internet.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Museo de Ciencias Naturales</h1>
          <p className="text-muted-foreground">Catálogo Digital</p>
        </div>

        <Card>
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
                  disabled={isLoading || !isOnline} // Deshabilitar si está cargando o no hay conexión
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
                  disabled={isLoading || !isOnline} // Deshabilitar si está cargando o no hay conexión
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