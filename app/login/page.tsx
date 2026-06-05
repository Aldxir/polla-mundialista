'use client'

import { createClient } from '@/lib/supabase/client'
import { Trophy } from 'lucide-react'

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) console.error('Error al iniciar sesión:', error.message)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Trofeo decorativo */}
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
              Mundial 2026 · Pronósticos
            </p>
          </div>

          <div className="border-t border-emerald-800/50 pt-6">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 transition rounded-xl px-4 py-3.5 font-medium text-slate-800 shadow-lg shadow-black/20"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continuar con Google
            </button>
          </div>

          <p className="text-xs text-emerald-200/50 text-center">
            Al iniciar sesión aceptas las reglas de la polla
          </p>
        </div>
      </div>
    </div>
  )
}