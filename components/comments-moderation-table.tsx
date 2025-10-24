"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { Check, X, Eye, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { AdminComment } from "@/lib/api-client"

interface CommentsModerationTableProps {
  comments: AdminComment[]
  onApprove: (id: number) => void
  onReject: (id: number) => void
  onDelete: (id: number) => void 
  onFilterChange: (filter: string) => void 
  currentFilter: string
}

export function CommentsModerationTable({ 
  comments, 
  onApprove, 
  onReject, 
  onDelete, 
  onFilterChange,
  currentFilter
}: CommentsModerationTableProps) {
  const [selectedComment, setSelectedComment] = useState<AdminComment | null>(null)
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")

  const getStatusBadge = (status: AdminComment["estado"]) => {
    switch (status) {
      case "aprobado":
        return <Badge className="bg-green-600">Aprobado</Badge>
      case "rechazado":
        return <Badge variant="destructive">Rechazado</Badge>
      case "pendiente":
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
              {comments.length} comentario{comments.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Select value={currentFilter} onValueChange={onFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="pendiente">Pendientes</SelectItem>
              <SelectItem value="aprobado">Aprobados</SelectItem>
              <SelectItem value="rechazado">Rechazados</SelectItem>
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
              {comments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No hay comentarios para mostrar con este filtro
                  </TableCell>
                </TableRow>
              ) : (
                comments.map((comment) => (
                  <TableRow key={comment.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{comment.autor_usuario}</p>
                        <p className="text-xs text-muted-foreground">{comment.autor_email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <p className="truncate text-sm">{comment.item_titulo}</p>
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      <p className="line-clamp-2 text-sm">{comment.contenido}</p>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.fecha), { addSuffix: true, locale: es })}
                    </TableCell>
                    <TableCell>{getStatusBadge(comment.estado)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1"> 
                        <Button variant="ghost" size="icon" onClick={() => setSelectedComment(comment)}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Ver detalles</span>
                        </Button>
                        {comment.estado !== "aprobado" && (
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
                        {comment.estado !== "rechazado" && (
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
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(comment.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Eliminar</span>
                        </Button>
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
                  <p className="text-sm">{selectedComment.autor_usuario}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Correo Electrónico</p>
                  <p className="text-sm">{selectedComment.autor_email}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Elemento</p>
                <p className="text-sm">{selectedComment.item_titulo}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Fecha</p>
                <p className="text-sm">
                  {new Date(selectedComment.fecha).toLocaleString("es-ES", {
                    dateStyle: "long",
                    timeStyle: "short",
                  })}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Estado</p>
                {getStatusBadge(selectedComment.estado)}
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Comentario</p>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm leading-relaxed">{selectedComment.contenido}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                {selectedComment.estado !== "aprobado" && (
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
                {selectedComment.estado !== "rechazado" && (
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
