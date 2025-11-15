import { useEffect, useState } from "react";
import { useOnlineStatus } from "./use-online-status";
import { getImage, saveImage } from "@/lib/indexeddb-client";

export const useCachedImage = (url: string) => {
    const [imageSrc, setImageSrc] = useState(url);
    const isOnline = useOnlineStatus();

    useEffect(() => {
        const manageImage = async () => {
            if (!url) return;

            // Si la URL es de localhost, no intentar cachear y usarla directamente.
            // Esto evita errores de fetch cuando el servidor de API local no está activo.
            if (url.startsWith('http://localhost') || url.startsWith('http://127.0.0.1')) {
                setImageSrc(url);
                return;
            }

            if (isOnline) {
                // ONLINE: Usa la URL remota e intenta cachear en segundo plano.
                setImageSrc(url); // Asegura que la URL remota se use si volvemos a estar online.
                
                const isCached = await getImage(url);
                if (!isCached) {
                    try {
                        const response = await fetch(url);
                        if (response.ok) {
                            const blob = await response.blob();
                            await saveImage(url, blob);
                        } else {
                            console.warn(`No se pudo almacenar en caché la imagen: ${url}. Estado: ${response.status}`);
                        }
                    } catch (error) {
                        console.warn(`Falló el cacheo de la imagen o error de red: ${url}`, error);
                    }
                }
            } else {
                // OFFLINE: Intenta cargar desde la caché.
                const cachedBlob = await getImage(url);
                if (cachedBlob) {
                    setImageSrc(URL.createObjectURL(cachedBlob));
                } else {
                    setImageSrc('/placeholder.svg'); // Fallback a placeholder si no hay caché.
                }
            }
        };

        manageImage();

        return () => {
            if (imageSrc.startsWith('blob:')) {
                URL.revokeObjectURL(imageSrc);
            }
        };
    }, [url, isOnline]);

    return imageSrc;
};