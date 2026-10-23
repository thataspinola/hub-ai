import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

import {
  canAccessAdministration,
  requiresAdministrativeAuth,
} from '@/lib/auth/access-policy'

const basePath = '/react-ssr-corp-hubv-painel-administrativo'

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname.startsWith(basePath)
    ? request.nextUrl.pathname.slice(basePath.length) || '/'
    : request.nextUrl.pathname

  // Auth endpoints, static assets and the informational catalog remain public.
  if (
    pathname === '/code-reviewer' ||
    pathname.startsWith('/code-reviewer/') ||
    pathname.startsWith('/api/auth/') ||
    pathname.startsWith('/_next/') ||
    pathname === '/favicon.ico' ||
    pathname === '/background.jpg'
  )
    return NextResponse.next()

  if (!requiresAdministrativeAuth()) return NextResponse.next()

  if (!process.env.NEXTAUTH_SECRET)
    return new NextResponse('Authentication configuration unavailable', {
      status: 503,
    })

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!canAccessAdministration(token, process.env.HUB_AI_ADMIN_ROLE)) {
    if (pathname.startsWith('/api/'))
      return new NextResponse('Unauthorized', { status: 401 })

    const url = new URL(basePath + '/api/auth/signin', request.url)
    url.searchParams.set('callbackUrl', request.nextUrl.href)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = { matcher: ['/((?!_next/static|_next/image).*)'] }
