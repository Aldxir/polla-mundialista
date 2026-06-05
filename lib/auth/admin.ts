import { createClient } from '@/lib/supabase/server'

export async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { isAdmin: false, user: null }

  const { data } = await supabase
    .from('usuarios_posiciones')
    .select('es_admin')
    .eq('correo_institucional', user.email!)
    .single()

  return { isAdmin: data?.es_admin === true, user }
}