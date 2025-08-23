import "./globals.css";
import type { ReactNode } from "react";
import Link from "next/link";

export const metadata = {
  title: "DinoLearn",
  description: "Leer alles over dinosauriërs met gamification!"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="nl">
      <body className="min-h-screen bg-white text-gray-900">
        <header className="p-4 bg-green-500 text-white shadow">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">🦖 DinoLearn</h1>
            <nav>
              <Link href="/courses" className="hover:underline">
                Cursussen
              </Link>
            </nav>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
