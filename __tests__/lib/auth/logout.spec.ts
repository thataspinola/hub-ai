/** @jest-environment node */
import { GET, POST } from '@/app/api/auth/logout/route'
import { getServerSession } from 'next-auth'

jest.mock('next-auth', () => ({ getServerSession: jest.fn() }))

jest.mock('next-runtime-env', () => ({
  env: (name: string) =>
    ({
      NEXTAUTH_URL: 'https://panel.example.invalid/base',
      NEXTAUTH_LOGOUT: 'https://identity.example.invalid/logout',
    })[name],
}))

const request = (origin = 'https://panel.example.invalid') =>
  new Request('https://panel.example.invalid/api/auth/logout', {
    method: 'POST',
    headers: { origin },
  })

const original = global.fetch

afterEach(() => {
  global.fetch = original
  jest.clearAllMocks()
})

it('GET cannot mutate identity state', async () => {
  expect((await GET()).status).toBe(405)
  expect(getServerSession).not.toHaveBeenCalled()
})

it('anonymous logout has an explicit idempotent response', async () => {
  ;(getServerSession as jest.Mock).mockResolvedValue(null)
  expect((await POST(request())).status).toBe(204)
})

it('rejects cross-origin mutation before session/provider access', async () => {
  expect((await POST(request('https://other.example.invalid'))).status).toBe(
    403
  )

  expect(getServerSession).not.toHaveBeenCalled()
})

it('reports provider HTTP failures', async () => {
  ;(getServerSession as jest.Mock).mockResolvedValue({
    id_token: 'synthetic id & redirect',
  })

  global.fetch = jest.fn().mockResolvedValue(new Response('', { status: 500 }))
  expect((await POST(request())).status).toBe(502)
  const url = (global.fetch as jest.Mock).mock.calls[0][0] as URL
  expect(url.searchParams.get('id_token_hint')).toBe('synthetic id & redirect')
})

it('accepts the provider redirect without following it', async () => {
  ;(getServerSession as jest.Mock).mockResolvedValue({ id_token: 'synthetic' })

  global.fetch = jest
    .fn()
    .mockResolvedValue(new Response(null, { status: 302 }))

  expect((await POST(request())).status).toBe(204)
  expect((global.fetch as jest.Mock).mock.calls[0][1].redirect).toBe('manual')
})
