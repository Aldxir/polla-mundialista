import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function TablaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: posiciones } = await supabase
    .from('usuarios_posiciones')
    .select('*')
    .order('puntaje_total', { ascending: false })
    .order('aciertos_exactos', { ascending: false })

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">Tabla de posiciones</h1>
          <a href="/partidos" className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 text-sm font-medium">
            ← Partidos
          </a>
        </header>

        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                <th className="px-4 py-3 w-12">#</th>
                <th className="px-4 py-3">Participante</th>
                <th className="px-4 py-3 text-center w-20">Exactos</th>
                <th className="px-4 py-3 text-right w-24">Puntos</th>
              </tr>
            </thead>
            <tbody>
              {(posiciones ?? []).map((p, idx) => {
                const esActual = p.correo_institucional === user.email
                return (
                  <tr
                    key={p.id}
                    className={`border-t border-slate-100 ${esActual ? 'bg-blue-50' : ''}`}
                  >
                    <td className="px-4 py-3 font-semibold text-slate-700">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{p.nombre}</p>
                      <p className="text-xs text-slate-500">{p.correo_institucional}</p>
                    </td>
                    <td className="px-4 py-3 text-center text-slate-700">{p.aciertos_exactos}</td>
                    <td className="px-4 py-3 text-right font-bold text-blue-600 text-lg">
                      {p.puntaje_total}
                    </td>
                  </tr>
                )
              })}
              {(!posiciones || posiciones.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                    Aún no hay participantes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}