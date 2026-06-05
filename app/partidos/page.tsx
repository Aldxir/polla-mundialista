import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/admin'
import { Trophy, LogOut, Shield } from 'lucide-react'
import PartidoCard from './PartidoCard'

export default async function PartidosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { isAdmin } = await requireAdmin()

  const { data: partidos } = await supabase
    .from('partidos')
    .select('*')
    .eq('estado', 'Pendiente')
    .order('fecha_partido', { ascending: true })

  const { data: misPronosticos } = await supabase
    .from('pronosticos')
    .select('*')
    .eq('estudiante_email', user.email!)

  const pronosticosPorPartido = new Map(
    (misPronosticos ?? []).map(p => [p.partido_id, p])
  )

  const nombreUsuario = user.user_metadata.full_name?.split(' ')[0] ?? user.email

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-amber-400" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="font-display text-3xl text-white tracking-wide">PRONÓSTICOS</h1>
              <p className="text-emerald-200/70 text-sm">Hola, {nombreUsuario}</p>
            </div>
          </div>
          <nav className="flex gap-2">
            {isAdmin && (
              <a href="/admin" className="flex items-center gap-1.5 px-3 py-2 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 rounded-xl text-sm font-medium transition">
                <Shield className="w-4 h-4" />
                Admin
              </a>
            )}
            <a href="/tabla" className="px-3 py-2 bg-emerald-900/40 hover:bg-emerald-900/60 border border-emerald-700/50 text-emerald-100 rounded-xl text-sm font-medium transition">
              Tabla
            </a>
            <form action="/auth/signout" method="post">
              <button className="flex items-center gap-1.5 px-3 py-2 bg-emerald-900/40 hover:bg-emerald-900/60 border border-emerald-700/50 text-emerald-100 rounded-xl text-sm font-medium transition">
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </nav>
        </header>

        {!partidos || partidos.length === 0 ? (
          <div className="bg-emerald-950/40 backdrop-blur border border-emerald-800/50 rounded-2xl p-12 text-center">
            <p className="text-emerald-200/70">No hay partidos disponibles por ahora.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {partidos.map(partido => (
              <PartidoCard
                key={partido.id}
                partido={partido}
                pronosticoExistente={pronosticosPorPartido.get(partido.id) ?? null}
                userEmail={user.email!}
                userName={user.user_metadata.full_name ?? user.email!}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}