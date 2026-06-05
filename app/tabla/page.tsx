import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Medal, ArrowLeft } from 'lucide-react'
import TablaPosiciones from './TablaPosiciones'

export default async function TablaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: posicionesIniciales } = await supabase
    .from('usuarios_posiciones')
    .select('*')
    .order('puntaje_total', { ascending: false })
    .order('aciertos_exactos', { ascending: false })

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

        <TablaPosiciones
          posicionesIniciales={posicionesIniciales ?? []}
          userEmail={user.email!}
        />

        <p className="text-xs text-emerald-200/50 text-center">
          🏆 Marcador exacto: 3 pts · Solo ganador: 1 pt · Multiplica por fase
        </p>
      </div>
    </div>
  )
}