/**
 * @jest-environment node
 */

const mockGetServerSession = jest.fn()

// Mock next-auth so getServerSession is controllable
jest.mock('next-auth', () => ({
  getServerSession: (...args: unknown[]) => mockGetServerSession(...args),
  default: jest.fn(),
}))

// Mock next-auth/providers/keycloak (required by auth-options.ts transitively)
jest.mock('next-auth/providers/keycloak', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({ id: 'keycloak' }),
}))

// Mock next-runtime-env (required by auth-options.ts)
jest.mock('next-runtime-env', () => ({
  env: jest.fn().mockReturnValue('mock-value'),
}))

import { getAccessToken, getIdToken } from '@/utils/session-token-accessor'

describe('session-token-accessor', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getAccessToken', () => {
    it('returns access_token when session exists', async () => {
      mockGetServerSession.mockResolvedValue({
        access_token: 'test-access-token',
        id_token: 'test-id-token',
      })
      const result = await getAccessToken()
      expect(result).toBe('test-access-token')
    })

    it('returns null when no session', async () => {
      mockGetServerSession.mockResolvedValue(null)
      const result = await getAccessToken()
      expect(result).toBeNull()
    })
  })

  describe('getIdToken', () => {
    it('returns id_token when session exists', async () => {
      mockGetServerSession.mockResolvedValue({
        access_token: 'test-access-token',
        id_token: 'test-id-token',
      })
      const result = await getIdToken()
      expect(result).toBe('test-id-token')
    })

    it('returns null when no session', async () => {
      mockGetServerSession.mockResolvedValue(null)
      const result = await getIdToken()
      expect(result).toBeNull()
    })
  })
})
