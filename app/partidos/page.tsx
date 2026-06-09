import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/admin'
import { Trophy, LogOut, Shield, HelpCircle, Flame } from 'lucide-react'
import PartidoCard from './PartidoCard'
import BotonCompartir from './BotonCompartir'
import CuentaRegresivaMundial from '@/components/CuentaRegresivaMundial'
import PartidosTabs from './PartidosTabs'

export default async function PartidosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { isAdmin } = await requireAdmin()

  const ahora = new Date()

  const { data: partidos } = await supabase
    .from('partidos')
    .select('*')
    .eq('estado', 'Pendiente')
    .gt('fecha_partido', ahora.toISOString())
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
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Banderines decorativos arriba */}
        <div className="bunting-flags" />

        <header className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/10 border-2 border-amber-400/40 flex items-center justify-center pulse-glow">
                <Trophy className="w-7 h-7 text-amber-400 float-trophy" strokeWidth={1.5} />
              </div>
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl text-gold-gradient tracking-wide">
                POLLA MUNDIALISTA
              </h1>
              <p className="text-emerald-200/70 text-xs md:text-sm">
                <Flame className="w-3 h-3 inline text-amber-400" /> Hola, {nombreUsuario}
              </p>
            </div>
          </div>

          <nav className="flex gap-2 flex-wrap">
            {isAdmin && (
              <a href="/admin" className="flex items-center gap-1.5 px-3 py-2 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 rounded-xl text-sm font-medium transition">
                <Shield className="w-4 h-4" />
                Admin
              </a>
            )}
            <BotonCompartir />
            <a href="/como-funciona" className="flex items-center gap-1.5 px-3 py-2 bg-emerald-900/40 hover:bg-emerald-900/60 border border-emerald-700/50 text-emerald-100 rounded-xl text-sm font-medium transition" title="Reglas">
              <HelpCircle className="w-4 h-4" />
            </a>
            <a href="/mis-pronosticos" className="px-3 py-2 bg-emerald-900/40 hover:bg-emerald-900/60 border border-emerald-700/50 text-emerald-100 rounded-xl text-sm font-medium transition">
              Mis pronósticos
            </a>
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

        {/* Cuenta regresiva épica al Mundial */}
        <CuentaRegresivaMundial />

        {/* Lista paginada por día */}
        <PartidosTabs
          partidos={partidos ?? []}
          pronosticosPorPartido={Object.fromEntries(pronosticosPorPartido)}
          userEmail={user.email!}
          userName={user.user_metadata.full_name ?? user.email!}
        />

        {/* Banderines decorativos abajo */}
        <div className="bunting-flags" />
      </div>
    </div>
  )
}