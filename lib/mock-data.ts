export interface MuseumItem {
  id: string
  title: string
  category: "fossil" | "mineral" | "specimen" | "artifact"
  description: string
  longDescription: string
  imageUrl: string
  images: string[]
  discoveryDate?: string
  location?: string
  period?: string
  dimensions?: string
  weight?: string
  featured: boolean
  tags: string[]
}

export const MUSEUM_ITEMS: MuseumItem[] = [
  {
    id: "1",
    title: "Ammonite Fósil",
    category: "fossil",
    description: "Fósil de ammonite del período Jurásico, perfectamente preservado",
    longDescription:
      "Este excepcional fósil de ammonite data del período Jurásico (hace aproximadamente 150 millones de años). Los ammonites fueron moluscos cefalópodos marinos extintos, parientes de los actuales nautilus. Este espécimen muestra una preservación extraordinaria de su concha en espiral, con detalles visibles de las cámaras internas y suturas complejas.",
    imageUrl: "/jurassic-ammonite-fossil-spiral-shell.jpg",
    images: [
      "/jurassic-ammonite-fossil-spiral-shell-detailed.jpg",
      "/ammonite-fossil-cross-section-chambers.jpg",
      "/ammonite-fossil-surface-texture-detail.jpg",
    ],
    discoveryDate: "1998",
    location: "Dorset, Inglaterra",
    period: "Jurásico",
    dimensions: "25 cm de diámetro",
    weight: "3.2 kg",
    featured: true,
    tags: ["jurásico", "marino", "cefalópodo", "extinción"],
  },
  {
    id: "2",
    title: "Cuarzo Amatista",
    category: "mineral",
    description: "Cristal de amatista de color púrpura intenso",
    longDescription:
      "Esta magnífica geoda de amatista presenta cristales de cuarzo de un color púrpura profundo y vibrante. La amatista es una variedad de cuarzo que debe su color característico a la presencia de hierro y la irradiación natural. Este espécimen proviene de Brasil, una de las fuentes más importantes de amatista de alta calidad en el mundo.",
    imageUrl: "/purple-amethyst-crystal-geode.jpg",
    images: [
      "/purple-amethyst-crystal-geode-detailed.jpg",
      "/amethyst-crystal-points-close-up.jpg",
      "/amethyst-geode-interior-view.jpg",
    ],
    discoveryDate: "2015",
    location: "Minas Gerais, Brasil",
    dimensions: "45 cm x 30 cm",
    weight: "12.5 kg",
    featured: true,
    tags: ["cuarzo", "cristal", "geoda", "brasil"],
  },
  {
    id: "3",
    title: "Cráneo de Smilodon",
    category: "fossil",
    description: "Cráneo completo de tigre dientes de sable",
    longDescription:
      "Cráneo excepcionalmente bien preservado de Smilodon fatalis, el famoso tigre dientes de sable que habitó América durante el Pleistoceno. Este espécimen muestra los característicos caninos alargados que podían alcanzar hasta 28 cm de longitud. El Smilodon se extinguió hace aproximadamente 10,000 años al final de la última era glacial.",
    imageUrl: "/smilodon-saber-tooth-tiger-skull-fossil.jpg",
    images: [
      "/smilodon-skull-with-long-canines-detailed.jpg",
      "/saber-tooth-tiger-skull-side-view.jpg",
      "/smilodon-skull-jaw-structure.jpg",
    ],
    discoveryDate: "2003",
    location: "La Brea Tar Pits, California",
    period: "Pleistoceno",
    dimensions: "35 cm de longitud",
    weight: "2.8 kg",
    featured: true,
    tags: ["pleistoceno", "mamífero", "carnívoro", "extinción"],
  },
  {
    id: "4",
    title: "Pirita Cúbica",
    category: "mineral",
    description: "Cristales cúbicos perfectos de pirita",
    longDescription:
      "Este espécimen excepcional muestra cristales de pirita con forma cúbica perfecta, un ejemplo notable de la geometría natural. La pirita, también conocida como 'oro de los tontos', es un sulfuro de hierro que forma cristales con caras brillantes y metálicas. Este ejemplar proviene de las famosas minas de Navajún en España.",
    imageUrl: "/cubic-pyrite-crystals-golden-metallic.jpg",
    images: [
      "/perfect-cubic-pyrite-crystals-cluster.jpg",
      "/pyrite-cube-crystal-geometric-faces.jpg",
      "/placeholder.svg?height=800&width=1200",
    ],
    discoveryDate: "2018",
    location: "Navajún, La Rioja, España",
    dimensions: "8 cm x 8 cm",
    weight: "450 g",
    featured: false,
    tags: ["sulfuro", "cristal", "cúbico", "metálico"],
  },
  {
    id: "5",
    title: "Trilobite Completo",
    category: "fossil",
    description: "Fósil de trilobite del Cámbrico con excelente detalle",
    longDescription:
      "Fósil extraordinariamente bien preservado de trilobite del período Cámbrico (hace aproximadamente 500 millones de años). Los trilobites fueron artrópodos marinos que dominaron los océanos durante casi 300 millones de años. Este espécimen muestra detalles excepcionales de su exoesqueleto segmentado y sus ojos compuestos.",
    imageUrl: "/placeholder.svg?height=600&width=800",
    images: [
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
    ],
    discoveryDate: "2010",
    location: "Marruecos",
    period: "Cámbrico",
    dimensions: "12 cm de longitud",
    weight: "180 g",
    featured: false,
    tags: ["cámbrico", "artrópodo", "marino", "paleozoico"],
  },
  {
    id: "6",
    title: "Ópalo de Fuego",
    category: "mineral",
    description: "Ópalo con juego de colores naranja y rojo intenso",
    longDescription:
      "Este espectacular ópalo de fuego mexicano exhibe un brillante juego de colores en tonos naranja, rojo y amarillo. Los ópalos son minerales amorfos compuestos de sílice hidratada que difractan la luz creando efectos iridiscentes únicos. Este tipo de ópalo es especialmente valorado por su transparencia y color intenso.",
    imageUrl: "/placeholder.svg?height=600&width=800",
    images: [
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
    ],
    discoveryDate: "2020",
    location: "Querétaro, México",
    dimensions: "4 cm x 3 cm",
    weight: "25 g",
    featured: false,
    tags: ["ópalo", "gema", "iridiscente", "méxico"],
  },
  {
    id: "7",
    title: "Diente de Megalodon",
    category: "fossil",
    description: "Diente gigante del tiburón prehistórico más grande",
    longDescription:
      "Impresionante diente fósil de Megalodon (Carcharocles megalodon), el tiburón más grande que jamás haya existido. Este depredador marino dominó los océanos durante el Mioceno y Plioceno. Los dientes de Megalodon podían alcanzar más de 18 cm de longitud, y este espécimen es un ejemplo excepcional de su tamaño y preservación.",
    imageUrl: "/placeholder.svg?height=600&width=800",
    images: [
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
    ],
    discoveryDate: "2012",
    location: "Carolina del Sur, EE.UU.",
    period: "Mioceno",
    dimensions: "16 cm de longitud",
    weight: "320 g",
    featured: true,
    tags: ["mioceno", "tiburón", "marino", "depredador"],
  },
  {
    id: "8",
    title: "Fluorita Multicolor",
    category: "mineral",
    description: "Cristales de fluorita con bandas de múltiples colores",
    longDescription:
      "Este hermoso espécimen de fluorita exhibe cristales octaédricos con bandas de colores púrpura, verde y azul. La fluorita es un mineral de fluoruro de calcio que puede presentar una amplia gama de colores debido a impurezas y defectos en su estructura cristalina. Este ejemplar proviene de las famosas minas de Rogerley en Inglaterra.",
    imageUrl: "/placeholder.svg?height=600&width=800",
    images: [
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
    ],
    discoveryDate: "2019",
    location: "Rogerley Mine, Durham, Inglaterra",
    dimensions: "10 cm x 8 cm",
    weight: "680 g",
    featured: false,
    tags: ["fluorita", "cristal", "multicolor", "octaédrico"],
  },
]

