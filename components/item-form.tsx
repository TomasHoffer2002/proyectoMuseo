"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { MuseumItem, Category } from "@/lib/api-client"

interface ItemFormProps {
  item?: MuseumItem
  onSubmit: (data: Partial<MuseumItem>) => void
  onCancel: () => void
  categories: Category[]
}

export function ItemForm({ item, onSubmit, onCancel, categories }: ItemFormProps) {
  const [formData, setFormData] = useState<Partial<MuseumItem>>({
    title: "",
    category_value: "fossil",
    description: "",
    longDescription: "",
    imageUrl: "",
    discoveryDate: "",
    location: "",
    period: "",
    dimensions: "",
    weight: "",
    featured: false,
    tags: [],
    images: ["", "", ""],
  })

  const [tagInput, setTagInput] = useState("")

  useEffect(() => {
    if (item) {
      // Rellena el array 'images' para que siempre tenga 3 elementos
      const itemImages = item.images || [];
      const paddedImages = [
        itemImages[0] || "",
        itemImages[1] || "",
        itemImages[2] || "",
      ];
      setFormData({ ...item, images: paddedImages });
    }
  }, [item])

  const handleImageChange = (index: number, value: string) => {
    setFormData(prev => {
      // Asegura que 'images' sea un array
      const newImages = [...(prev.images || ["", "", ""])];
      newImages[index] = value;
      return { ...prev, images: newImages };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Filtra los strings vacíos del array de imágenes de la galería
    const finalImages = (formData.images || []).filter(img => img && img.trim() !== "");
    const dataToSend = {
      ...formData,
      images: finalImages,
    }
    onSubmit(dataToSend)
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }))
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tag) || [],
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{item ? "Editar Elemento" : "Nuevo Elemento"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoría *</Label>
              <Select
                value={formData.category_value}
                onValueChange={(value) => setFormData({ ...formData, category_value: value as any })}
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción Corta *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="longDescription">Descripción Detallada *</Label>
            <Textarea
              id="longDescription"
              value={formData.longDescription}
              onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
              required
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL de Imagen Principal *</Label>
            <Input
              id="imageUrl"
              type="text"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              required
              placeholder="/apiLogin/imagenes/jurassic-ammonite-fossil-spiral-shell.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label>Imágenes de la Galería (3)</Label>
            <Input
              id="image1"
              type="text"
              value={formData.images?.[0] ?? ""}
              onChange={(e) => handleImageChange(0, e.target.value)}
              placeholder="/apiLogin/imagenes/galeria-1.jpg"
            />
            <Input
              id="image2"
              type="text"
              value={formData.images?.[1] ?? ""}
              onChange={(e) => handleImageChange(1, e.target.value)}
              placeholder="/apiLogin/imagenes/galeria-2.jpg (opcional)"
            />
            <Input
              id="image3"
              type="text"
              value={formData.images?.[2] ?? ""}
              onChange={(e) => handleImageChange(2, e.target.value)}
              placeholder="/apiLogin/imagenes/galeria-3.jpg (opcional)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Ubicación</Label>
              <Input
                id="location"
                value={formData.location ?? ""}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discoveryDate">Fecha de Descubrimiento</Label>
              <Input
                id="discoveryDate"
                value={formData.discoveryDate ?? ""}
                onChange={(e) => setFormData({ ...formData, discoveryDate: e.target.value })}
                placeholder="2020"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="period">Período</Label>
              <Input
                id="period"
                value={formData.period ?? ""}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                placeholder="Jurásico"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dimensions">Dimensiones</Label>
              <Input
                id="dimensions"
                value={formData.dimensions ?? ""}
                onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                placeholder="25 cm x 15 cm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Peso</Label>
              <Input
                id="weight"
                value={formData.weight ?? ""}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                placeholder="2.5 kg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Etiquetas</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addTag()
                  }
                }}
                placeholder="Agregar etiqueta"
              />
              <Button type="button" onClick={addTag} variant="secondary">
                Agregar
              </Button>
            </div>
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <div
                    key={tag}
                    className="bg-secondary text-secondary-foreground px-3 py-1 rounded-md text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
            />
            <Label htmlFor="featured">Destacar en carrusel principal</Label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {item ? "Guardar Cambios" : "Crear Elemento"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
