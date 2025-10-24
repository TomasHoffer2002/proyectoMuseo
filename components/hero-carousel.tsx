"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { API_SERVER_URL, type MuseumItem } from "@/lib/api-client"

interface HeroCarouselProps {
  items: MuseumItem[]
}

export function HeroCarousel({ items }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (items.length === 0) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [items.length])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }

  // Asegurarse de que currentItem exista antes de renderizar
  if (items.length === 0) {
    return (
      <div className="relative h-[500px] md:h-[600px] w-full overflow-hidden bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">No hay ítems destacados.</p>
      </div>
    )
  }

  const currentItem = items[currentIndex]

  return (
    <div className="relative h-[500px] md:h-[600px] w-full overflow-hidden bg-muted">
      {items.map((item, index) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={item.imageUrl ? `${API_SERVER_URL}${item.imageUrl}` : "/placeholder.svg"}
            alt={item.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </div>
      ))}

      <div className="absolute inset-0 flex items-end">
        <div className="container mx-auto px-4 pb-12 md:pb-16">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 text-balance">
              {currentItem.title}
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-6 text-pretty">{currentItem.description}</p>
            <Link href={`/item/${currentItem.id}`}>
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                Ver Detalles
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-8 w-8" />
        <span className="sr-only">Anterior</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white"
        onClick={goToNext}
      >
        <ChevronRight className="h-8 w-8" />
        <span className="sr-only">Siguiente</span>
      </Button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all ${index === currentIndex ? "w-8 bg-white" : "w-2 bg-white/50"}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Ir a la diapositiva ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
