'use client'

import { createClient } from '@/lib/supabase/client'
import { Trophy, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const traducirError = (msg: string): string => {
    if (msg.includes('Invalid login credentials')) return 'Email o contraseña incorrectos'
    if (msg.includes('Email not confirmed')) return 'Confirma tu email antes de iniciar sesión'
    if (msg.includes('User not found')) return 'No existe una cuenta con ese email'
    return msg
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(traducirError(error.message))
      setLoading(false)
    } else {
      window.location.href = '/'
    }
  }

  const handleGoogleLogin = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) setError(error.message)
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
            <h1 className="font-display text-5xl text-white gold-glow">
              POLLA MUNDIALISTA
            </h1>
            <p className="text-emerald-200/70 text-sm tracking-wider uppercase">
              Para empezar, inicia sesión
            </p>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-emerald-950/60 border border-emerald-700/50 text-white placeholder-emerald-200/40 rounded-xl focus:border-amber-400 focus:outline-none"
            />

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 pr-12 bg-emerald-950/60 border border-emerald-700/50 text-white placeholder-emerald-200/40 rounded-xl focus:border-amber-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-200/60 hover:text-emerald-200"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex justify-end">
              <a
                href="/recuperar-password"
                className="text-xs text-amber-300 hover:text-amber-200 transition"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {error && (
              <p className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-md">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-amber-400 hover:bg-amber-300 disabled:bg-slate-600 text-emerald-950 font-bold rounded-xl transition shadow-lg shadow-amber-500/20"
            >
              {loading ? 'Entrando...' : 'Iniciar sesión'}
            </button>
          </form>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-emerald-800/50" />
            <span className="text-xs text-emerald-200/50 uppercase tracking-wider">O</span>
            <div className="flex-1 h-px bg-emerald-800/50" />
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 transition rounded-xl px-4 py-3 font-medium text-slate-800 shadow-lg shadow-black/20"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Inicia sesión con Google
          </button>

          <p className="text-sm text-emerald-200/70 text-center pt-2 border-t border-emerald-800/50">
            ¿No tienes una cuenta?{' '}
            <a href="/registro" className="text-amber-300 hover:text-amber-200 font-medium transition">
              Regístrate
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}