import { Cable as Cube } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function Viewer3DPlaceholder() {
  return (
    <Card className="bg-muted/50">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Cube className="h-8 w-8 text-primary" />
        </div>
        <h3 className="font-medium mb-2">Visor 3D</h3>
        <p className="text-sm text-muted-foreground text-center max-w-sm">
          El modelo 3D interactivo estará disponible próximamente. Podrás rotar y explorar este espécimen en detalle.
        </p>
      </CardContent>
    </Card>
  )
}
