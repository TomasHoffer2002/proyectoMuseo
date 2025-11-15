'use client';

import React, { useState, useEffect } from "react";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "@/lib/auth-context";
import { API_ITEMS_URL } from "@/lib/api-client";

interface DiagnosticInfo {
    serverOk: boolean;
    serverError?: string;
    indexedDbOk: boolean;
    indexedDbError?: string;
}

// Barra simple en la parte superior
const StatusBar = ({ diagnostic }: { diagnostic: DiagnosticInfo }) => {
    if (diagnostic.serverOk) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: '#fef3c7',
            borderBottom: '1px solid #fcd34d',
            padding: '8px 16px',
            fontSize: 14,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: 'system-ui, sans-serif'
        }}>
            <span style={{ color: '#92400e' }}>⚠️</span>
            <span style={{ color: '#92400e' }}>
                {diagnostic.serverError ? `Servidor offline: ${diagnostic.serverError}` : 'Servidor no disponible'}
            </span>
        </div>
    );
}

// Componente principal de envoltura de cliente
export default function ClientProviders({ children }: { children: React.ReactNode }) {
    const [diagnostic, setDiagnostic] = useState<DiagnosticInfo>({
        serverOk: true,
        indexedDbOk: true,
    });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // Función para diagnosticar el sistema
        const runDiagnostic = async () => {
            const newDiag: DiagnosticInfo = {
                serverOk: false,
                indexedDbOk: false
            };

            // Test 1: Verificar servidor
            try {
                const response = await fetch(API_ITEMS_URL, { method: 'GET', cache: 'no-store' });
                if (response.ok) {
                    const data = await response.json();
                    newDiag.serverOk = Array.isArray(data);
                    if (!newDiag.serverOk) {
                        newDiag.serverError = 'JSON no es un array';
                    }
                } else {
                    newDiag.serverError = `HTTP ${response.status}`;
                }
            } catch (err) {
                newDiag.serverError = (err as Error).message || 'Error de conexión';
            }

            // Test 2: Verificar IndexedDB
            try {
                if (typeof indexedDB !== 'undefined') {
                    newDiag.indexedDbOk = true;
                }
            } catch (err) {
                newDiag.indexedDbError = (err as Error).message || 'IndexedDB no disponible';
            }

            setDiagnostic(newDiag);
        };

        // Diagnóstico inicial
        runDiagnostic();

        // Re-check cada 5 segundos
        const interval = setInterval(runDiagnostic, 5000);
        return () => clearInterval(interval);
    }, []);

    if (!mounted) return <AuthProvider>{children}</AuthProvider>;

    return (
        <AuthProvider>
            <StatusBar diagnostic={diagnostic} />
            <div className={diagnostic.serverOk ? '' : 'pt-11'}>
                {children}
            </div>
            <Analytics />
        </AuthProvider>
    );
}