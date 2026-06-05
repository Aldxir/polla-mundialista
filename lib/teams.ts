// Mapeo de equipos a banderas emoji. Soporta variantes de nombre.
const FLAGS: Record<string, string> = {
  'argentina': '🇦🇷', 'brasil': '🇧🇷', 'brazil': '🇧🇷',
  'ecuador': '🇪🇨', 'colombia': '🇨🇴', 'uruguay': '🇺🇾',
  'paraguay': '🇵🇾', 'chile': '🇨🇱', 'peru': '🇵🇪', 'perú': '🇵🇪',
  'venezuela': '🇻🇪', 'bolivia': '🇧🇴',
  'mexico': '🇲🇽', 'méxico': '🇲🇽', 'usa': '🇺🇸', 'estados unidos': '🇺🇸',
  'canada': '🇨🇦', 'canadá': '🇨🇦', 'costa rica': '🇨🇷', 'panama': '🇵🇦', 'panamá': '🇵🇦',
  'jamaica': '🇯🇲', 'honduras': '🇭🇳',
  'españa': '🇪🇸', 'spain': '🇪🇸', 'francia': '🇫🇷', 'france': '🇫🇷',
  'alemania': '🇩🇪', 'germany': '🇩🇪', 'italia': '🇮🇹', 'italy': '🇮🇹',
  'inglaterra': '🇬🇧', 'england': '🇬🇧', 'portugal': '🇵🇹',
  'países bajos': '🇳🇱', 'holanda': '🇳🇱', 'netherlands': '🇳🇱',
  'belgica': '🇧🇪', 'bélgica': '🇧🇪', 'croacia': '🇭🇷', 'suiza': '🇨🇭',
  'dinamarca': '🇩🇰', 'polonia': '🇵🇱', 'serbia': '🇷🇸', 'austria': '🇦🇹',
  'gales': '🏴󠁧󠁢󠁷󠁬󠁳󠁿', 'escocia': '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'ucrania': '🇺🇦', 'turquia': '🇹🇷', 'turquía': '🇹🇷',
  'marruecos': '🇲🇦', 'senegal': '🇸🇳', 'túnez': '🇹🇳', 'tunez': '🇹🇳',
  'egipto': '🇪🇬', 'argelia': '🇩🇿', 'ghana': '🇬🇭', 'camerun': '🇨🇲', 'camerún': '🇨🇲',
  'nigeria': '🇳🇬', 'sudafrica': '🇿🇦', 'sudáfrica': '🇿🇦', 'costa de marfil': '🇨🇮',
  'japon': '🇯🇵', 'japón': '🇯🇵', 'corea del sur': '🇰🇷', 'australia': '🇦🇺',
  'iran': '🇮🇷', 'irán': '🇮🇷', 'arabia saudita': '🇸🇦', 'qatar': '🇶🇦',
}

export function getTeamFlag(team: string): string {
  return FLAGS[team.toLowerCase().trim()] ?? '⚽'
}

// Estilos por fase del torneo (badges)
export function getPhaseStyles(fase: string): { bg: string; text: string; border: string } {
  const styles: Record<string, { bg: string; text: string; border: string }> = {
    'Grupos':         { bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/30' },
    'Octavos':        { bg: 'bg-sky-500/15',     text: 'text-sky-300',     border: 'border-sky-500/30' },
    'Cuartos':        { bg: 'bg-orange-500/15',  text: 'text-orange-300',  border: 'border-orange-500/30' },
    'Semis':          { bg: 'bg-rose-500/15',    text: 'text-rose-300',    border: 'border-rose-500/30' },
    'Tercer Puesto':  { bg: 'bg-purple-500/15',  text: 'text-purple-300',  border: 'border-purple-500/30' },
    'Final':          { bg: 'bg-amber-500/20',   text: 'text-amber-300',   border: 'border-amber-500/40' },
  }
  return styles[fase] ?? styles['Grupos']
}