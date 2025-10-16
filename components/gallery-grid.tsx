"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { MuseumItem } from "@/lib/mock-data"

interface GalleryGridProps {
  items: MuseumItem[]
}

const CATEGORY_LABELS: Record<string, string> = {
  fossil: "Fósil",
  mineral: "Mineral",
  specimen: "Espécimen",
  artifact: "Artefacto",
}

export function GalleryGrid({ items }: GalleryGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <Link key={item.id} href={`/item/${item.id}`}>
          <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
              <Image
                src={item.imageUrl || "/placeholder.svg"}
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
                  {CATEGORY_LABELS[item.category]}
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
        </Link>
      ))}
    </div>
  )
}
