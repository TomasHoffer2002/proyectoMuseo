"use client"

import { useState, useMemo } from "react"
import { SiteHeader } from "@/components/site-header"
import { HeroCarousel } from "@/components/hero-carousel"
import { SearchFilters } from "@/components/search-filters"
import { GalleryGrid } from "@/components/gallery-grid"
import { MUSEUM_ITEMS } from "@/lib/mock-data"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("all")

  const featuredItems = useMemo(() => MUSEUM_ITEMS.filter((item) => item.featured), [])

  const filteredItems = useMemo(() => {
    return MUSEUM_ITEMS.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = category === "all" || item.category === category

      return matchesSearch && matchesCategory
    })
  }, [searchQuery, category])

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <HeroCarousel items={featuredItems} />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Catálogo Digital</h1>
          <p className="text-muted-foreground text-lg">
            Explora nuestra colección de fósiles, minerales y especímenes naturales
          </p>
        </div>

        <div className="mb-8">
          <SearchFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            category={category}
            onCategoryChange={setCategory}
          />
        </div>

        {filteredItems.length > 0 ? (
          <GalleryGrid items={filteredItems} />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No se encontraron resultados para tu búsqueda.</p>
          </div>
        )}
      </main>

      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 Museo de Ciencias Naturales. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
