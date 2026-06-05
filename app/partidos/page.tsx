import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PartidoCard from './PartidoCard'
import { requireAdmin } from '@/lib/auth/admin'

export default async function PartidosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Traer partidos pendientes ordenados por fecha
  const { data: partidos } = await supabase
    .from('partidos')
    .select('*')
    .eq('estado', 'Pendiente')
    .order('fecha_partido', { ascending: true })

  // Traer pronósticos del usuario actual
  const { data: misPronosticos } = await supabase
    .from('pronosticos')
    .select('*')
    .eq('estudiante_email', user.email!)

  // Indexar pronósticos por partido_id para búsqueda rápida
  const pronosticosPorPartido = new Map(
    (misPronosticos ?? []).map(p => [p.partido_id, p])
  )

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Pronósticos</h1>
            <p className="text-slate-600 text-sm mt-1">
              Hola, {user.user_metadata.full_name?.split(' ')[0] ?? user.email}
            </p>
          </div>
          <nav className="flex gap-2">
            <a href="/tabla" className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 text-sm font-medium">
              Tabla de posiciones
            </a>
            <form action="/auth/signout" method="post">
              <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 text-sm font-medium">
                Salir
              </button>
            </form>
          </nav>
        </header>

        {!partidos || partidos.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center text-slate-500">
            No hay partidos disponibles por ahora.
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