import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ArrowLeft, User, Trophy, Target, Hash } from 'lucide-react'
import { getTeamFlag, getPhaseStyles } from '@/lib/teams'

export default async function MisPronosticosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Traer pronósticos del usuario con el partido relacionado
  const { data: pronosticos } = await supabase
    .from('pronosticos')
    .select(`
      id, prediccion_goles_a, prediccion_goles_b, puntos_ganados, procesado, created_at,
      partido:partidos (
        id, equipo_a, equipo_b, goles_reales_a, goles_reales_b, estado, fase, fecha_partido
      )
    `)
    .eq('estudiante_email', user.email!)
    .order('created_at', { ascending: false })

  // Traer puntaje total del usuario
  const { data: posicion } = await supabase
    .from('usuarios_posiciones')
    .select('*')
    .eq('correo_institucional', user.email!)
    .single()

  // Estadísticas
  const procesados = (pronosticos ?? []).filter((p: any) => p.procesado)
  const exactos = procesados.filter(
    (p: any) => p.partido && p.partido.goles_reales_a === p.prediccion_goles_a && p.partido.goles_reales_b === p.prediccion_goles_b
  ).length
  const tendencias = procesados.filter((p: any) => p.puntos_ganados > 0).length - exactos
  const fallados = procesados.length - exactos - tendencias

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
              <User className="w-6 h-6 text-amber-400" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="font-display text-3xl text-white tracking-wide">MIS PRONÓSTICOS</h1>
              <p className="text-emerald-200/70 text-sm">{user.user_metadata.full_name ?? user.email}</p>
            </div>
          </div>
          <a href="/partidos" className="flex items-center gap-1.5 px-3 py-2 bg-emerald-900/40 hover:bg-emerald-900/60 border border-emerald-700/50 text-emerald-100 rounded-xl text-sm font-medium transition">
            <ArrowLeft className="w-4 h-4" />
            Partidos
          </a>
        </header>

        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Puntos" value={posicion?.puntaje_total ?? 0} icon={<Trophy className="w-5 h-5" />} color="amber" />
          <StatCard label="Exactos" value={exactos} icon={<Target className="w-5 h-5" />} color="emerald" />
          <StatCard label="Tendencia" value={tendencias} icon={<Hash className="w-5 h-5" />} color="sky" />
          <StatCard label="Fallados" value={fallados} icon={<Hash className="w-5 h-5" />} color="slate" />
        </div>

        {/* Lista de pronósticos */}
        {!pronosticos || pronosticos.length === 0 ? (
          <div className="bg-emerald-950/40 backdrop-blur border border-emerald-800/50 rounded-2xl p-12 text-center space-y-2">
            <p className="text-emerald-200/70">Aún no has pronosticado ningún partido.</p>
            <a href="/partidos" className="inline-block mt-3 px-4 py-2 bg-amber-400 text-emerald-950 font-bold rounded-xl text-sm">
              Hacer mi primer pronóstico
            </a>
          </div>
        ) : (
          <div className="space-y-2">
            {pronosticos.map((p: any) => (
              <PronosticoRow key={p.id} pronostico={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: 'amber' | 'emerald' | 'sky' | 'slate' }) {
  const colors = {
    amber:   'border-amber-500/30 text-amber-300',
    emerald: 'border-emerald-500/30 text-emerald-300',
    sky:     'border-sky-500/30 text-sky-300',
    slate:   'border-slate-500/30 text-slate-300',
  }
  return (
    <div className={`bg-emerald-950/40 backdrop-blur border ${colors[color]} rounded-2xl p-4`}>
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider opacity-70 mb-1">
        {icon}
        {label}
      </div>
      <p className="font-display text-3xl">{value}</p>
    </div>
  )
}

function PronosticoRow({ pronostico }: { pronostico: any }) {
  const p = pronostico.partido
  if (!p) return null

  const fase = getPhaseStyles(p.fase)
  const fecha = new Date(p.fecha_partido).toLocaleDateString('es-EC', {
    day: 'numeric', month: 'short',
  })

  const finalizado = p.estado === 'Finalizado'
  const exacto = finalizado && p.goles_reales_a === pronostico.prediccion_goles_a && p.goles_reales_b === pronostico.prediccion_goles_b
  const acertoTendencia = finalizado && pronostico.puntos_ganados > 0 && !exacto

  // Color del badge de resultado
  const resultadoStyle = !finalizado
    ? 'bg-slate-500/15 text-slate-300 border-slate-500/30'
    : exacto
      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
      : acertoTendencia
        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
        : 'bg-red-500/15 text-red-300 border-red-500/30'

  const resultadoTexto = !finalizado
    ? 'Pendiente'
    : exacto
      ? '¡EXACTO!'
      : acertoTendencia
        ? 'Acierto'
        : 'Fallado'

  return (
    <div className="bg-emerald-950/30 backdrop-blur border border-emerald-800/50 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border ${fase.bg} ${fase.text} ${fase.border}`}>
            {p.fase}
          </span>
          <span className="text-xs text-emerald-200/60">{fecha}</span>
        </div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${resultadoStyle}`}>
          {resultadoTexto}
          {finalizado && pronostico.puntos_ganados > 0 && ` · +${pronostico.puntos_ganados} pts`}
        </span>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="text-right">
          <p className="font-medium text-white">{p.equipo_a}</p>
          <p className="text-xl">{getTeamFlag(p.equipo_a)}</p>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="text-xs text-emerald-200/60">tu predicción</div>
          <div className="text-2xl font-bold text-white">
            {pronostico.prediccion_goles_a} – {pronostico.prediccion_goles_b}
          </div>
          {finalizado && (
            <>
              <div className="text-xs text-emerald-200/60 mt-1">resultado real</div>
              <div className={`text-lg font-bold ${exacto ? 'text-amber-400' : 'text-emerald-300'}`}>
                {p.goles_reales_a} – {p.goles_reales_b}
              </div>
            </>
          )}
        </div>

        <div>
          <p className="font-medium text-white">{p.equipo_b}</p>
          <p className="text-xl">{getTeamFlag(p.equipo_b)}</p>
        </div>
      </div>
    </div>
  )
}