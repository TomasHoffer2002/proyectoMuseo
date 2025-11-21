import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import ClientProviders from "./ClientProviders" 
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Museo de Ciencias Naturales - Catálogo Digital",
    description: "Catálogo digital del Museo de Ciencias Naturales",
    generator: "v0.app",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="es">
            <body className={`${_geist.className} ${_geistMono.className} font-sans antialiased`}>
                <ClientProviders>
                    {children}
                </ClientProviders>
            </body>
        </html>
    )
}