import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { ImageGallery } from "@/components/image-gallery"
import { ItemMetadata } from "@/components/item-metadata"
import { CommentsSection } from "@/components/comments-section"
import { ItemNavigation } from "@/components/item-navigation"
import { Viewer3DPlaceholder } from "@/components/viewer-3d-placeholder"
import { MUSEUM_ITEMS, MOCK_COMMENTS } from "@/lib/mock-data"

export function generateStaticParams() {
  return MUSEUM_ITEMS.map((item) => ({
    id: item.id,
  }))
}

export default function ItemDetailPage({ params }: { params: { id: string } }) {
  const item = MUSEUM_ITEMS.find((i) => i.id === params.id)

  if (!item) {
    notFound()
  }

  const itemComments = MOCK_COMMENTS.filter((c) => c.itemId === item.id)

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <ItemNavigation currentItem={item} allItems={MUSEUM_ITEMS} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <ImageGallery images={item.images} title={item.title} />

            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{item.title}</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">{item.longDescription}</p>
            </div>

            <Viewer3DPlaceholder />

            <CommentsSection itemId={item.id} comments={itemComments} />
          </div>

          <div className="space-y-6">
            <ItemMetadata item={item} />
          </div>
        </div>
      </main>
    </div>
  )
}
