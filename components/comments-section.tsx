"use client"

import type React from "react"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { MessageSquare, Send } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Comment } from "@/lib/mock-data"

interface CommentsSectionProps {
  itemId: string
  comments: Comment[]
}

export function CommentsSection({ itemId, comments }: CommentsSectionProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const approvedComments = comments.filter((c) => c.status === "approved")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setShowSuccess(true)
    setName("")
    setEmail("")
    setContent("")
    setIsSubmitting(false)

    setTimeout(() => setShowSuccess(false), 5000)
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
                  <p className="font-medium text-sm">{comment.author}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: es })}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">{comment.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            Aún no hay comentarios. ¡Sé el primero en comentar!
          </p>
        )}

        <div className="pt-4 border-t">
          <h3 className="font-medium mb-4">Deja un comentario</h3>

          {showSuccess && (
            <Alert className="mb-4">
              <AlertDescription>
                ¡Gracias por tu comentario! Será revisado por nuestro equipo antes de publicarse.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isSubmitting}
                  placeholder="Tu nombre"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                  placeholder="tu@email.com"
                />
              </div>
            </div>

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
        </div>
      </CardContent>
    </Card>
  )
}
