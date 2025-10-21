"use client"

import { useState } from "react"
import Link from "next/link"
import { Edit, Eye, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { MuseumItem } from "@/lib/api-client"

interface ItemsTableProps {
  items: MuseumItem[]
  onEdit: (item: MuseumItem) => void
  onDelete: (id: number) => void
}

export function ItemsTable({ items, onEdit, onDelete }: ItemsTableProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const handleDelete = () => {
    if (deleteId !== null) {
      onDelete(deleteId)
      setDeleteId(null)
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead>Destacado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No hay elementos en el catálogo
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.category_label}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.location || "—"}</TableCell>
                  <TableCell>
                    {item.featured ? <Badge>Sí</Badge> : <span className="text-muted-foreground">No</span>}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/item/${item.id}`} target="_blank">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Ver</span>
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
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

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El elemento será eliminado permanentemente del catálogo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
