const FLAGS: Record<string, string> = {
  // Sudamérica
  'argentina': '🇦🇷', 'brasil': '🇧🇷', 'brazil': '🇧🇷',
  'ecuador': '🇪🇨', 'colombia': '🇨🇴', 'uruguay': '🇺🇾',
  'paraguay': '🇵🇾', 'chile': '🇨🇱', 'perú': '🇵🇪', 'peru': '🇵🇪',
  'venezuela': '🇻🇪', 'bolivia': '🇧🇴',
  // Concacaf
  'méxico': '🇲🇽', 'mexico': '🇲🇽',
  'estados unidos': '🇺🇸', 'usa': '🇺🇸',
  'canadá': '🇨🇦', 'canada': '🇨🇦',
  'costa rica': '🇨🇷', 'panamá': '🇵🇦', 'panama': '🇵🇦',
  'jamaica': '🇯🇲', 'honduras': '🇭🇳',
  'haití': '🇭🇹', 'haiti': '🇭🇹',
  'curazao': '🇨🇼', 'curaçao': '🇨🇼',
  // Europa
  'españa': '🇪🇸', 'spain': '🇪🇸',
  'francia': '🇫🇷', 'france': '🇫🇷',
  'alemania': '🇩🇪', 'germany': '🇩🇪',
  'italia': '🇮🇹', 'italy': '🇮🇹',
  'inglaterra': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'england': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'escocia': '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  'gales': '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
  'portugal': '🇵🇹',
  'países bajos': '🇳🇱', 'holanda': '🇳🇱', 'netherlands': '🇳🇱',
  'bélgica': '🇧🇪', 'belgica': '🇧🇪',
  'croacia': '🇭🇷', 'suiza': '🇨🇭',
  'dinamarca': '🇩🇰', 'polonia': '🇵🇱', 'serbia': '🇷🇸', 'austria': '🇦🇹',
  'noruega': '🇳🇴', 'suecia': '🇸🇪',
  'chequia': '🇨🇿', 'república checa': '🇨🇿',
  'ucrania': '🇺🇦', 'turquía': '🇹🇷', 'turquia': '🇹🇷',
  'bosnia': '🇧🇦', 'bosnia y herzegovina': '🇧🇦',
  // África
  'marruecos': '🇲🇦', 'senegal': '🇸🇳',
  'túnez': '🇹🇳', 'tunez': '🇹🇳',
  'egipto': '🇪🇬', 'argelia': '🇩🇿',
  'ghana': '🇬🇭', 'camerún': '🇨🇲', 'camerun': '🇨🇲',
  'nigeria': '🇳🇬', 'sudáfrica': '🇿🇦', 'sudafrica': '🇿🇦',
  'costa de marfil': '🇨🇮',
  'cabo verde': '🇨🇻',
  // Asia y Oceanía
  'japón': '🇯🇵', 'japon': '🇯🇵',
  'corea del sur': '🇰🇷',
  'australia': '🇦🇺', 'nueva zelanda': '🇳🇿',
  'irán': '🇮🇷', 'iran': '🇮🇷',
  'arabia saudita': '🇸🇦', 'qatar': '🇶🇦',
  'irak': '🇮🇶', 'iraq': '🇮🇶',
  'jordania': '🇯🇴', 'uzbekistán': '🇺🇿', 'uzbekistan': '🇺🇿',
}

export function getTeamFlag(team: string): string {
  return FLAGS[team.toLowerCase().trim()] ?? '⚽'
}

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