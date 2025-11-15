'use client';

import React, { useState, useEffect } from 'react';
import { ImageGallery } from "@/components/image-gallery"
import { ItemMetadata } from "@/components/item-metadata"
import { CommentsSection } from "@/components/comments-section" 
import { ItemNavigation } from "@/components/item-navigation"
import { Viewer3DPlaceholder } from "@/components/viewer-3d-placeholder"
import { API_ITEM_DETAIL_URL, API_GET_PUBLIC_COMMENTS_URL, type MuseumItem, type PublicComment } from "@/lib/api-client"
import { initDB } from '@/lib/indexeddb-client';

const ITEM_STORE = 'items';

// Interfaz para la respuesta detallada del API
interface ItemDetailResponse {
    item: MuseumItem;
    comments: PublicComment[];
}

// Función para obtener datos del ítem con fallback a IndexedDB
async function getItemWithFallback(id: string): Promise<{ item: MuseumItem; comments: PublicComment[] } | null> {
    const db = await initDB();
    
    // 1) Intento de carga por red (servidor)
    try {
        const res = await fetch(`${API_ITEM_DETAIL_URL}?id=${id}`, { cache: 'no-store' });
        if (res.ok) {
            const raw = await res.json();

            let itemFromServer: MuseumItem | undefined;
            let publicComments: PublicComment[] = [];

            // Parsear respuesta: si es array busca por id; si es objeto, extrae item
            if (Array.isArray(raw)) {
                itemFromServer = raw.find(it => String((it as any).id) === String(id)) as MuseumItem | undefined;
            } else if (raw && typeof raw === 'object') {
                if ('item' in raw) {
                    itemFromServer = (raw as any).item as MuseumItem;
                    publicComments = (raw as any).comments || [];
                } else if ((raw as any).id !== undefined) {
                    itemFromServer = raw as MuseumItem;
                }
            }

            if (itemFromServer) {
                // Normalizar id a número y cachear en IndexedDB
                const normalizedItem = { ...itemFromServer, id: Number((itemFromServer as any).id) } as MuseumItem;
                try {
                    await db.put(ITEM_STORE, normalizedItem);
                } catch {
                    // Ignorar fallo de cacheo
                }

                // Cargar comentarios públicos si no vinieron en la respuesta
                if (!publicComments.length) {
                    try {
                        const cRes = await fetch(`${API_GET_PUBLIC_COMMENTS_URL}?id=${normalizedItem.id}`, { cache: 'no-store' });
                        if (cRes.ok) {
                            const cJson = await cRes.json();
                            if (Array.isArray(cJson)) publicComments = cJson as PublicComment[];
                        }
                    } catch {
                        // ignorar error de carga de comentarios
                    }
                }

                return { item: normalizedItem, comments: publicComments };
            }
        }
    } catch {
        // red falló, seguimos a fallback
    }

    // 2) Fallback a IndexedDB: buscar por clave numérica, luego por string
    try {
        const numericKey = Number(id);
        if (!Number.isNaN(numericKey)) {
            const byNum = await db.get(ITEM_STORE, numericKey as any);
            if (byNum) return { item: { ...(byNum as MuseumItem), id: Number((byNum as any).id) } as MuseumItem, comments: [] };
        }

        const byStr = await db.get(ITEM_STORE, String(id) as any);
        if (byStr) return { item: { ...(byStr as MuseumItem), id: Number((byStr as any).id) } as MuseumItem, comments: [] };
    } catch {
        // fallback falló
    }

    // Si todo falla: aviso en consola y devolver null
    try {
        console.warn(`Ítem ${id} no encontrado en la caché ni en la red.`);
    } catch {}

    return null;
}

export function ItemDetailClient({ itemId }: { itemId: string }) {
    const [item, setItem] = useState<MuseumItem | null>(null);
    const [comments, setComments] = useState<PublicComment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getItemWithFallback(itemId)
            .then(data => {
                if (data) {
                    setItem(data.item);
                    setComments(data.comments);
                } else {
                    setItem(null);
                }
            })
            .catch(err => {
                console.error(err);
                setItem(null);
            })
            .finally(() => setLoading(false));
    }, [itemId]);


    if (loading) {
        return <div className="p-8 text-center">Cargando detalles del ítem...</div>;
    }
    
    if (!item) {
        return <div className="p-8 text-center text-red-600">
            Error: No se pudieron cargar los datos del ítem. Es posible que no tengas conexión y el ítem no esté guardado localmente.
        </div>; 
    }
    
    const allItems: MuseumItem[] = []; // Navegación sin ítems si no hay red

    return (
        <>
            <div className="mb-6">
                <ItemNavigation currentItem={item} allItems={allItems} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <ImageGallery images={item.images || []} title={item.title} /> 

                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">{item.title}</h1>
                        <p className="text-lg text-muted-foreground leading-relaxed">{item.longDescription}</p>
                    </div>

                    <Viewer3DPlaceholder />
                    <CommentsSection itemId={item.id} comments={comments} />
                </div>

                <div className="space-y-6">
                    <ItemMetadata item={item} />
                </div>
            </div>
        </>
    );
}