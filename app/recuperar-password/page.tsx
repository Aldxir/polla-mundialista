'use client'

import { createClient } from '@/lib/supabase/client'
import { Trophy, ArrowLeft, Mail } from 'lucide-react'
import { useState } from 'react'

export default function RecuperarPasswordPage() {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setEnviado(true)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-amber-400/10 border-2 border-amber-400/30 flex items-center justify-center">
            <Trophy className="w-10 h-10 text-amber-400" strokeWidth={1.5} />
          </div>
        </div>

        <div className="bg-emerald-950/40 backdrop-blur-xl border border-emerald-800/50 rounded-3xl p-8 space-y-6 shadow-2xl">
          {!enviado ? (
            <>
              <div className="text-center space-y-2">
                <h1 className="font-display text-4xl text-white">RECUPERAR ACCESO</h1>
                <p className="text-emerald-200/70 text-sm">
                  Te enviaremos un link para resetear tu contraseña.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  placeholder="Tu email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-emerald-950/60 border border-emerald-700/50 text-white placeholder-emerald-200/40 rounded-xl focus:border-amber-400 focus:outline-none"
                />

                {error && (
                  <p className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-md">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-3 bg-amber-400 hover:bg-amber-300 disabled:bg-slate-600 text-emerald-950 font-bold rounded-xl transition"
                >
                  {loading ? 'Enviando...' : 'Enviar link'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center">
                <Mail className="w-8 h-8 text-emerald-400" strokeWidth={1.5} />
              </div>
              <h1 className="font-display text-3xl text-white">¡Revisa tu email!</h1>
              <p className="text-emerald-200/70">
                Te enviamos un link a <strong className="text-amber-300">{email}</strong> para resetear tu contraseña.
              </p>
            </div>
          )}

          <a
            href="/login"
            className="flex items-center justify-center gap-1.5 text-sm text-emerald-200/70 hover:text-emerald-100 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al login
          </a>
        </div>
      </div>
    </div>
  )
}