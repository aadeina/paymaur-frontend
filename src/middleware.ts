import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { locales, defaultLocale } from './i18n/config'

// Create the i18n middleware
const handleI18nRouting = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
})

/**
 * Middleware
 * Handles internationalization, authentication and route protection
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get auth token from cookie or header
  const accessToken = request.cookies.get('access_token')?.value

  // Extract locale from pathname
  const pathnameLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  // Get pathname without locale
  const pathnameWithoutLocale = pathnameLocale
    ? pathname.slice(`/${pathnameLocale}`.length) || '/'
    : pathname

  // Check if current path is dashboard or protected route
  const isProtectedRoute = pathnameWithoutLocale.startsWith('/dashboard')

  // Redirect to login if trying to access protected route without token
  if (isProtectedRoute && !accessToken) {
    const locale = pathnameLocale || defaultLocale
    const loginUrl = new URL(`/${locale}/auth/login`, request.url)
    loginUrl.searchParams.set('redirect', pathnameWithoutLocale)
    return NextResponse.redirect(loginUrl)
  }

  // Public auth routes
  const authRoutes = ['/auth/login', '/auth/register', '/auth/verify-otp', '/auth/forgot-pin', '/auth/reset-pin']
  const isAuthRoute = authRoutes.some((route) => pathnameWithoutLocale.startsWith(route))

  // Redirect to dashboard if authenticated user tries to access auth pages
  if (isAuthRoute && accessToken) {
    const locale = pathnameLocale || defaultLocale
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url))
  }

  // Apply i18n routing
  const response = handleI18nRouting(request)

  // Add security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
