'use client'

import { useState, useTransition } from 'react'
import { guardarPronostico } from './actions'

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
  const fechaFormateada = fecha.toLocaleString('es-EC', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })

  const yaEmpezo = fecha <= new Date()

  const handleSubmit = () => {
    setMensaje(null)
    startTransition(async () => {
      const result = await guardarPronostico({
        partidoId: partido.id,
        prediccionGolesA: golesA,
        prediccionGolesB: golesB,
        userEmail,
        userName,
      })
      if (result.error) {
        setMensaje({ tipo: 'error', texto: result.error })
      } else {
        setMensaje({ tipo: 'ok', texto: '¡Pronóstico guardado!' })
      }
    })
  }

  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {partido.fase}
        </span>
        <span className="text-xs text-slate-500">{fechaFormateada}</span>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="text-right">
          <p className="font-semibold text-slate-900">{partido.equipo_a}</p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            max={20}
            value={golesA}
            onChange={e => setGolesA(Math.max(0, parseInt(e.target.value) || 0))}
            disabled={yaEmpezo || pending}
            className="w-14 h-12 text-center text-xl font-bold border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none disabled:bg-slate-100"
          />
          <span className="text-slate-400 font-bold">–</span>
          <input
            type="number"
            min={0}
            max={20}
            value={golesB}
            onChange={e => setGolesB(Math.max(0, parseInt(e.target.value) || 0))}
            disabled={yaEmpezo || pending}
            className="w-14 h-12 text-center text-xl font-bold border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none disabled:bg-slate-100"
          />
        </div>

        <div>
          <p className="font-semibold text-slate-900">{partido.equipo_b}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        {pronosticoExistente && !mensaje && (
          <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
            Ya pronosticado · puedes modificar antes del partido
          </span>
        )}
        {mensaje && (
          <span
            className={`text-xs px-2 py-1 rounded ${
              mensaje.tipo === 'ok'
                ? 'text-emerald-700 bg-emerald-50'
                : 'text-red-700 bg-red-50'
            }`}
          >
            {mensaje.texto}
          </span>
        )}
        {!pronosticoExistente && !mensaje && <span />}

        <button
          onClick={handleSubmit}
          disabled={yaEmpezo || pending}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium rounded-lg text-sm transition"
        >
          {pending ? 'Guardando...' : pronosticoExistente ? 'Actualizar' : 'Pronosticar'}
        </button>
      </div>
    </div>
  )
}