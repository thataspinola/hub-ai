import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import authOptions from '@/app/api/auth/[...nextauth]/auth-options'

const methods = ['GET', 'POST', 'PUT', 'DELETE'] as const
type Method = typeof methods[number]

function apiBase(): URL | null {
  const raw = process.env.CLIENTES_API_URL || process.env.NEXT_PUBLIC_API
  if (!raw) return null
  try {
    const url = new URL(raw)
    if (url.protocol !== 'https:' && !(process.env.NODE_ENV === 'development' && url.protocol === 'http:')) return null
    if (url.username || url.password || url.search || url.hash) return null
    return url
  } catch { return null }
}

function endpoint(base: URL, id?: string) {
  const url = new URL(base.toString())
  const prefix = base.pathname.replace(/\/$/, '')
  url.pathname = prefix + '/cliente' + (id ? '/' + encodeURIComponent(id) : '')
  return url
}

function validate(input: unknown): { nome: string; email: string } | null {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null
  const value = input as Record<string, unknown>
  if (typeof value.nome !== 'string' || typeof value.email !== 'string') return null
  const nome = value.nome.trim()
  const email = value.email.trim().toLowerCase()
  if (!nome || nome.length > 120 || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null
  return { nome, email }
}

export async function clientRequest(request: NextRequest, method: Method, id?: string) {
  const session = await getServerSession(authOptions)
  const token = (session as { access_token?: unknown; error?: unknown } | null)
  if (!token || token.error || typeof token.access_token !== 'string' || !token.access_token)
    return NextResponse.json({ error: 'Autenticação corporativa necessária' }, { status: 401 })

  const base = apiBase()
  if (!base) return NextResponse.json({ error: 'CLIENTES_API_URL não configurada ou inválida' }, { status: 503 })
  if (id && (!/^\d{1,15}$/.test(id) || Number(id) <= 0))
    return NextResponse.json({ error: 'Código de cliente inválido' }, { status: 400 })

  let body: string | undefined
  if (method === 'POST' || method === 'PUT') {
    let input: unknown
    try { input = await request.json() } catch { return NextResponse.json({ error: 'JSON inválido' }, { status: 400 }) }
    const validated = validate(input)
    if (!validated) return NextResponse.json({ error: 'Nome ou e-mail inválido' }, { status: 400 })
    body = JSON.stringify(validated)
  }

  try {
    const response = await fetch(endpoint(base, id), {
      method,
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body,
      cache: 'no-store',
      signal: AbortSignal.timeout(12000),
    })
    if (response.status === 204) return new NextResponse(null, { status: 204 })
    const raw = await response.text()
    const contentType = response.headers.get('content-type') || ''
    if (!response.ok) return NextResponse.json({ error: 'A API de clientes recusou a operação', status: response.status }, { status: response.status })
    if (!raw) return NextResponse.json(null, { status: 200 })
    if (!contentType.includes('application/json')) return NextResponse.json({ error: 'Resposta inesperada da API' }, { status: 502 })
    try { return NextResponse.json(JSON.parse(raw)) }
    catch { return NextResponse.json({ error: 'JSON inválido retornado pela API' }, { status: 502 }) }
  } catch {
    return NextResponse.json({ error: 'Não foi possível acessar a API de clientes' }, { status: 502 })
  }
}
