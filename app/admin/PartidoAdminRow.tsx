'use client'

import { useState, useTransition } from 'react'
import { registrarResultado, eliminarPartido } from './actions'
import { getTeamFlag, getPhaseStyles } from '@/lib/teams'
import { Trash2, Check } from 'lucide-react'

type Partido = {
  id: number
  equipo_a: string
  equipo_b: string
  goles_reales_a: number | null
  goles_reales_b: number | null
  estado: string
  fase: string
  fecha_partido: string
  puntos_consolidados: boolean
}

export default function PartidoAdminRow({ partido }: { partido: Partido }) {
  const [golesA, setGolesA] = useState(partido.goles_reales_a ?? 0)
  const [golesB, setGolesB] = useState(partido.goles_reales_b ?? 0)
  const [mensaje, setMensaje] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const finalizado = partido.estado === 'Finalizado'
  const fase = getPhaseStyles(partido.fase)
  const fecha = new Date(partido.fecha_partido).toLocaleString('es-EC', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  })

  const handleFinalizar = () => {
    if (!confirm(`¿Finalizar ${partido.equipo_a} ${golesA} - ${golesB} ${partido.equipo_b}? Esto calcula puntos automáticamente.`)) return
    setMensaje(null)
    startTransition(async () => {
      const result = await registrarResultado({ partidoId: partido.id, golesA, golesB })
      if (result.error) setMensaje(result.error)
      else setMensaje('Resultado registrado ✓')
    })
  }

  const handleEliminar = () => {
    if (!confirm(`¿Eliminar el partido ${partido.equipo_a} vs ${partido.equipo_b}?`)) return
    startTransition(async () => { await eliminarPartido(partido.id) })
  }

  return (
    <div className={`bg-emerald-950/40 backdrop-blur border rounded-2xl p-4 ${
      finalizado ? 'border-emerald-500/30' : 'border-emerald-800/50'
    }`}>
      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border ${fase.bg} ${fase.text} ${fase.border}`}>
            {partido.fase}
          </span>
          <span className="text-xs text-emerald-200/60">{fecha}</span>
          {finalizado && (
            <span className="text-xs bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Check className="w-3 h-3" />
              Finalizado
            </span>
          )}
        </div>
        {!finalizado && (
          <button
            onClick={handleEliminar}
            className="text-xs text-red-300/70 hover:text-red-300 flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            Eliminar
          </button>
        )}
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="text-right">
          <p className="font-semibold text-white">{partido.equipo_a}</p>
          <p className="text-xl">{getTeamFlag(partido.equipo_a)}</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number" min={0} max={20} value={golesA}
            onChange={e => setGolesA(Math.max(0, parseInt(e.target.value) || 0))}
            disabled={finalizado || pending}
            className="w-14 h-14 text-center text-2xl font-bold bg-emerald-950/60 border-2 border-emerald-700/50 text-white rounded-xl disabled:opacity-50"
          />
          <span className="text-emerald-400 font-bold text-xl">–</span>
          <input
            type="number" min={0} max={20} value={golesB}
            onChange={e => setGolesB(Math.max(0, parseInt(e.target.value) || 0))}
            disabled={finalizado || pending}
            className="w-14 h-14 text-center text-2xl font-bold bg-emerald-950/60 border-2 border-emerald-700/50 text-white rounded-xl disabled:opacity-50"
          />
        </div>
        <div>
          <p className="font-semibold text-white">{partido.equipo_b}</p>
          <p className="text-xl">{getTeamFlag(partido.equipo_b)}</p>
        </div>
      </div>

      {!finalizado && (
        <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
          {mensaje && <span className="text-xs text-emerald-200/80">{mensaje}</span>}
          <span />
          <button
            onClick={handleFinalizar}
            disabled={pending}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-600 text-emerald-950 font-bold text-sm rounded-xl transition shadow-lg shadow-emerald-500/20"
          >
            {pending ? 'Procesando...' : 'Finalizar y calcular'}
          </button>
        </div>
      )}
    </div>
  )
}