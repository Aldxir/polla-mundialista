'use client'

import { createClient } from '@/lib/supabase/client'
import { Trophy, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { useState } from 'react'

export default function RegistroPage() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const traducirError = (msg: string): string => {
    if (msg.includes('already registered')) return 'Ya existe una cuenta con ese email'
    if (msg.includes('weak password') || msg.includes('Password should')) return 'La contraseña es muy débil (mínimo 6 caracteres)'
    if (msg.includes('Invalid email')) return 'Email inválido'
    return msg
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmar) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    if (nombre.trim().length < 2) {
      setError('Ingresa tu nombre completo')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: nombre.trim() },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(traducirError(error.message))
      setLoading(false)
    } else {
      // Si Supabase NO requiere confirmación de email, la sesión ya está activa
      if (data.session) {
        window.location.href = '/'
      } else {
        // Si SÍ requiere confirmación, mostramos mensaje
        setSuccess(true)
        setLoading(false)
      }
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-emerald-950/40 backdrop-blur-xl border border-emerald-800/50 rounded-3xl p-8 space-y-4 shadow-2xl text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center">
              <Trophy className="w-8 h-8 text-emerald-400" strokeWidth={1.5} />
            </div>
            <h1 className="font-display text-3xl text-white">¡Cuenta creada!</h1>
            <p className="text-emerald-200/70">
              Te enviamos un email a <strong className="text-amber-300">{email}</strong> para confirmar tu cuenta.
            </p>
            <a href="/login" className="inline-block px-4 py-2 bg-amber-400 text-emerald-950 font-bold rounded-xl text-sm">
              Ir al login
            </a>
          </div>
        </div>
      </div>
    )
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
              CREAR CUENTA
            </h1>
            <p className="text-emerald-200/70 text-sm tracking-wider uppercase">
              Únete a la polla del Mundial
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Nombre completo"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
              className="w-full px-4 py-3 bg-emerald-950/60 border border-emerald-700/50 text-white placeholder-emerald-200/40 rounded-xl focus:border-amber-400 focus:outline-none"
            />
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
                placeholder="Contraseña (mín. 6 caracteres)"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
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
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirmar contraseña"
              value={confirmar}
              onChange={e => setConfirmar(e.target.value)}
              required
              minLength={6}
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
              className="w-full px-4 py-3 bg-amber-400 hover:bg-amber-300 disabled:bg-slate-600 text-emerald-950 font-bold rounded-xl transition shadow-lg shadow-amber-500/20"
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

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