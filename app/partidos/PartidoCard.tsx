'use client'

import { useState, useTransition, useEffect } from 'react'
import { guardarPronostico } from './actions'
import { getTeamFlag, getPhaseStyles } from '@/lib/teams'
import { getCountdown } from '@/lib/countdown'
import { Check, Clock, Zap } from 'lucide-react'

type Partido = {
  id: number
  equipo_a: string
  equipo_b: string
  fase: string
  fecha_partido: string
}

type Pronostico = {
  id: number
  prediccion_goles_a: number
  prediccion_goles_b: number
}

export default function PartidoCard({
  partido,
  pronosticoExistente,
  userEmail,
  userName,
}: {
  partido: Partido
  pronosticoExistente: Pronostico | null
  userEmail: string
  userName: string
}) {
  const [golesA, setGolesA] = useState(pronosticoExistente?.prediccion_goles_a ?? 0)
  const [golesB, setGolesB] = useState(pronosticoExistente?.prediccion_goles_b ?? 0)
  const [mensaje, setMensaje] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null)
  const [pending, startTransition] = useTransition()

  const fecha = new Date(partido.fecha_partido)
  const [countdown, setCountdown] = useState(() => getCountdown(fecha))

  // Actualizar el countdown cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdown(fecha))
    }, 30000)
    return () => clearInterval(interval)
  }, [fecha])

  const fase = getPhaseStyles(partido.fase)
  const fechaFormateada = fecha.toLocaleString('es-EC', {
    weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  })

  const handleSubmit = () => {
    setMensaje(null)
    startTransition(async () => {
      const result = await guardarPronostico({
        partidoId: partido.id, prediccionGolesA: golesA, prediccionGolesB: golesB,
        userEmail, userName,
      })
      if (result.error) setMensaje({ tipo: 'error', texto: result.error })
      else setMensaje({ tipo: 'ok', texto: '¡Pronóstico guardado!' })
    })
  }

  return (
    <div className={`bg-emerald-950/40 backdrop-blur border rounded-2xl p-5 transition ${
      pronosticoExistente
        ? 'border-amber-500/30 shadow-[0_0_30px_rgba(251,191,36,0.06)]'
        : 'border-emerald-800/50'
    }`}>
      <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md border ${fase.bg} ${fase.text} ${fase.border}`}>
            {partido.fase}
          </span>
          {/* Countdown destacado */}
          <span className={`text-xs font-bold px-2.5 py-1 rounded-md border flex items-center gap-1.5 ${
            countdown.urgente
              ? 'bg-red-500/15 text-red-300 border-red-500/30 pulse-live'
              : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
          }`}>
            {countdown.urgente ? <Zap className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
            {countdown.texto}
          </span>
        </div>
        <span className="text-xs text-emerald-200/60">{fechaFormateada}</span>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="text-right">
          <p className="font-semibold text-white text-lg">{partido.equipo_a}</p>
          <p className="text-2xl mt-1">{getTeamFlag(partido.equipo_a)}</p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="number" min={0} max={20} value={golesA}
            onChange={e => setGolesA(Math.max(0, parseInt(e.target.value) || 0))}
            disabled={countdown.yaEmpezo || pending}
            className="w-14 h-14 text-center text-2xl font-bold bg-emerald-950/60 border-2 border-emerald-700/50 text-white rounded-xl focus:border-amber-400 focus:outline-none disabled:bg-emerald-950/30 disabled:text-emerald-300/50"
          />
          <span className="text-emerald-400 font-bold text-xl">–</span>
          <input
            type="number" min={0} max={20} value={golesB}
            onChange={e => setGolesB(Math.max(0, parseInt(e.target.value) || 0))}
            disabled={countdown.yaEmpezo || pending}
            className="w-14 h-14 text-center text-2xl font-bold bg-emerald-950/60 border-2 border-emerald-700/50 text-white rounded-xl focus:border-amber-400 focus:outline-none disabled:bg-emerald-950/30 disabled:text-emerald-300/50"
          />
        </div>

        <div>
          <p className="font-semibold text-white text-lg">{partido.equipo_b}</p>
          <p className="text-2xl mt-1">{getTeamFlag(partido.equipo_b)}</p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 flex-wrap">
        <div className="min-h-[24px] flex items-center">
          {pronosticoExistente && !mensaje && (
            <span className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md flex items-center gap-1.5">
              <Check className="w-3 h-3" />
              Pronosticado · puedes modificar antes del partido
            </span>
          )}
          {mensaje && (
            <span className={`text-xs px-2.5 py-1 rounded-md border flex items-center gap-1.5 ${
              mensaje.tipo === 'ok'
                ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20'
                : 'text-red-300 bg-red-500/10 border-red-500/20'
            }`}>
              {mensaje.tipo === 'ok' && <Check className="w-3 h-3" />}
              {mensaje.texto}
            </span>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={countdown.yaEmpezo || pending}
          className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:bg-slate-600 disabled:text-slate-400 text-emerald-950 font-bold rounded-xl text-sm transition shadow-lg shadow-amber-500/20"
        >
          {pending ? 'Guardando...' : pronosticoExistente ? 'Actualizar' : 'Pronosticar'}
        </button>
      </div>
    </div>
  )
}