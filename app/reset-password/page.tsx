'use client'

import { createClient } from '@/lib/supabase/client'
import { Trophy } from 'lucide-react'
import { useState } from 'react'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password !== confirmar) { setError('Las contraseñas no coinciden'); return }
    if (password.length < 6) { setError('Mínimo 6 caracteres'); return }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      window.location.href = '/'
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
          <div className="text-center space-y-2">
            <h1 className="font-display text-4xl text-white">NUEVA CONTRASEÑA</h1>
            <p className="text-emerald-200/70 text-sm">Define tu nueva contraseña.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required minLength={6}
              className="w-full px-4 py-3 bg-emerald-950/60 border border-emerald-700/50 text-white placeholder-emerald-200/40 rounded-xl focus:border-amber-400 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmar}
              onChange={e => setConfirmar(e.target.value)}
              required minLength={6}
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
              {loading ? 'Guardando...' : 'Cambiar contraseña'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}