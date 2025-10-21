// Definimos la URL del servidor Apache
export const API_SERVER_URL = "http://localhost:8012";

// URL de la API de ítems
export const API_ITEMS_URL = "http://localhost:8012/apiLogin/obtenerItems.php";
// URL de la API para obtener detalles de un ítem específico
export const API_ITEM_DETAIL_URL = "http://localhost:8012/apiLogin/obtenerItemsDetalle.php";
// URL de la API para obtener categorías
export const API_CATEGORIES_URL = "http://localhost:8012/apiLogin/obtenerCategorias.php";

export interface Category {
  value: string;
  label: string;
}

export interface MuseumItem {
  id: number; 
  title: string;
  description: string;
  longDescription: string;
  imageUrl: string;
  images: string[];       
  discoveryDate: string | null;
  location: string | null;
  period: string | null;
  dimensions: string | null;
  weight: string | null;
  featured: boolean;      
  tags: string[];         
  category_value: string; // El 'value' (ej: 'fossil')
  category_label: string; // El 'label' (ej: 'Fósiles')
}