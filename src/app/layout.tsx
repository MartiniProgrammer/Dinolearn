import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "DinoLearn",
  description: "Leer alles over dinosauriërs met gamification!"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="nl">
      <body className="min-h-screen bg-white text-gray-900">
        <header className="p-4 bg-green-500 text-white shadow">
          <h1 className="text-2xl font-bold">🦖 DinoLearn</h1>
        </header>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
