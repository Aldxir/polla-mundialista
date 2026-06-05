import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Trophy, Medal, ArrowLeft } from 'lucide-react'

export default async function TablaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: posiciones } = await supabase
    .from('usuarios_posiciones')
    .select('*')
    .order('puntaje_total', { ascending: false })
    .order('aciertos_exactos', { ascending: false })

  const medalla = (idx: number) => {
    if (idx === 0) return { color: 'text-amber-400', icon: '🥇' }
    if (idx === 1) return { color: 'text-slate-300', icon: '🥈' }
    if (idx === 2) return { color: 'text-orange-400', icon: '🥉' }
    return { color: 'text-emerald-200/60', icon: null }
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
              <Medal className="w-6 h-6 text-amber-400" strokeWidth={1.5} />
            </div>
            <h1 className="font-display text-3xl text-white tracking-wide">TABLA DE POSICIONES</h1>
          </div>
          <a href="/partidos" className="flex items-center gap-1.5 px-3 py-2 bg-emerald-900/40 hover:bg-emerald-900/60 border border-emerald-700/50 text-emerald-100 rounded-xl text-sm font-medium transition">
            <ArrowLeft className="w-4 h-4" />
            Partidos
          </a>
        </header>

        <div className="bg-emerald-950/40 backdrop-blur border border-emerald-800/50 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[40px_1fr_60px_80px] gap-3 px-4 py-3 bg-emerald-900/40 border-b border-emerald-800/50 text-xs font-semibold uppercase tracking-wider text-emerald-200/70">
            <span>#</span>
            <span>Participante</span>
            <span className="text-center">Exactos</span>
            <span className="text-right">Puntos</span>
          </div>

          {(posiciones ?? []).map((p, idx) => {
            const esActual = p.correo_institucional === user.email
            const m = medalla(idx)
            return (
              <div
                key={p.id}
                className={`grid grid-cols-[40px_1fr_60px_80px] gap-3 px-4 py-3.5 items-center border-b border-emerald-800/30 last:border-0 transition ${
                  esActual ? 'bg-amber-400/10' : 'hover:bg-emerald-900/20'
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
          {(!posiciones || posiciones.length === 0) && (
            <div className="px-4 py-12 text-center text-emerald-200/60">
              Aún no hay participantes
            </div>
          )}
        </div>

        <p className="text-xs text-emerald-200/50 text-center">
          🏆 Marcador exacto: 3 pts · Solo ganador: 1 pt · Multiplica por fase
        </p>
      </div>
    </div>
  )
}