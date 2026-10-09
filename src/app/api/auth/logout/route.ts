import { ClientSession } from '@/types/client-session'
import { getServerSession } from 'next-auth'
import { env } from 'next-runtime-env'
import authOptions from '../[...nextauth]/auth-options'

export async function GET() {
  return new Response('Use POST', { status: 405, headers: { Allow: 'POST' } })
}

export async function POST(request: Request) {
  // Same-origin mutation; forwarded Host is not used as the trust boundary.
  const configuredUrl = env('NEXTAUTH_URL')
  if (!configuredUrl) return new Response('Logout configuration unavailable', { status: 503 })
  try {
    if (request.headers.get('origin') !== new URL(configuredUrl).origin) return new Response('Forbidden', { status: 403 })
  } catch { return new Response('Logout configuration unavailable', { status: 503 }) }
  const session: ClientSession | null = await getServerSession(authOptions)
  if (!session) return new Response(null, { status: 204 })
  if (!session.id_token) return new Response('Identity token unavailable', { status: 401 })
  try {
    const endpoint = new URL(env('NEXTAUTH_LOGOUT') || '')
    if (endpoint.protocol !== 'https:') return new Response('Logout configuration unavailable', { status: 503 })
    endpoint.searchParams.set('id_token_hint', session.id_token)
    endpoint.searchParams.set('post_logout_redirect_uri', configuredUrl)
    const response = await fetch(endpoint, { method: 'GET', cache: 'no-store', redirect: 'manual', signal: AbortSignal.timeout(5000) })
    if (!response.ok && !(response.status >= 300 && response.status < 400)) return new Response('Identity provider logout failed', { status: 502 })
    return new Response(null, { status: 204 })
  } catch { return new Response('Identity provider logout failed', { status: 502 }) }
}
