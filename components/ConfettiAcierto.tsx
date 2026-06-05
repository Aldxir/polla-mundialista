'use client'

import { useEffect } from 'react'
import confetti from 'canvas-confetti'

export default function ConfettiAcierto({ trigger }: { trigger: number }) {
  useEffect(() => {
    if (trigger === 0) return

    // Confeti dorado tipo "celebración de gol"
    const colors = ['#fbbf24', '#f59e0b', '#fde68a', '#fffbeb', '#10b981']

    const duration = 2500
    const animationEnd = Date.now() + duration

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()
      if (timeLeft <= 0) {
        clearInterval(interval)
        return
      }
      const particleCount = 50 * (timeLeft / duration)
      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 9999,
        particleCount,
        colors,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
      })
    }, 250)

    return () => clearInterval(interval)
  }, [trigger])

  return null
}