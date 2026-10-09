/** @jest-environment node */
import { refreshAccessToken } from '@/lib/auth/refresh-token'
import { canAccessAdministration, requiresAdministrativeAuth } from '@/lib/auth/access-policy'
const config = { issuer: 'https://identity.example.invalid/realms/test', clientId: 'synthetic', clientSecret: 'synthetic' }
const originalFetch = global.fetch
const clock = 2_000_000_000_000
beforeEach(() => { jest.spyOn(Date, 'now').mockReturnValue(clock) })
afterEach(() => { global.fetch = originalFetch; jest.restoreAllMocks() })
it('coalesces concurrent refreshes and preserves the rotated refresh token', async () => {
  global.fetch = jest.fn().mockResolvedValue(Response.json({ access_token: 'new', refresh_token: 'rotated', expires_in: 60 }))
  const token = { refresh_token: 'concurrency-fixture', access_token: 'expired' }
  const results = await Promise.all([refreshAccessToken(token, config), refreshAccessToken(token, config)])
  expect(global.fetch).toHaveBeenCalledTimes(1)
  expect(results[0].refresh_token).toBe('rotated')
  expect(results[0].expires_at).toBe(clock / 1000 + 60)
  expect(results[1].access_token).toBe('new')
})
it('clears stale access on rejected refresh without exposing provider response', async () => {
  global.fetch = jest.fn().mockResolvedValue(new Response('sensitive provider detail', { status: 400 }))
  const result = await refreshAccessToken({ refresh_token: 'failure-fixture', access_token: 'expired' }, config)
  expect(result.error).toBe('RefreshAccessTokenError')
  expect(result.access_token).toBeUndefined()
  expect(JSON.stringify(result)).not.toContain('sensitive provider detail')
})
it('refuses malformed success payloads', async () => {
  global.fetch = jest.fn().mockResolvedValue(Response.json({ expires_in: -1 }))
  expect((await refreshAccessToken({ refresh_token: 'malformed-fixture' }, config)).error).toBe('RefreshAccessTokenError')
})
it('protects production and rejects expired or unauthorized identities', () => {
  expect(requiresAdministrativeAuth({ NODE_ENV: 'production', HUB_AI_REQUIRE_AUTH: 'false' })).toBe(true)
  expect(requiresAdministrativeAuth({ NODE_ENV: 'development' })).toBe(false)
  expect(canAccessAdministration(null)).toBe(false)
  expect(canAccessAdministration({ access_token: 'valid', roles: ['reader'] }, 'admin')).toBe(false)
  expect(canAccessAdministration({ access_token: 'valid', roles: ['admin'] }, 'admin')).toBe(true)
  expect(canAccessAdministration({ access_token: 'valid', expires_at: 1 }, undefined, clock)).toBe(false)
  expect(canAccessAdministration({ access_token: 'valid', error: 'refresh' })).toBe(false)
})
