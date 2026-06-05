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
      setMensaje('Completa todos los campos'); return
    }
    setMensaje(null)
    startTransition(async () => {
      const result = await crearPartido({ equipoA, equipoB, fase, fecha })
      if (result.error) setMensaje(result.error)
      else { setEquipoA(''); setEquipoB(''); setFecha(''); setMensaje('Partido creado ✓') }
    })
  }

  const inputClass = "px-3 py-2.5 bg-emerald-950/60 border border-emerald-700/50 text-white placeholder-emerald-200/30 rounded-xl focus:border-amber-400 focus:outline-none"

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input value={equipoA} onChange={e => setEquipoA(e.target.value)} placeholder="Equipo A" className={inputClass} />
        <input value={equipoB} onChange={e => setEquipoB(e.target.value)} placeholder="Equipo B" className={inputClass} />
        <select value={fase} onChange={e => setFase(e.target.value)} className={inputClass}>
          {FASES.map(f => <option key={f} value={f} className="bg-emerald-950">{f}</option>)}
        </select>
        <input type="datetime-local" value={fecha} onChange={e => setFecha(e.target.value)} className={inputClass} />
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={handleSubmit}
          disabled={pending}
          className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:bg-slate-600 text-emerald-950 font-bold rounded-xl text-sm transition shadow-lg shadow-amber-500/20"
        >
          {pending ? 'Creando...' : 'Crear partido'}
        </button>
        {mensaje && <span className="text-sm text-emerald-200/80">{mensaje}</span>}
      </div>
    </div>
  )
}