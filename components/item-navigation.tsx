import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { MuseumItem } from "@/lib/api-client"

interface ItemNavigationProps {
  currentItem: MuseumItem
  allItems: MuseumItem[]
  onItemChange?: (item: MuseumItem) => void
  onBackToGallery?: () => void
}

export function ItemNavigation({ 
  currentItem, 
  allItems, 
  onItemChange,
  onBackToGallery 
}: ItemNavigationProps) {
  // Índice del item actual dentro de la lista completa
  const currentIndex = allItems.findIndex((item) => item.id === currentItem.id)
  // Resolver ítems anterior y siguiente (si existen)
  const previousItem = currentIndex > 0 ? allItems[currentIndex - 1] : null
  const nextItem = currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null

  // Modo de navegación: si se pasaron callbacks desde el padre, usar los handlers
  // (navegación por estado). Si no, renderizar enlaces <Link> que apuntan a rutas.
  const usesCallbacks = Boolean(onItemChange || onBackToGallery)

  return (
    <div className="flex items-center justify-between gap-4">
      {previousItem ? (
        usesCallbacks && onItemChange ? (
          // Botón anterior: usa callback para cambiar item en memoria (sin navegar)
          <Button 
            variant="outline" 
            className="flex-1 justify-start bg-transparent"
            onClick={() => onItemChange(previousItem)}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            <span className="truncate">{previousItem.title}</span>
          </Button>
        ) : (
          // Enlace anterior: navegación por rutas (página de detalle)
          <Link href={`/item/${previousItem.id}`} className="flex-1">
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span className="truncate">{previousItem.title}</span>
            </Button>
          </Link>
        )
      ) : (
        <div className="flex-1" />
      )}

      {usesCallbacks && onBackToGallery ? (
        // Botón central: vuelve a la galería usando callback
        <Button 
          variant="ghost" 
          onClick={() => onBackToGallery()}
        >
          Volver a la Galería
        </Button>
      ) : (
        // Link central: navegación a la raíz (galería)
        <Link href="/">
          <Button variant="ghost">
            Volver a la Galería
          </Button>
        </Link>
      )}

      {nextItem ? (
        usesCallbacks && onItemChange ? (
          // Botón siguiente: usa callback para cambiar al siguiente item
          <Button 
            variant="outline" 
            className="flex-1 justify-end bg-transparent"
            onClick={() => onItemChange(nextItem)}
          >
            <span className="truncate">{nextItem.title}</span>
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          // Enlace siguiente: navegación por ruta al detalle
          <Link href={`/item/${nextItem.id}`} className="flex-1">
            <Button variant="outline" className="w-full justify-end bg-transparent">
              <span className="truncate">{nextItem.title}</span>
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        )
      ) : (
        <div className="flex-1" />
      )}
    </div>
  )
}
