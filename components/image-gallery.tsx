"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { API_SERVER_URL } from "@/lib/api-client"

interface ImageGalleryProps {
  images: string[]
  title: string
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  return (
    <>
      <div className="space-y-4">
        <div className="relative aspect-[4/3] bg-muted rounded-lg overflow-hidden group">
          <Image
            src={images[currentIndex] ? `${API_SERVER_URL}${images[currentIndex]}` : "/placeholder.svg"}
            alt={`${title} - Imagen ${currentIndex + 1}`}
            fill
            className="object-cover"
          />

          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={goToPrevious}
              >
                <ChevronLeft className="h-6 w-6" />
                <span className="sr-only">Imagen anterior</span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={goToNext}
              >
                <ChevronRight className="h-6 w-6" />
                <span className="sr-only">Siguiente imagen</span>
              </Button>
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => setIsFullscreen(true)}
          >
            <Maximize2 className="h-5 w-5" />
            <span className="sr-only">Ver en pantalla completa</span>
          </Button>

          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${
                  index === currentIndex ? "border-primary" : "border-transparent hover:border-muted-foreground/50"
                }`}
              >
                <Image
                  src={image ? `${API_SERVER_URL}${image}` : "/placeholder.svg"}
                  alt={`${title} - Miniatura ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-7xl w-full h-[90vh] p-0">
          <div className="relative w-full h-full">
            <Image
              src={images[currentIndex] ? `${API_SERVER_URL}${images[currentIndex]}` : "/placeholder.svg"}
              alt={`${title} - Imagen ${currentIndex + 1}`}
              fill
              className="object-contain"
            />

            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-8 w-8" />
                  <span className="sr-only">Imagen anterior</span>
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-8 w-8" />
                  <span className="sr-only">Siguiente imagen</span>
                </Button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 px-4 py-2 rounded-full text-white">
                  {currentIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
