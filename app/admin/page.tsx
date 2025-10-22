"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { AdminGuard } from "@/components/admin-guard"
import { ItemsTable } from "@/components/items-table"
import { ItemForm } from "@/components/item-form"
//import { CommentsModerationTable } from "@/components/comments-moderation-table"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

import { 
  type MuseumItem, 
  type Category,
  // type Comment,
  API_ITEMS_URL,
  API_CATEGORIES_URL,
  API_CREATE_ITEM_URL,
  API_UPDATE_ITEM_URL,
  API_DELETE_ITEM_URL
} from "@/lib/api-client"

export default function AdminPage() {
  const [items, setItems] = useState<MuseumItem[]>([])
  //const [comments, setComments] = useState<Comment[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [editingItem, setEditingItem] = useState<MuseumItem | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // función para cargar datos de la API
  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [itemsRes, categoriesRes] = await Promise.all([
        fetch(API_ITEMS_URL),
        fetch(API_CATEGORIES_URL)
      ]);
      const itemsData = await itemsRes.json();
      const categoriesData = await categoriesRes.json();
      setItems(itemsData);
      setCategories(categoriesData);
    } catch (error) {
      toast({ title: "Error", description: "No se pudieron cargar los datos de la API.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCreateOrUpdate = async (data: Partial<MuseumItem>) => {
    const url = editingItem ? API_UPDATE_ITEM_URL : API_CREATE_ITEM_URL;
    const itemData = editingItem ? { ...data, id: editingItem.id } : data;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.mensaje || "Error al guardar el elemento.");
      }

      toast({
        title: editingItem ? "Elemento actualizado" : "Elemento creado",
        description: "Los cambios se han guardado correctamente.",
      });

      setShowForm(false);
      setEditingItem(null);
      fetchData(); // Recarga la lista de ítems
    
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  }
  const handleEdit = (item: MuseumItem) => {
    setEditingItem(item)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => { 
    try {
      const response = await fetch(API_DELETE_ITEM_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.mensaje || "Error al eliminar el elemento.");
      }

      toast({
        title: "Elemento eliminado",
        description: "El elemento ha sido eliminado del catálogo.",
        variant: "destructive",
      });

      fetchData(); // recarga la lista de ítems
    
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingItem(null)
  }

  /* Logica de comentarios comentada por ahora
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
  */
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
              {/*
              <TabsTrigger value="comments" className="relative">
                Moderación de Comentarios
                {pendingCommentsCount > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs font-medium">
                    {pendingCommentsCount}
                  </span>
                )}
              </TabsTrigger>
              */}
            </TabsList>

            <TabsContent value="items" className="space-y-6">
              {showForm ? (
                <ItemForm 
                  item={editingItem || undefined} 
                  onSubmit={handleCreateOrUpdate} 
                  onCancel={handleCancel}
                  categories={categories}
                />
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
            {/*
            <TabsContent value="comments">
              <CommentsModerationTable
                comments={comments}
                items={items}
                onApprove={handleApproveComment}
                onReject={handleRejectComment}
              />
            </TabsContent>
            */}
          </Tabs>
        </main>
      </div>
    </AdminGuard>
  )
}
