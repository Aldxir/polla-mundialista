import { requireAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import NuevoPartidoForm from './NuevoPartidoForm'
import PartidoAdminRow from './PartidoAdminRow'

export default async function AdminPage() {
  const { isAdmin, user } = await requireAdmin()
  if (!user) redirect('/login')
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white rounded-2xl shadow p-8 max-w-md text-center space-y-3">
          <h1 className="text-2xl font-bold text-slate-900">Acceso restringido</h1>
          <p className="text-slate-600">No tienes permisos de administrador.</p>
          <a href="/partidos" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
            Volver
          </a>
        </div>
      </div>
    )
  }

  const supabase = await createClient()
  const { data: partidos } = await supabase
    .from('partidos')
    .select('*')
    .order('fecha_partido', { ascending: true })

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">Panel de administración</h1>
          <nav className="flex gap-2">
            <a href="/partidos" className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 text-sm font-medium">
              Ver como usuario
            </a>
            <a href="/tabla" className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 text-sm font-medium">
              Tabla
            </a>
            <form action="/auth/signout" method="post">
              <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 text-sm font-medium">
                Salir
              </button>
            </form>
          </nav>
        </header>

        <section className="bg-white rounded-2xl shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Crear partido nuevo</h2>
          <NuevoPartidoForm />
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Partidos ({partidos?.length ?? 0})</h2>
          {(partidos ?? []).map(p => (
            <PartidoAdminRow key={p.id} partido={p} />
          ))}
        </section>
      </div>
    </div>
  )
}