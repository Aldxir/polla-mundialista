'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Radio } from 'lucide-react'

type Posicion = {
  id: number
  nombre: string
  correo_institucional: string
  puntaje_total: number
  partidos_acertados: number
  aciertos_exactos: number
}

export default function TablaPosiciones({
  posicionesIniciales,
  userEmail,
}: {
  posicionesIniciales: Posicion[]
  userEmail: string
}) {
  const [posiciones, setPosiciones] = useState<Posicion[]>(posicionesIniciales)
  const [filaActualizada, setFilaActualizada] = useState<number | null>(null)
  const [conectado, setConectado] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel('posiciones-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'usuarios_posiciones' },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const nueva = payload.new as Posicion
            setPosiciones((prev) => {
              const sinEsta = prev.filter((p) => p.id !== nueva.id)
              const actualizada = [...sinEsta, nueva].sort((a, b) => {
                if (b.puntaje_total !== a.puntaje_total) return b.puntaje_total - a.puntaje_total
                return b.aciertos_exactos - a.aciertos_exactos
              })
              return actualizada
            })
            // Resaltar la fila actualizada por 2 segundos
            setFilaActualizada(nueva.id)
            setTimeout(() => setFilaActualizada(null), 2000)
          } else if (payload.eventType === 'DELETE') {
            const id = (payload.old as Posicion).id
            setPosiciones((prev) => prev.filter((p) => p.id !== id))
          }
        }
      )
      .subscribe((status) => {
        setConectado(status === 'SUBSCRIBED')
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const medalla = (idx: number) => {
    if (idx === 0) return { color: 'text-amber-400', icon: '🥇' }
    if (idx === 1) return { color: 'text-slate-300', icon: '🥈' }
    if (idx === 2) return { color: 'text-orange-400', icon: '🥉' }
    return { color: 'text-emerald-200/60', icon: null }
  }

  return (
    <div className="space-y-3">
      {/* Indicador de conexión en vivo */}
      <div className="flex items-center justify-end gap-2 text-xs">
        <span className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${
          conectado
            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
            : 'bg-slate-500/15 text-slate-400 border border-slate-500/30'
        }`}>
          <Radio className={`w-3 h-3 ${conectado ? 'pulse-live' : ''}`} />
          {conectado ? 'En vivo' : 'Conectando...'}
        </span>
      </div>

      <div className="bg-emerald-950/40 backdrop-blur border border-emerald-800/50 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[40px_1fr_60px_80px] gap-3 px-4 py-3 bg-emerald-900/40 border-b border-emerald-800/50 text-xs font-semibold uppercase tracking-wider text-emerald-200/70">
          <span>#</span>
          <span>Participante</span>
          <span className="text-center">Exactos</span>
          <span className="text-right">Puntos</span>
        </div>

        {posiciones.map((p, idx) => {
          const esActual = p.correo_institucional === userEmail
          const recienActualizado = filaActualizada === p.id
          const m = medalla(idx)
          return (
            <div
              key={p.id}
              className={`grid grid-cols-[40px_1fr_60px_80px] gap-3 px-4 py-3.5 items-center border-b border-emerald-800/30 last:border-0 transition-all duration-500 ${
                recienActualizado
                  ? 'bg-amber-400/25 shadow-[inset_0_0_20px_rgba(251,191,36,0.15)]'
                  : esActual
                    ? 'bg-amber-400/10'
                    : 'hover:bg-emerald-900/20'
              }`}
            >
              <span className={`font-bold ${m.color}`}>
                {m.icon ? <span className="text-xl">{m.icon}</span> : `#${idx + 1}`}
              </span>
              <div className="min-w-0">
                <p className={`font-medium truncate ${esActual ? 'text-amber-300' : 'text-white'}`}>
                  {p.nombre}
                  {esActual && <span className="ml-2 text-xs text-amber-400/70">(tú)</span>}
                </p>
                <p className="text-xs text-emerald-200/50 truncate">{p.correo_institucional}</p>
              </div>
              <span className="text-center text-emerald-200/80">{p.aciertos_exactos}</span>
              <span className="text-right font-display text-3xl text-amber-400 tracking-wider">
                {p.puntaje_total}
              </span>
            </div>
          )
        })}
        {posiciones.length === 0 && (
          <div className="px-4 py-12 text-center text-emerald-200/60">
            Aún no hay participantes
          </div>
        )}
      </div>
    </div>
  )
}