import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { MuseumItem } from "@/lib/mock-data"

interface ItemNavigationProps {
  currentItem: MuseumItem
  allItems: MuseumItem[]
}

export function ItemNavigation({ currentItem, allItems }: ItemNavigationProps) {
  const currentIndex = allItems.findIndex((item) => item.id === currentItem.id)
  const previousItem = currentIndex > 0 ? allItems[currentIndex - 1] : null
  const nextItem = currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null

  return (
    <div className="flex items-center justify-between gap-4">
      {previousItem ? (
        <Link href={`/item/${previousItem.id}`} className="flex-1">
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <ChevronLeft className="h-4 w-4 mr-2" />
            <span className="truncate">{previousItem.title}</span>
          </Button>
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      <Link href="/">
        <Button variant="ghost">Volver a la Galería</Button>
      </Link>

      {nextItem ? (
        <Link href={`/item/${nextItem.id}`} className="flex-1">
          <Button variant="outline" className="w-full justify-end bg-transparent">
            <span className="truncate">{nextItem.title}</span>
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  )
}
