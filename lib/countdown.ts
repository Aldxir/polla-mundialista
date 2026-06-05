export function getCountdown(fechaPartido: Date): {
  texto: string
  urgente: boolean
  yaEmpezo: boolean
} {
  const ahora = new Date()
  const diff = fechaPartido.getTime() - ahora.getTime()

  if (diff <= 0) {
    return { texto: 'En vivo o finalizado', urgente: false, yaEmpezo: true }
  }

  const minutos = Math.floor(diff / 60000)
  const horas = Math.floor(minutos / 60)
  const dias = Math.floor(horas / 24)

  if (dias > 0) {
    const horasRestantes = horas % 24
    return {
      texto: horasRestantes > 0 ? `${dias}d ${horasRestantes}h` : `${dias}d`,
      urgente: false,
      yaEmpezo: false,
    }
  }
  if (horas > 0) {
    const minRestantes = minutos % 60
    return {
      texto: `${horas}h ${minRestantes}m`,
      urgente: horas < 2,
      yaEmpezo: false,
    }
  }
  return {
    texto: `${minutos}m`,
    urgente: true,
    yaEmpezo: false,
  }
}