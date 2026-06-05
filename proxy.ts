import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresca la sesión si está cerca de expirar
  const { data: { user } } = await supabase.auth.getUser()

  // Rutas protegidas: si no hay usuario, redirige a /login
const isAuthRoute = request.nextUrl.pathname.startsWith('/login') ||
                    request.nextUrl.pathname.startsWith('/auth') ||
                    request.nextUrl.pathname.startsWith('/registro') ||
                    request.nextUrl.pathname.startsWith('/recuperar-password') ||
                    request.nextUrl.pathname.startsWith('/reset-password')

  if (!user && !isAuthRoute && request.nextUrl.pathname !== '/') {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match todas las rutas excepto:
     * - _next/static, _next/image (assets)
     * - favicon.ico
     * - archivos públicos (imágenes, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}