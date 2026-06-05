'use client'

import { useEffect, useState } from 'react'
import { Trophy, Flame } from 'lucide-react'

// Fecha del partido inaugural: 11 de junio 2026, 14:00 Ecuador
const FECHA_INAUGURACION = new Date('2026-06-11T14:00:00-05:00')

export default function CuentaRegresivaMundial() {
  const [tiempo, setTiempo] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0 })
  const [yaComenzo, setYaComenzo] = useState(false)
  const [montado, setMontado] = useState(false)

  useEffect(() => {
    setMontado(true)
    const calcular = () => {
      const ahora = new Date()
      const diff = FECHA_INAUGURACION.getTime() - ahora.getTime()
      if (diff <= 0) {
        setYaComenzo(true)
        return
      }
      const dias = Math.floor(diff / (1000 * 60 * 60 * 24))
      const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const segundos = Math.floor((diff % (1000 * 60)) / 1000)
      setTiempo({ dias, horas, minutos, segundos })
    }
    calcular()
    const interval = setInterval(calcular, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!montado) return null

  if (yaComenzo) {
    return (
      <div className="relative bg-gradient-to-br from-red-900/40 via-amber-900/30 to-emerald-900/40 backdrop-blur border border-amber-400/40 rounded-3xl p-6 overflow-hidden">
        <div className="absolute inset-0 shimmer pointer-events-none" />
        <div className="relative flex items-center justify-center gap-3">
          <Flame className="w-8 h-8 text-red-400 pulse-live" />
          <p className="font-display text-3xl md:text-4xl text-gold-gradient">
            ¡EL MUNDIAL ESTÁ EN MARCHA!
          </p>
          <Flame className="w-8 h-8 text-red-400 pulse-live" />
        </div>
      </div>
    )
  }

  return (
    <div className="relative bg-gradient-to-br from-emerald-900/60 via-emerald-950/60 to-emerald-900/60 backdrop-blur border-2 border-amber-400/40 rounded-3xl p-6 md:p-8 overflow-hidden pulse-glow">
      {/* Banderines decorativos arriba */}
      <div className="absolute top-0 left-0 right-0 bunting-flags opacity-50" />

      {/* Shimmer effect */}
      <div className="absolute inset-0 shimmer pointer-events-none opacity-30" />

      <div className="relative space-y-4">
        {/* Trofeo flotante */}
        <div className="flex justify-center">
          <div className="float-trophy">
            <Trophy className="w-16 h-16 md:w-20 md:h-20 text-amber-400" strokeWidth={1.5}
              style={{ filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.5))' }}
            />
          </div>
        </div>

        <div className="text-center space-y-1">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-300/80 font-semibold">
            Faltan para el Mundial
          </p>
          <p className="text-xs text-emerald-200/60">
            Jueves 11 de junio · México vs Sudáfrica
          </p>
        </div>

        {/* Contador */}
        <div className="grid grid-cols-4 gap-2 md:gap-3 max-w-xl mx-auto">
          <BloqueTiempo valor={tiempo.dias}     label="DÍAS" />
          <BloqueTiempo valor={tiempo.horas}    label="HORAS" />
          <BloqueTiempo valor={tiempo.minutos}  label="MIN" />
          <BloqueTiempo valor={tiempo.segundos} label="SEG" pulse />
        </div>
      </div>

      {/* Banderines decorativos abajo */}
      <div className="absolute bottom-0 left-0 right-0 bunting-flags opacity-50" />
    </div>
  )
}

function BloqueTiempo({ valor, label, pulse = false }: { valor: number; label: string; pulse?: boolean }) {
  const valorFormateado = valor.toString().padStart(2, '0')
  return (
    <div className="bg-emerald-950/60 border border-amber-400/30 rounded-2xl p-3 md:p-4 text-center backdrop-blur">
      <p className={`font-display text-4xl md:text-6xl text-gold-gradient leading-none ${pulse ? 'pulse-live' : ''}`}>
        {valorFormateado}
      </p>
      <p className="text-[10px] md:text-xs uppercase tracking-widest text-amber-300/80 mt-1 font-bold">
        {label}
      </p>
    </div>
  )
}