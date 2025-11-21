import { useState, useEffect } from 'react';

const getOnlineStatus = () => typeof navigator !== 'undefined' && navigator.onLine;

export const useOnlineStatus = () => {
    // INICIALIZA EN TRUE para coincidir con el servidor, evitando desajustes de "hidratación".
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        // SOLO CUANDO EL COMPONENTE SE MONTA EN EL CLIENTE, 
        // establece el estado inicial real del navegador.
        setIsOnline(getOnlineStatus()); 

        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        // Se suscribe a los eventos del navegador
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Limpieza de los listeners
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return isOnline;
};