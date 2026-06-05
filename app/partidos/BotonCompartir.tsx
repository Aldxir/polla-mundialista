'use client'

import { useState } from 'react'
import { Share2, Check } from 'lucide-react'

export default function BotonCompartir() {
  const [copiado, setCopiado] = useState(false)

  const mensaje = `🏆 Únete a la Polla Mundialista 2026!

Pronostica los partidos del Mundial y compite con tus amigos.

👉 https://polla-mundialista-lemon.vercel.app`

  const handleClick = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Polla Mundialista 2026',
          text: mensaje,
          url: 'https://polla-mundialista-lemon.vercel.app',
        })
        return
      } catch {
        return
      }
    }
    try {
      await navigator.clipboard.writeText(mensaje)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch (err) {
      console.error('Error al copiar:', err)
    }
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1.5 px-3 py-2 bg-emerald-900/40 hover:bg-emerald-900/60 border border-emerald-700/50 text-emerald-100 rounded-xl text-sm font-medium transition"
      title="Compartir con amigos"
    >
      {copiado ? (
        <>
          <Check className="w-4 h-4 text-emerald-400" />
          ¡Copiado!
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4" />
          Invitar
        </>
      )}
    </button>
  )
}