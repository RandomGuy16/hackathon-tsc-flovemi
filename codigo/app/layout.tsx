import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./Providers";

export const metadata: Metadata = {
  title: "MineraWatch - Vigilancia Minera del Perú",
  description: "Plataforma de transparencia minera",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="flex min-h-screen flex-col antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
