import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ọ̀pẹ̀lẹ̀ Ifá",
  description: "Cadena de Adivinación Yoruba",
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
      </head>
      <body className="bg-surface text-on-background font-body-md min-h-dvh antialiased">{children}</body>
      </html>
  )
}
