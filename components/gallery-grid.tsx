"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { API_SERVER_URL, type MuseumItem } from "@/lib/api-client"

interface GalleryGridProps {
  items: MuseumItem[]
}

// Componente que renderiza la cuadrícula de la galería.
// - Usa `ItemCard` para mostrar cada tarjeta.
// - Cada tarjeta es un enlace a la página de detalle `/item/{id}`.
export function GalleryGrid({ items }: GalleryGridProps) {
  // Tarjeta reutilizable para mostrar título, imagen y metadatos breves
  const ItemCard = ({ item }: { item: MuseumItem }) => (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow pt-0 cursor-pointer">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          // Construir URL absoluta usando API_SERVER_URL
          src={item.imageUrl ? `${API_SERVER_URL}${item.imageUrl}` : "/placeholder.svg"}
          alt={item.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
            {item.title}
          </h3>
          <Badge variant="secondary" className="shrink-0">
            {item.category_label}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
        {item.location && (
          <p className="text-xs text-muted-foreground mt-2">
            <span className="font-medium">Origen:</span> {item.location}
          </p>
        )}
      </CardContent>
    </Card>
  )

  // Renderizar la grilla: cada ItemCard está envuelto en un <Link> a su detalle
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <Link key={item.id} href={`/item/${item.id}`}>
          <ItemCard item={item} />
        </Link>
      ))}
    </div>
  )
}
