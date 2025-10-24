"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { MessageSquare, Send } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { type PublicComment, API_CREATE_COMMENT_URL } from "@/lib/api-client"
import { useAuth } from "@/lib/auth-context"

interface CommentsSectionProps {
  itemId: number
  comments: PublicComment[]
}

export function CommentsSection({ itemId, comments }: CommentsSectionProps) {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState<string | null>(null)
  const { user } = useAuth()

  const approvedComments = comments

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Chequeo de seguridad: si no hay usuario, no hacer nada
    if (!user) {
      setShowError("Debes iniciar sesión para poder comentar.");
      return;
    }

    setIsSubmitting(true)
    setShowError(null)
    setShowSuccess(false)

    try {
      const response = await fetch(API_CREATE_COMMENT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item_id: itemId,
          usuario_id: user.id, 
          contenido: content
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.mensaje || "Error al enviar el comentario.");
      }
      
      // Éxito
      setShowSuccess(true)
      setContent("")
      setTimeout(() => setShowSuccess(false), 5000)

    } catch (error) {
      setShowError((error as Error).message);
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comentarios ({approvedComments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {approvedComments.length > 0 ? (
          <div className="space-y-4">
            {approvedComments.map((comment) => (
              <div key={comment.id} className="border-l-2 border-primary/30 pl-4 py-2">
                <div className="flex items-baseline gap-2 mb-1">
                  <p className="font-medium text-sm">{comment.autor_usuario}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.fecha), { addSuffix: true, locale: es })}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">{comment.contenido}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            Aún no hay comentarios. ¡Sé el primero en comentar!
          </p>
        )}

        <div className="pt-4 border-t">
          {user ? (
            <>
              {/* --- FORMULARIO PARA USUARIO LOGUEADO --- */}
              <h3 className="font-medium mb-4">Deja un comentario como {user.nombre}</h3>
              {showSuccess && (
                <Alert className="mb-4">
                  <AlertDescription>
                    ¡Gracias por tu comentario! Será revisado por nuestro equipo antes de publicarse.
                  </AlertDescription>
                </Alert>
              )}
              {showError && (
                 <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{showError}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="content">Comentario</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    disabled={isSubmitting}
                    placeholder="Comparte tus pensamientos sobre este espécimen..."
                    rows={4}
                  />
                </div>
                <Button type="submit" disabled={isSubmitting}>
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Enviando..." : "Enviar Comentario"}
                </Button>
              </form>
            </>
          ) : (
            <>
              {/* --- MENSAJE PARA USUARIO NO LOGUEADO --- */}
              <h3 className="font-medium mb-4">Deja un comentario</h3>
              <Alert>
                <AlertDescription className="flex items-center justify-between">
                  Debes iniciar sesión para poder comentar.
                  <Button asChild variant="default" size="sm">
                    <Link href="/login">Iniciar Sesión</Link>
                  </Button>
                </AlertDescription>
              </Alert>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
