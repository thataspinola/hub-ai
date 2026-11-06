/** @jest-environment node */
import authOptions from '@/app/api/auth/[...nextauth]/auth-options'
import { refreshAccessToken } from '@/lib/auth/refresh-token'

jest.mock('next-runtime-env', () => ({
  env: (name: string) =>
    ({
      KEYCLOAK_CLIENT_ID: 'test-client',
      KEYCLOAK_CLIENT_SECRET: 'synthetic',
      KEYCLOAK_ISSUER: 'https://identity.example.invalid/realms/test',
    })[name],
}))

jest.mock('../../../src/lib/auth/refresh-token', () => ({
  refreshAccessToken: jest.fn(),
}))

const jwt = authOptions.callbacks!.jwt!
const session = authOptions.callbacks!.session!

beforeEach(() => jest.clearAllMocks())

it('refreshes an expired token through the configured identity provider', async () => {
  const token = {
    access_token: 'expired',
    refresh_token: 'synthetic',
    expires_at: 1,
  }

  const refreshed = {
    ...token,
    access_token: 'renewed',
    expires_at: 2_000_000_000,
  }

  jest.mocked(refreshAccessToken).mockResolvedValue(refreshed)
  const result = await jwt({ token } as unknown as Parameters<typeof jwt>[0])

  expect(refreshAccessToken).toHaveBeenCalledWith(token, {
    issuer: 'https://identity.example.invalid/realms/test',
    clientId: 'test-client',
    clientSecret: 'synthetic',
  })

  expect(result.access_token).toBe('renewed')
})

it('retains provider roles for administrative authorization', async () => {
  const token = await jwt({
    token: {},
    account: {
      access_token: 'synthetic',
      expires_at: Math.floor(Date.now() / 1000) + 3600,
    },
    profile: {
      realm_access: { roles: ['reader'] },
      resource_access: { 'test-client': { roles: ['admin', 'reader'] } },
    },
  } as unknown as Parameters<typeof jwt>[0])

  expect(token.roles).toEqual(['reader', 'admin'])

  const result = await session({
    session: { expires: 'synthetic' },
    token,
  } as unknown as Parameters<typeof session>[0])

  expect(result).toMatchObject({
    roles: ['reader', 'admin'],
    access_token: 'synthetic',
  })
})

it('exposes refresh failure to the UI without retrying a rejected token', async () => {
  const token = { error: 'RefreshAccessTokenError', expires_at: 1 }

  expect(await jwt({ token } as unknown as Parameters<typeof jwt>[0])).toEqual(
    token
  )

  expect(refreshAccessToken).not.toHaveBeenCalled()

  const result = await session({
    session: { expires: 'synthetic' },
    token,
  } as unknown as Parameters<typeof session>[0])

  expect(result).toMatchObject({ error: 'RefreshAccessTokenError' })
})
