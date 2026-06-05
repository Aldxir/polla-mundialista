import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/admin'
import { Trophy, LogOut, Shield, HelpCircle, Flame } from 'lucide-react'
import PartidoCard from './PartidoCard'
import BotonCompartir from './BotonCompartir'
import CuentaRegresivaMundial from '@/components/CuentaRegresivaMundial'

export default async function PartidosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { isAdmin } = await requireAdmin()

  const ahora = new Date()
  const enUnaSemana = new Date(ahora.getTime() + 7 * 24 * 60 * 60 * 1000)

  const { data: partidos } = await supabase
    .from('partidos')
    .select('*')
    .eq('estado', 'Pendiente')
    .gt('fecha_partido', ahora.toISOString())
    .lt('fecha_partido', enUnaSemana.toISOString())
    .order('fecha_partido', { ascending: true })

  const { data: misPronosticos } = await supabase
    .from('pronosticos')
    .select('*')
    .eq('estudiante_email', user.email!)

  const pronosticosPorPartido = new Map(
    (misPronosticos ?? []).map(p => [p.partido_id, p])
  )

  const nombreUsuario = user.user_metadata.full_name?.split(' ')[0] ?? user.email
  const rangoHasta = enUnaSemana.toLocaleDateString('es-EC', {
    day: 'numeric', month: 'long',
  })

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

        <div className="flex items-center justify-between text-xs text-emerald-200/60 pt-2">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 pulse-live" />
            Partidos hasta el {rangoHasta}
          </span>
          <span className="font-bold text-amber-300">{partidos?.length ?? 0} disponibles</span>
        </div>

        {!partidos || partidos.length === 0 ? (
          <div className="bg-emerald-950/40 backdrop-blur border border-emerald-800/50 rounded-2xl p-12 text-center space-y-2">
            <p className="text-emerald-200/70">No hay partidos para pronosticar esta semana.</p>
            <p className="text-emerald-200/50 text-sm">Vuelve más adelante o revisa la tabla de posiciones.</p>
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

        {/* Banderines decorativos abajo */}
        <div className="bunting-flags" />
      </div>
    </div>
  )
}