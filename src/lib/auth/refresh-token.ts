import type { JWT } from 'next-auth/jwt'
import { createHash } from 'node:crypto'

const pending = new Map<string, { expires: number; promise: Promise<JWT> }>()
const failed = (token: JWT): JWT => ({ ...token, access_token: undefined, error: 'RefreshAccessTokenError' })

export async function refreshAccessToken(token: JWT, config: { issuer: string; clientId: string; clientSecret: string }, now = Date.now()): Promise<JWT> {
  if (typeof token.refresh_token !== 'string' || !config.clientId || !config.clientSecret) return failed(token)
  let endpoint: URL
  try {
    endpoint = new URL(config.issuer.replace(/\/$/, '') + '/protocol/openid-connect/token')
    if (endpoint.protocol !== 'https:' && !(process.env.NODE_ENV !== 'production' && endpoint.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(endpoint.hostname))) return failed(token)
  } catch { return failed(token) }
  for (const [key, entry] of pending) if (entry.expires <= now) pending.delete(key)
  const key = createHash('sha256').update(JSON.stringify([config.issuer, config.clientId, config.clientSecret, token.refresh_token])).digest('hex')
  const existing = pending.get(key)
  if (existing) return { ...token, ...await existing.promise }
  const promise = (async (): Promise<JWT> => {
    try {
      const response = await fetch(endpoint, {
        method: 'POST', redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(5000),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: token.refresh_token as string, client_id: config.clientId, client_secret: config.clientSecret }),
      })
      if (!response.ok) return failed(token)
      const result = await response.json()
      if (typeof result.access_token !== 'string' || !result.access_token || typeof result.expires_in !== 'number' || result.expires_in <= 0 || !Number.isFinite(result.expires_in)) return failed(token)
      return { ...token, access_token: result.access_token, expires_at: Math.floor(Date.now() / 1000) + result.expires_in, refresh_token: typeof result.refresh_token === 'string' && result.refresh_token ? result.refresh_token : token.refresh_token, id_token: typeof result.id_token === 'string' ? result.id_token : token.id_token, error: undefined }
    } catch { return failed(token) }
  })()
  if (pending.size < 100) pending.set(key, { expires: now + 10_000, promise })
  return promise
}
