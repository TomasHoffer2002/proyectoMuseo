import { Calendar, MapPin, Ruler, Weight, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { MuseumItem } from "@/lib/api-client"


interface ItemMetadataProps {
  item: MuseumItem
}

export function ItemMetadata({ item }: ItemMetadataProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Información del Espécimen</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Categoría</p>
          <Badge variant="secondary" className="text-sm">
            {item.category_label}
          </Badge>
        </div>

        {item.period && (
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Período</p>
              <p className="text-sm">{item.period}</p>
            </div>
          </div>
        )}

        {item.discoveryDate && (
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Fecha de Descubrimiento</p>
              <p className="text-sm">{item.discoveryDate}</p>
            </div>
          </div>
        )}

        {item.location && (
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Ubicación</p>
              <p className="text-sm">{item.location}</p>
            </div>
          </div>
        )}

        {item.dimensions && (
          <div className="flex items-start gap-3">
            <Ruler className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Dimensiones</p>
              <p className="text-sm">{item.dimensions}</p>
            </div>
          </div>
        )}

        {item.weight && (
          <div className="flex items-start gap-3">
            <Weight className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Peso</p>
              <p className="text-sm">{item.weight}</p>
            </div>
          </div>
        )}

        {item.tags.length > 0 && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Etiquetas</p>
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
