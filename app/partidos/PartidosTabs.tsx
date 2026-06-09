'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import PartidoCard from './PartidoCard'

type Partido = {
  id: number
  equipo_a: string
  equipo_b: string
  fecha_partido: string
  fase: string
  estado: string
  goles_reales_a: number | null
  goles_reales_b: number | null
  puntos_consolidados: boolean
}
type Pronostico = {
  id: number
  partido_id: number
  prediccion_goles_a: number
  prediccion_goles_b: number
  [key: string]: unknown
}

type Props = {
  partidos: Partido[]
  pronosticosPorPartido: Record<number, Pronostico>
  userEmail: string
  userName: string
}

function fechaLocal(iso: string): string {
  // Convierte ISO a fecha en Ecuador (UTC-5) para agrupar correctamente
  const d = new Date(iso)
  // Ajuste manual a UTC-5
  const ec = new Date(d.getTime() - 5 * 60 * 60 * 1000)
  return ec.toISOString().slice(0, 10) // "2026-06-09"
}

function labelDia(fechaStr: string): string {
  // fechaStr es "2026-06-09"
  const [y, m, d] = fechaStr.split('-').map(Number)
  const fecha = new Date(y, m - 1, d) // fecha local sin timezone
  return fecha.toLocaleDateString('es-EC', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  })
}

export default function PartidosTabs({ partidos, pronosticosPorPartido, userEmail, userName }: Props) {

  // Agrupar partidos por día (Ecuador)
  const dias = useMemo(() => {
    const mapa = new Map<string, Partido[]>()
    for (const p of partidos) {
      const dia = fechaLocal(p.fecha_partido)
      if (!mapa.has(dia)) mapa.set(dia, [])
      mapa.get(dia)!.push(p)
    }
    // Ordenar días cronológicamente
    return Array.from(mapa.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [partidos])

  const [indiceDia, setIndiceDia] = useState(0)

  const diaActual = dias[indiceDia]
  const hayAnterior = indiceDia > 0
  const haySiguiente = indiceDia < dias.length - 1

  if (dias.length === 0) {
    return (
      <div className="bg-emerald-950/40 backdrop-blur border border-emerald-800/50 rounded-2xl p-12 text-center space-y-2">
        <p className="text-emerald-200/70">No hay partidos disponibles para pronosticar.</p>
        <p className="text-emerald-200/50 text-sm">Vuelve más adelante o revisa la tabla de posiciones.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">

      {/* Navegador de día */}
      <div className="flex items-center justify-between bg-emerald-950/40 border border-emerald-800/50 rounded-2xl px-4 py-3">
        <button
          onClick={() => setIndiceDia(i => i - 1)}
          disabled={!hayAnterior}
          className="p-1.5 rounded-lg text-emerald-200/70 hover:text-emerald-100 hover:bg-emerald-800/40 disabled:opacity-20 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <p className="text-emerald-100 font-semibold capitalize">
            {labelDia(diaActual[0])}
          </p>
          <p className="text-emerald-200/50 text-xs mt-0.5">
            {diaActual[1].length} partido{diaActual[1].length !== 1 ? 's' : ''}
            {' · '}día {indiceDia + 1} de {dias.length}
          </p>
        </div>

        <button
          onClick={() => setIndiceDia(i => i + 1)}
          disabled={!haySiguiente}
          className="p-1.5 rounded-lg text-emerald-200/70 hover:text-emerald-100 hover:bg-emerald-800/40 disabled:opacity-20 disabled:cursor-not-allowed transition"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Dots de navegación rápida */}
      {dias.length > 1 && (
        <div className="flex justify-center gap-1.5">
          {dias.map(([dia], i) => (
            <button
              key={dia}
              onClick={() => setIndiceDia(i)}
              className={`rounded-full transition-all ${
                i === indiceDia
                  ? 'w-4 h-2 bg-amber-400'
                  : 'w-2 h-2 bg-emerald-700 hover:bg-emerald-500'
              }`}
              title={labelDia(dia)}
            />
          ))}
        </div>
      )}

      {/* Lista de partidos del día */}
      <div className="space-y-3">
        {diaActual[1].map(partido => (
          <PartidoCard
            key={partido.id}
            partido={partido}
            pronosticoExistente={pronosticosPorPartido[partido.id] ?? null}
            userEmail={userEmail}
            userName={userName}
          />
        ))}
      </div>

    </div>
  )
}