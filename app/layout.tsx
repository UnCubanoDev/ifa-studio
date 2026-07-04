import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import PwaRegister from "@/components/PwaRegister";

export const metadata: Metadata = {
  title: "Ọ̀pẹ̀lẹ̀ Ifá",
  description: "Cadena de Adivinación Yoruba",
  manifest: "/ifa-studio/manifest.webmanifest",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
      <html lang="es">
      <head>
        <link
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
            rel="stylesheet"
        />
        <link
            href="https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:wght@400;600;700&family=Hanken+Grotesk:wght@300;400;500;600&display=swap"
            rel="stylesheet"
        />
        <link rel="apple-touch-icon" href="/ifa-studio/icons/icon.svg" sizes="any" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Ifá Studio" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#0f0b1a" />
        <meta name="application-name" content="Ifá Studio" />
      </head>
      <body className="bg-surface text-on-background font-body-md min-h-dvh antialiased">
        {children}
        <PwaRegister />
      </body>
      </html>
  )
}
