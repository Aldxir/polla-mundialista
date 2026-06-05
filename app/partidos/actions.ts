'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function guardarPronostico({
  partidoId,
  prediccionGolesA,
  prediccionGolesB,
  userEmail,
  userName,
}: {
  partidoId: number
  prediccionGolesA: number
  prediccionGolesB: number
  userEmail: string
  userName: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== userEmail) {
    return { error: 'No autorizado' }
  }

  // Upsert: si ya existe, actualiza; si no, crea
  const { error } = await supabase
    .from('pronosticos')
    .upsert(
      {
        partido_id: partidoId,
        estudiante_email: userEmail,
        nombre_estudiante: userName,
        prediccion_goles_a: prediccionGolesA,
        prediccion_goles_b: prediccionGolesB,
      },
      { onConflict: 'partido_id,estudiante_email' }
    )

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/partidos')
  return { ok: true }
}