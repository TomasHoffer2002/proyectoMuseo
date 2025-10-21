"use client"

import { useState, useMemo, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { HeroCarousel } from "@/components/hero-carousel"
import { SearchFilters } from "@/components/search-filters"
import { GalleryGrid } from "@/components/gallery-grid"
import { 
  API_ITEMS_URL, 
  API_CATEGORIES_URL, 
  type MuseumItem,
  type Category
} from "@/lib/api-client"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("all")

  // ESTADOS para manejar los datos de la API
  const [allItems, setAllItems] = useState<MuseumItem[]>([])
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // useEffect para llamar a la API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const [itemsRes, categoriesRes] = await Promise.all([
          fetch(API_ITEMS_URL),
          fetch(API_CATEGORIES_URL)
        ]);

        if (!itemsRes.ok || !categoriesRes.ok) {
          throw new Error("Error al cargar los datos de la API");
        }

        const itemsData = await itemsRes.json();
        const categoriesData = await categoriesRes.json();
        
        setAllItems(itemsData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Un error desconocido ocurrió");
      } finally {
        setIsLoading(false);
      }
    }

    fetchItems()
  }, []) // El array vacío [] asegura que esto se ejecute solo una vez

  const featuredItems = useMemo(
    () => allItems.filter((item) => item.featured),
    [allItems] // Depende de allItems
  )

  const filteredItems = useMemo(() => {
    return allItems.filter((item) => { // Usa allItems
      const matchesSearch =
        searchQuery === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      // Compara con 'category_value' que viene de la API
      const matchesCategory = category === "all" || item.category_value === category 

      return matchesSearch && matchesCategory
    })
  }, [searchQuery, category, allItems]) 

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Cargando catálogo...</p>
      </div>
    )
  }
  if (error) {
     return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-destructive">Error: {error}</p>
      </div>
    )
  }

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
            categories={categories}
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
