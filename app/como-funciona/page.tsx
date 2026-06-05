import { Trophy, Target, TrendingUp, Award, Zap, Lock, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react'

export default function ComoFuncionaPage() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-amber-400" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="font-display text-3xl text-white tracking-wide">CÓMO FUNCIONA</h1>
              <p className="text-emerald-200/70 text-sm">Reglas de la polla del Mundial 2026</p>
            </div>
          </div>
          <a href="/partidos" className="flex items-center gap-1.5 px-3 py-2 bg-emerald-900/40 hover:bg-emerald-900/60 border border-emerald-700/50 text-emerald-100 rounded-xl text-sm font-medium transition">
            <ArrowLeft className="w-4 h-4" />
            Volver
          </a>
        </header>

        {/* Bienvenida */}
        <section className="bg-gradient-to-br from-amber-400/10 to-emerald-500/10 backdrop-blur border border-amber-400/30 rounded-3xl p-6 md:p-8 text-center space-y-3">
          <h2 className="font-display text-4xl md:text-5xl text-white gold-glow">¡BIENVENIDO!</h2>
          <p className="text-emerald-100 text-base md:text-lg max-w-xl mx-auto">
            Esta es una polla del Mundial entre amigos. Pronosticas los marcadores de los partidos y ganas puntos cuando aciertas. El que acumule más puntos al final del Mundial, gana.
          </p>
        </section>

        {/* Cómo se gana puntos */}
        <section className="space-y-4">
          <h2 className="font-display text-2xl text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-amber-400" />
            CÓMO GANAR PUNTOS
          </h2>

          <div className="grid gap-3">
            {/* Acierto exacto */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                  <span className="font-display text-3xl text-amber-300">3</span>
                </div>
                <div>
                  <h3 className="font-bold text-amber-300 text-lg mb-1">Acierto exacto</h3>
                  <p className="text-emerald-100/90 text-sm">
                    Predijiste el marcador exacto. Ejemplo: dijiste 2-1 y quedó 2-1.
                  </p>
                </div>
              </div>
            </div>

            {/* Tendencia */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                  <span className="font-display text-3xl text-emerald-300">1</span>
                </div>
                <div>
                  <h3 className="font-bold text-emerald-300 text-lg mb-1">Acierto de tendencia</h3>
                  <p className="text-emerald-100/90 text-sm">
                    Acertaste quién ganaba (o el empate), pero no el marcador exacto. Ejemplo: dijiste 2-0 y quedó 3-1, igual ganó el mismo equipo.
                  </p>
                </div>
              </div>
            </div>

            {/* Fallado */}
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center">
                  <span className="font-display text-3xl text-red-300">0</span>
                </div>
                <div>
                  <h3 className="font-bold text-red-300 text-lg mb-1">No acertaste</h3>
                  <p className="text-emerald-100/90 text-sm">
                    Predijiste mal el ganador. Ejemplo: dijiste que ganaba Brasil y ganó Argentina.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Multiplicador por fase */}
        <section className="space-y-4">
          <h2 className="font-display text-2xl text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-amber-400" />
            MULTIPLICADOR POR FASE
          </h2>

          <p className="text-emerald-100/80 text-sm">
            A medida que avanza el Mundial, los partidos valen más. Los puntos ganados se <strong className="text-amber-300">multiplican</strong> según la fase:
          </p>

          <div className="bg-emerald-950/40 backdrop-blur border border-emerald-800/50 rounded-2xl overflow-hidden">
            {[
              { fase: 'Fase de Grupos',  mult: '×1', color: 'text-emerald-300', desc: 'Partidos normales' },
              { fase: 'Octavos de Final', mult: '×2', color: 'text-sky-300',     desc: '32 equipos restantes' },
              { fase: 'Cuartos de Final', mult: '×3', color: 'text-orange-300',  desc: '16 equipos restantes' },
              { fase: 'Semifinales',      mult: '×4', color: 'text-rose-300',    desc: 'Solo quedan 4' },
              { fase: 'Tercer Puesto',    mult: '×4', color: 'text-purple-300',  desc: 'Pelea por el bronce' },
              { fase: 'Final',            mult: '×5', color: 'text-amber-300',   desc: 'El partido más valioso' },
            ].map((row, idx) => (
              <div
                key={row.fase}
                className={`grid grid-cols-[1fr_auto] gap-3 px-4 py-3.5 items-center ${
                  idx !== 0 ? 'border-t border-emerald-800/30' : ''
                }`}
              >
                <div>
                  <p className="font-semibold text-white">{row.fase}</p>
                  <p className="text-xs text-emerald-200/60">{row.desc}</p>
                </div>
                <span className={`font-display text-3xl ${row.color}`}>{row.mult}</span>
              </div>
            ))}
          </div>

          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 text-sm text-amber-100/90">
            <p className="font-semibold text-amber-300 mb-1">💡 Ejemplo:</p>
            <p>Si aciertas el marcador exacto de la <strong>Final</strong> (3 pts × 5) ganas <strong className="text-amber-300">15 puntos de una sola vez</strong>. Por eso el Mundial nunca se decide hasta el último partido.</p>
          </div>
        </section>

        {/* Cómo pronosticar */}
        <section className="space-y-4">
          <h2 className="font-display text-2xl text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-400" />
            CÓMO PRONOSTICAR
          </h2>

          <div className="space-y-3">
            <Step number={1} title="Ve a 'Pronósticos' en el menú">
              Ahí ves los partidos de los próximos 7 días que aún no han empezado.
            </Step>
            <Step number={2} title="Ingresa el marcador que crees que va a quedar">
              Toca los números para subir o escribe directamente. Mínimo 0 goles por equipo.
            </Step>
            <Step number={3} title="Toca 'Pronosticar'">
              Tu predicción queda guardada. Puedes modificarla cuantas veces quieras <strong className="text-amber-300">hasta que el partido empiece</strong>.
            </Step>
            <Step number={4} title="Cuando el partido termine, ganas tus puntos">
              Los puntos se calculan automáticamente y aparecen en la tabla de posiciones en vivo.
            </Step>
          </div>
        </section>

        {/* Reglas importantes */}
        <section className="space-y-4">
          <h2 className="font-display text-2xl text-white flex items-center gap-2">
            <Lock className="w-6 h-6 text-amber-400" />
            REGLAS IMPORTANTES
          </h2>

          <div className="grid gap-2">
            <Rule ok>Puedes modificar tu pronóstico hasta que empiece el partido.</Rule>
            <Rule ok>Si no pronosticas un partido, sumas 0 puntos en ese partido (no resta).</Rule>
            <Rule ok>Los puntos se calculan automáticamente cuando finaliza el partido.</Rule>
            <Rule>Una vez que el partido empieza, ya no puedes modificar nada.</Rule>
            <Rule>El sistema no acepta pronósticos después del pitazo inicial.</Rule>
            <Rule>En caso de empate de puntos, gana quien tenga más aciertos exactos.</Rule>
          </div>
        </section>

        {/* Tips */}
        <section className="space-y-4">
          <h2 className="font-display text-2xl text-white flex items-center gap-2">
            <Zap className="w-6 h-6 text-amber-400" />
            TIPS PARA GANAR
          </h2>

          <div className="bg-emerald-950/40 backdrop-blur border border-emerald-800/50 rounded-2xl p-6 space-y-3 text-emerald-100/90 text-sm">
            <p>🎯 <strong className="text-white">Apunta a marcadores realistas.</strong> Los partidos suelen terminar 1-0, 2-1, 2-0, 1-1. Los 5-3 son raros.</p>
            <p>📅 <strong className="text-white">Pronostica todos los partidos.</strong> Aunque no estés seguro, cada acierto suma. Un 1 punto vale.</p>
            <p>🔥 <strong className="text-white">No subestimes las fases finales.</strong> La Final vale ×5. Aunque vayas último, puedes remontar.</p>
            <p>⏰ <strong className="text-white">No esperes al último minuto.</strong> A veces te olvidas y el partido empieza sin tu pronóstico.</p>
            <p>🏆 <strong className="text-white">Confía en tu instinto.</strong> Las "lógicas" del fútbol se rompen todo el tiempo.</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center pt-6 border-t border-emerald-800/30 space-y-2">
          <p className="text-emerald-200/60 text-sm">
            ¿Tienes dudas? Contacta a los organizadores.
          </p>
          <p className="text-emerald-200/40 text-xs">
            Polla Mundialista 2026 · Hecho por Aldair (AEIE) · 2026
          </p>
        </footer>

        {/* CTA final */}
        <div className="flex justify-center pb-8">
          <a
            href="/partidos"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition"
          >
            <Trophy className="w-5 h-5" />
            Ir a pronosticar
          </a>
        </div>
      </div>
    </div>
  )
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-emerald-950/40 backdrop-blur border border-emerald-800/50 rounded-2xl p-4 flex gap-4 items-start">
      <div className="w-10 h-10 shrink-0 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
        <span className="font-display text-xl text-amber-300">{number}</span>
      </div>
      <div>
        <h3 className="font-semibold text-white mb-1">{title}</h3>
        <p className="text-emerald-100/80 text-sm">{children}</p>
      </div>
    </div>
  )
}

function Rule({ children, ok = false }: { children: React.ReactNode; ok?: boolean }) {
  return (
    <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-xl px-4 py-3 flex items-start gap-3">
      {ok
        ? <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
        : <XCircle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />}
      <p className="text-emerald-100/90 text-sm">{children}</p>
    </div>
  )
}