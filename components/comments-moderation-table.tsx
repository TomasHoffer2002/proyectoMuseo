"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { Check, X, Eye } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Comment } from "@/lib/mock-data"

interface CommentsModerationTableProps {
  comments: Comment[]
  items: Array<{ id: string; title: string }>
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

export function CommentsModerationTable({ comments, items, onApprove, onReject }: CommentsModerationTableProps) {
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")

  const filteredComments = comments.filter((comment) => {
    if (statusFilter === "all") return true
    return comment.status === statusFilter
  })

  const getItemTitle = (itemId: string) => {
    return items.find((item) => item.id === itemId)?.title || "Elemento desconocido"
  }

  const getStatusBadge = (status: Comment["status"]) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-600">Aprobado</Badge>
      case "rejected":
        return <Badge variant="destructive">Rechazado</Badge>
      case "pending":
        return <Badge variant="secondary">Pendiente</Badge>
    }
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Moderación de Comentarios</h2>
            <p className="text-sm text-muted-foreground">
              {filteredComments.length} comentario{filteredComments.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
              <SelectItem value="approved">Aprobados</SelectItem>
              <SelectItem value="rejected">Rechazados</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Autor</TableHead>
                <TableHead>Elemento</TableHead>
                <TableHead>Comentario</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No hay comentarios para mostrar
                  </TableCell>
                </TableRow>
              ) : (
                filteredComments.map((comment) => (
                  <TableRow key={comment.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{comment.author}</p>
                        <p className="text-xs text-muted-foreground">{comment.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <p className="truncate text-sm">{getItemTitle(comment.itemId)}</p>
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      <p className="line-clamp-2 text-sm">{comment.content}</p>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: es })}
                    </TableCell>
                    <TableCell>{getStatusBadge(comment.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setSelectedComment(comment)}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Ver detalles</span>
                        </Button>
                        {comment.status !== "approved" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onApprove(comment.id)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <Check className="h-4 w-4" />
                            <span className="sr-only">Aprobar</span>
                          </Button>
                        )}
                        {comment.status !== "rejected" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onReject(comment.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Rechazar</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={selectedComment !== null} onOpenChange={(open) => !open && setSelectedComment(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles del Comentario</DialogTitle>
            <DialogDescription>Revisa el comentario completo antes de tomar una decisión</DialogDescription>
          </DialogHeader>

          {selectedComment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Autor</p>
                  <p className="text-sm">{selectedComment.author}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Correo Electrónico</p>
                  <p className="text-sm">{selectedComment.email}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Elemento</p>
                <p className="text-sm">{getItemTitle(selectedComment.itemId)}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Fecha</p>
                <p className="text-sm">
                  {new Date(selectedComment.createdAt).toLocaleString("es-ES", {
                    dateStyle: "long",
                    timeStyle: "short",
                  })}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Estado</p>
                {getStatusBadge(selectedComment.status)}
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Comentario</p>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm leading-relaxed">{selectedComment.content}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                {selectedComment.status !== "approved" && (
                  <Button
                    onClick={() => {
                      onApprove(selectedComment.id)
                      setSelectedComment(null)
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Aprobar Comentario
                  </Button>
                )}
                {selectedComment.status !== "rejected" && (
                  <Button
                    onClick={() => {
                      onReject(selectedComment.id)
                      setSelectedComment(null)
                    }}
                    variant="destructive"
                    className="flex-1"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Rechazar Comentario
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
