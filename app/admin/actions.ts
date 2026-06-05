'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/admin'
import { revalidatePath } from 'next/cache'

export async function crearPartido({
  equipoA, equipoB, fase, fecha,
}: {
  equipoA: string
  equipoB: string
  fase: string
  fecha: string
}) {
  const { isAdmin } = await requireAdmin()
  if (!isAdmin) return { error: 'No autorizado' }

  const supabase = await createClient()
  const { error } = await supabase.from('partidos').insert({
    equipo_a: equipoA,
    equipo_b: equipoB,
    fase,
    fecha_partido: new Date(fecha).toISOString(),
  })

  if (error) return { error: error.message }
  revalidatePath('/admin')
  revalidatePath('/partidos')
  return { ok: true }
}

export async function registrarResultado({
  partidoId, golesA, golesB,
}: {
  partidoId: number
  golesA: number
  golesB: number
}) {
  const { isAdmin } = await requireAdmin()
  if (!isAdmin) return { error: 'No autorizado' }

  const supabase = await createClient()
  // Esto dispara el trigger que calcula puntos automáticamente
  const { error } = await supabase
    .from('partidos')
    .update({
      estado: 'Finalizado',
      goles_reales_a: golesA,
      goles_reales_b: golesB,
    })
    .eq('id', partidoId)

  if (error) return { error: error.message }
  revalidatePath('/admin')
  revalidatePath('/tabla')
  revalidatePath('/partidos')
  return { ok: true }
}

export async function eliminarPartido(partidoId: number) {
  const { isAdmin } = await requireAdmin()
  if (!isAdmin) return { error: 'No autorizado' }

  const supabase = await createClient()
  const { error } = await supabase.from('partidos').delete().eq('id', partidoId)
  if (error) return { error: error.message }
  revalidatePath('/admin')
  revalidatePath('/partidos')
  return { ok: true }
}