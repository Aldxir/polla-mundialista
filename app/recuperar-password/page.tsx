import { Trophy, ArrowLeft, MessageCircle, Phone } from 'lucide-react'

export default function RecuperarPasswordPage() {
  const whatsappNumber = '593995549223' // +593 sin el 0 inicial
  const whatsappMensaje = encodeURIComponent(
    'Hola Aldair, olvidé mi contraseña de la Polla Mundialista. Mi email registrado es: '
  )
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMensaje}`

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
            <h1 className="font-display text-4xl text-white gold-glow">
              RECUPERAR ACCESO
            </h1>
            <p className="text-emerald-200/70 text-sm">
              Comunícate con los organizadores para restablecer tu contraseña.
            </p>
          </div>

          <div className="space-y-4">
            {/* Organizador 1 - Aldair */}
            <div className="bg-emerald-900/30 border border-emerald-700/50 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-emerald-200/60 uppercase tracking-wider">Organizador</p>
                  <p className="font-display text-2xl text-white">ALDAIR PORTILLA</p>
                </div>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold rounded-xl px-4 py-3 transition shadow-lg shadow-emerald-500/20"
              >
                <MessageCircle className="w-5 h-5" />
                Escribir por WhatsApp
              </a>

              <p className="text-center text-xs text-emerald-200/60 flex items-center justify-center gap-1.5">
                <Phone className="w-3 h-3" />
                0995549223
              </p>
            </div>

            {/* Organizador 2 - Daniel */}
            <div className="bg-emerald-900/30 border border-emerald-700/50 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-emerald-200/60 uppercase tracking-wider">Organizador</p>
                  <p className="font-display text-2xl text-white">DANIEL ANDRADE</p>
                </div>
              </div>
              <p className="text-center text-sm text-emerald-200/70">
                Contáctalo directamente
              </p>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-xs text-amber-200/90">
            <p className="font-semibold text-amber-300 mb-1">💡 Antes de escribir:</p>
            <p>Ten listo el <strong>email</strong> con el que te registraste. Los organizadores te enviarán un link para crear una nueva contraseña.</p>
          </div>

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