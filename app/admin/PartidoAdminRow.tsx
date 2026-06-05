'use client'

import { useState, useTransition } from 'react'
import { registrarResultado, eliminarPartido } from './actions'

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
  const fecha = new Date(partido.fecha_partido).toLocaleString('es-EC', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  })

  const handleFinalizar = () => {
    if (!confirm(`¿Finalizar ${partido.equipo_a} ${golesA} - ${golesB} ${partido.equipo_b}? Esto calcula puntos automáticamente.`)) return
    setMensaje(null)
    startTransition(async () => {
      const result = await registrarResultado({
        partidoId: partido.id,
        golesA, golesB,
      })
      if (result.error) setMensaje(result.error)
      else setMensaje('Resultado registrado ✓')
    })
  }

  const handleEliminar = () => {
    if (!confirm(`¿Eliminar el partido ${partido.equipo_a} vs ${partido.equipo_b}? Esto NO devuelve puntos otorgados.`)) return
    startTransition(async () => {
      await eliminarPartido(partido.id)
    })
  }

  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{partido.fase}</span>
          <span className="text-xs text-slate-400">·</span>
          <span className="text-xs text-slate-500">{fecha}</span>
          {finalizado && (
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">
              Finalizado
            </span>
          )}
        </div>
        {!finalizado && (
          <button
            onClick={handleEliminar}
            className="text-xs text-red-600 hover:underline"
          >
            Eliminar
          </button>
        )}
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <p className="text-right font-semibold text-slate-900">{partido.equipo_a}</p>
        <div className="flex items-center gap-2">
          <input
            type="number" min={0} max={20}
            value={golesA}
            onChange={e => setGolesA(Math.max(0, parseInt(e.target.value) || 0))}
            disabled={finalizado || pending}
            className="w-14 h-12 text-center text-xl font-bold border-2 border-slate-200 rounded-lg disabled:bg-slate-100"
          />
          <span className="text-slate-400 font-bold">–</span>
          <input
            type="number" min={0} max={20}
            value={golesB}
            onChange={e => setGolesB(Math.max(0, parseInt(e.target.value) || 0))}
            disabled={finalizado || pending}
            className="w-14 h-12 text-center text-xl font-bold border-2 border-slate-200 rounded-lg disabled:bg-slate-100"
          />
        </div>
        <p className="font-semibold text-slate-900">{partido.equipo_b}</p>
      </div>

      <div className="mt-3 flex items-center justify-between">
        {mensaje && <span className="text-xs text-slate-600">{mensaje}</span>}
        <span />
        {!finalizado && (
          <button
            onClick={handleFinalizar}
            disabled={pending}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-sm rounded-lg font-medium"
          >
            {pending ? '...' : 'Finalizar y calcular puntos'}
          </button>
        )}
      </div>
    </div>
  )
}