import type { Metadata } from 'next'
import { Inter, Bebas_Neue } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const bebas = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bebas',
})

export const metadata: Metadata = {
  title: 'Polla Mundialista 2026',
  description: 'Pronósticos del Mundial',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${bebas.variable}`}>
      <body className="font-sans antialiased min-h-screen bg-stadium text-white">
        <div className="min-h-screen bg-pitch-pattern">
          {children}
        </div>
      </body>
    </html>
  )
}