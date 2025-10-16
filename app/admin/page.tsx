"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { AdminGuard } from "@/components/admin-guard"
import { ItemsTable } from "@/components/items-table"
import { ItemForm } from "@/components/item-form"
import { CommentsModerationTable } from "@/components/comments-moderation-table"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MUSEUM_ITEMS, MOCK_COMMENTS, type MuseumItem, type Comment } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

export default function AdminPage() {
  const [items, setItems] = useState<MuseumItem[]>(MUSEUM_ITEMS)
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS)
  const [editingItem, setEditingItem] = useState<MuseumItem | null>(null)
  const [showForm, setShowForm] = useState(false)
  const { toast } = useToast()

  const handleCreateOrUpdate = (data: Partial<MuseumItem>) => {
    if (editingItem) {
      // Update existing item
      setItems((prev) => prev.map((item) => (item.id === editingItem.id ? { ...item, ...data } : item)))
      toast({
        title: "Elemento actualizado",
        description: "Los cambios se han guardado correctamente.",
      })
    } else {
      // Create new item
      const newItem: MuseumItem = {
        id: String(Date.now()),
        title: data.title || "",
        category: data.category || "fossil",
        description: data.description || "",
        longDescription: data.longDescription || "",
        imageUrl: data.imageUrl || "",
        images: [data.imageUrl || ""],
        discoveryDate: data.discoveryDate,
        location: data.location,
        period: data.period,
        dimensions: data.dimensions,
        weight: data.weight,
        featured: data.featured || false,
        tags: data.tags || [],
      }
      setItems((prev) => [newItem, ...prev])
      toast({
        title: "Elemento creado",
        description: "El nuevo elemento se ha agregado al catálogo.",
      })
    }

    setShowForm(false)
    setEditingItem(null)
  }

  const handleEdit = (item: MuseumItem) => {
    setEditingItem(item)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
    toast({
      title: "Elemento eliminado",
      description: "El elemento ha sido eliminado del catálogo.",
      variant: "destructive",
    })
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingItem(null)
  }

  const handleApproveComment = (id: string) => {
    setComments((prev) =>
      prev.map((comment) => (comment.id === id ? { ...comment, status: "approved" as const } : comment)),
    )
    toast({
      title: "Comentario aprobado",
      description: "El comentario ahora es visible públicamente.",
    })
  }

  const handleRejectComment = (id: string) => {
    setComments((prev) =>
      prev.map((comment) => (comment.id === id ? { ...comment, status: "rejected" as const } : comment)),
    )
    toast({
      title: "Comentario rechazado",
      description: "El comentario ha sido rechazado y no será visible.",
      variant: "destructive",
    })
  }

  const pendingCommentsCount = comments.filter((c) => c.status === "pending").length

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <SiteHeader />

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Panel de Administración</h1>
            <p className="text-muted-foreground">Gestiona el catálogo del museo y modera comentarios</p>
          </div>

          <Tabs defaultValue="items" className="space-y-6">
            <TabsList>
              <TabsTrigger value="items">Elementos del Catálogo</TabsTrigger>
              <TabsTrigger value="comments" className="relative">
                Moderación de Comentarios
                {pendingCommentsCount > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs font-medium">
                    {pendingCommentsCount}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="items" className="space-y-6">
              {showForm ? (
                <ItemForm item={editingItem || undefined} onSubmit={handleCreateOrUpdate} onCancel={handleCancel} />
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-semibold">Catálogo de Elementos</h2>
                      <p className="text-sm text-muted-foreground">{items.length} elementos en total</p>
                    </div>
                    <Button onClick={() => setShowForm(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Elemento
                    </Button>
                  </div>

                  <ItemsTable items={items} onEdit={handleEdit} onDelete={handleDelete} />
                </>
              )}
            </TabsContent>

            <TabsContent value="comments">
              <CommentsModerationTable
                comments={comments}
                items={items}
                onApprove={handleApproveComment}
                onReject={handleRejectComment}
              />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </AdminGuard>
  )
}
