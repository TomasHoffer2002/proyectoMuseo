import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { ImageGallery } from "@/components/image-gallery"
import { ItemMetadata } from "@/components/item-metadata"
import { CommentsSection } from "@/components/comments-section" 
import { ItemNavigation } from "@/components/item-navigation"
import { Viewer3DPlaceholder } from "@/components/viewer-3d-placeholder"
import { 
  API_ITEMS_URL, 
  API_ITEM_DETAIL_URL,
  API_GET_PUBLIC_COMMENTS_URL, 
  type MuseumItem,
  type PublicComment
} from "@/lib/api-client"

async function getItem(id: string): Promise<MuseumItem | null> {
  try {
    const res = await fetch(`${API_ITEM_DETAIL_URL}?id=${id}`, {
      cache: "no-store", 
    })
    if (!res.ok) return null
    return res.json()
  } catch (error) {
    console.error("Error fetching item:", error)
    return null
  }
}

async function getAllItems(): Promise<MuseumItem[]> {
  try {
    const res = await fetch(API_ITEMS_URL, { cache: "no-store" })
    if (!res.ok) return []
    return res.json()
  } catch (error) {
    console.error("Error fetching all items:", error)
    return []
  }
}

async function getPublicComments(id: string): Promise<PublicComment[]> {
  try {
    const res = await fetch(`${API_GET_PUBLIC_COMMENTS_URL}?id=${id}`, {
      cache: "no-store"
    })
    if (!res.ok) return []
    return res.json()
  } catch (error) {
    console.error("Error fetching public comments:", error)
    return []
  }
}

export default async function ItemDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  
  const [item, allItems, comments] = await Promise.all([
    getItem(params.id),
    getAllItems(),
    getPublicComments(params.id)
  ])

  if (!item) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <ItemNavigation currentItem={item} allItems={allItems} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <ImageGallery images={item.images} title={item.title} />

            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{item.title}</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">{item.longDescription}</p>
            </div>

            <Viewer3DPlaceholder />
            <CommentsSection itemId={item.id} comments={comments} />
          </div>

          <div className="space-y-6">
            <ItemMetadata item={item} />
          </div>
        </div>
      </main>
    </div>
  )
}