export const CATEGORIES = [
  { value: "all", label: "Todas las Categorías" },
  { value: "fossil", label: "Fósiles" },
  { value: "mineral", label: "Minerales" },
  { value: "specimen", label: "Especímenes" },
  { value: "artifact", label: "Artefactos" },
]

export interface Comment {
  id: string
  itemId: string
  author: string
  email: string
  content: string
  createdAt: string
  status: "pending" | "approved" | "rejected"
}

export const MOCK_COMMENTS: Comment[] = [
  {
    id: "1",
    itemId: "1",
    author: "María González",
    email: "maria@example.com",
    content:
      "¡Increíble espécimen! La preservación es excepcional. Me encantaría saber más sobre el proceso de fosilización.",
    createdAt: "2025-01-10T14:30:00Z",
    status: "approved",
  },
  {
    id: "2",
    itemId: "1",
    author: "Carlos Ruiz",
    email: "carlos@example.com",
    content: "Fascinante ver los detalles de las cámaras internas. ¿Cuánto tiempo tomó extraer este fósil?",
    createdAt: "2025-01-12T09:15:00Z",
    status: "approved",
  },
  {
    id: "3",
    itemId: "2",
    author: "Ana Martínez",
    email: "ana@example.com",
    content: "El color púrpura es impresionante. ¿Es natural o ha sido tratado de alguna manera?",
    createdAt: "2025-01-11T16:45:00Z",
    status: "approved",
  },
  {
    id: "4",
    itemId: "3",
    author: "Pedro López",
    email: "pedro@example.com",
    content: "Los dientes de sable son realmente impresionantes. Gran adición a la colección.",
    createdAt: "2025-01-13T11:20:00Z",
    status: "pending",
  },
]
