"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { API_SERVER_URL } from "@/lib/api-client"
import { useCachedImage } from '@/hooks/use-cached-image';

interface ImageGalleryProps {
    images: string[]
    title: string
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isFullscreen, setIsFullscreen] = useState(false)

    // Construir las URLs completas de las imágenes
    const fullUrls = useMemo(() => {
        // Mapea las rutas relativas a URLs completas para que el hook las gestione
        return images.map(imagePath => `${API_SERVER_URL}${imagePath}`);
    }, [images]);
    
    // Usar un hook que gestione el caché de la IMAGEN ACTUAL.
    // Si la imagen no está disponible, el hook devuelve el placeholder. Que es una imagen default.
    const currentImageUrl = fullUrls[currentIndex] || "/placeholder.svg";
    const currentSrc = useCachedImage(currentImageUrl);


    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length)
    }
    
    // --- Lógica de renderizado ---

    // La URL de origen para el placeholder o la imagen no encontrada
    const placeholderSrc = "/placeholder.svg";
  return (
    <>
      <div className="space-y-4">
        {/* -------------------- IMAGEN PRINCIPAL -------------------- */}
        <div className="relative aspect-[4/3] bg-muted rounded-lg overflow-hidden group">
          <Image
                        // 'currentSrc' QUE VIENE DEL HOOK GESTOR DE CACHÉ/INDEXEDDB
                        src={currentSrc === placeholderSrc ? placeholderSrc : currentSrc} 
                        alt={`${title} - Imagen ${currentIndex + 1}`}
                        fill
                        unoptimized={currentSrc.startsWith('blob:')} 
                        className="object-cover"
                    />

          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={goToPrevious}
                aria-label="Imagen anterior"
                title="Imagen anterior"
              >
                <ChevronLeft className="h-6 w-6" />
                <span className="sr-only">Imagen anterior</span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={goToNext}
                aria-label="Siguiente imagen"
                title="Siguiente imagen"
              >
                <ChevronRight className="h-6 w-6" />
                <span className="sr-only">Siguiente imagen</span>
              </Button>
            </>
          )}


          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>

                {images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                        {images.map((imagePath, index) => {
                            const thumbUrl = `${API_SERVER_URL}${imagePath}`;
                            const thumbSrc = useCachedImage(thumbUrl); 

                            return (
                              <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                aria-label={`Miniatura ${index + 1} de ${title}`}
                                title={`Miniatura ${index + 1} de ${title}`}
                                className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${
                                index === currentIndex ? "border-primary" : "border-transparent hover:border-muted-foreground/50"
                                }`}
                              >
                                <Image
                                  src={thumbSrc === placeholderSrc ? placeholderSrc : thumbSrc}
                                  alt={`${title} - Miniatura ${index + 1}`}
                                  fill
                                  unoptimized={thumbSrc.startsWith('blob:')}
                                  className="object-cover"
                                />
                              </button>
                            )
                        })}
                    </div>
                )}
      </div>

      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-7xl w-full h-[90vh] p-0">
          <div className="relative w-full h-full">
            <Image
                // también usamos 'currentSrc'
                src={currentSrc === placeholderSrc ? placeholderSrc : currentSrc}
                alt={`${title} - Imagen ${currentIndex + 1}`}
                fill
                unoptimized={currentSrc.startsWith('blob:')} 
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
