import { requireAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Shield, ArrowLeft, Medal } from 'lucide-react'
import NuevoPartidoForm from './NuevoPartidoForm'
import PartidoAdminRow from './PartidoAdminRow'

export default async function AdminPage() {
  const { isAdmin, user } = await requireAdmin()
  if (!user) redirect('/login')
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-emerald-950/40 backdrop-blur border border-red-500/30 rounded-2xl p-8 max-w-md text-center space-y-3">
          <h1 className="font-display text-3xl text-red-300">ACCESO RESTRINGIDO</h1>
          <p className="text-emerald-200/70">No tienes permisos de administrador.</p>
          <a href="/partidos" className="inline-block px-4 py-2 bg-amber-400 text-emerald-950 font-bold rounded-xl text-sm">
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
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
              <Shield className="w-6 h-6 text-amber-400" strokeWidth={1.5} />
            </div>
            <h1 className="font-display text-3xl text-white tracking-wide">PANEL ADMIN</h1>
          </div>
          <nav className="flex gap-2">
            <a href="/partidos" className="flex items-center gap-1.5 px-3 py-2 bg-emerald-900/40 hover:bg-emerald-900/60 border border-emerald-700/50 text-emerald-100 rounded-xl text-sm font-medium transition">
              <ArrowLeft className="w-4 h-4" />
              Ver como usuario
            </a>
            <a href="/tabla" className="flex items-center gap-1.5 px-3 py-2 bg-emerald-900/40 hover:bg-emerald-900/60 border border-emerald-700/50 text-emerald-100 rounded-xl text-sm font-medium transition">
              <Medal className="w-4 h-4" />
              Tabla
            </a>
          </nav>
        </header>

        <section className="bg-emerald-950/40 backdrop-blur border border-emerald-800/50 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-amber-300">Crear partido nuevo</h2>
          <NuevoPartidoForm />
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">
            Partidos <span className="text-emerald-200/60 text-base font-normal">({partidos?.length ?? 0})</span>
          </h2>
          {(partidos ?? []).map(p => (
            <PartidoAdminRow key={p.id} partido={p} />
          ))}
        </section>
      </div>
    </div>
  )
}