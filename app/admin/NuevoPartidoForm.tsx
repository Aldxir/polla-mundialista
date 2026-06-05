'use client'

import { useState, useTransition } from 'react'
import { crearPartido } from './actions'

const FASES = ['Grupos', 'Octavos', 'Cuartos', 'Semis', 'Tercer Puesto', 'Final']

export default function NuevoPartidoForm() {
  const [equipoA, setEquipoA] = useState('')
  const [equipoB, setEquipoB] = useState('')
  const [fase, setFase] = useState('Grupos')
  const [fecha, setFecha] = useState('')
  const [mensaje, setMensaje] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const handleSubmit = () => {
    if (!equipoA || !equipoB || !fecha) {
      setMensaje('Completa todos los campos')
      return
    }
    setMensaje(null)
    startTransition(async () => {
      const result = await crearPartido({ equipoA, equipoB, fase, fecha })
      if (result.error) {
        setMensaje(result.error)
      } else {
        setEquipoA(''); setEquipoB(''); setFecha('')
        setMensaje('Partido creado ✓')
      }
    })
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          value={equipoA}
          onChange={e => setEquipoA(e.target.value)}
          placeholder="Equipo A"
          className="px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none"
        />
        <input
          value={equipoB}
          onChange={e => setEquipoB(e.target.value)}
          placeholder="Equipo B"
          className="px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none"
        />
        <select
          value={fase}
          onChange={e => setFase(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none"
        >
          {FASES.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <input
          type="datetime-local"
          value={fecha}
          onChange={e => setFecha(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none"
        />
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={handleSubmit}
          disabled={pending}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium rounded-lg text-sm"
        >
          {pending ? 'Creando...' : 'Crear partido'}
        </button>
        {mensaje && <span className="text-sm text-slate-600">{mensaje}</span>}
      </div>
    </div>
  )
}