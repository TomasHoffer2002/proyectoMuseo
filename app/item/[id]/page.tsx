import { SiteHeader } from "@/components/site-header"
import { ItemDetailClient } from "@/components/item-detail-client"

export default async function ItemDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  
  return (
        <div className="min-h-screen bg-background">
            <SiteHeader />

            <main className="container mx-auto px-4 py-8">
                {/* Delega la carga de datos y el modo offline al componente de Cliente */}
                <ItemDetailClient itemId={params.id} />
            </main>
        </div>
    )
}
