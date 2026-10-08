/**
 * @jest-environment node
 */
import { AppConfigProvider } from '@/lib/feature-flags/providers/appconfig-provider'

const mockFetch = jest.fn()
global.fetch = mockFetch

describe('AppConfigProvider', () => {
  const baseOptions = {
    applicationId: 'my-app',
    environmentId: 'production',
    configurationProfileId: 'feature-flags',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('constructs the correct URL with default endpoint', () => {
    const provider = new AppConfigProvider(baseOptions)
    // Access internal url via fetchFlags (mocked fetch)
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    })
    provider.fetchFlags()
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:2772/applications/my-app/environments/production/configurations/feature-flags',
      expect.objectContaining({ headers: { Accept: 'application/json' } }),
    )
  })

  it('constructs URL with custom endpoint', () => {
    const provider = new AppConfigProvider({
      ...baseOptions,
      endpoint: 'http://custom-host:9999',
    })
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    })
    provider.fetchFlags()
    expect(mockFetch).toHaveBeenCalledWith(
      'http://custom-host:9999/applications/my-app/environments/production/configurations/feature-flags',
      expect.any(Object),
    )
  })

  it('returns parsed flags on successful response', async () => {
    const flags = {
      new_checkout_v2: { enabled: true },
      dark_mode: { enabled: false, variant: 'system' },
    }
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => flags,
    })
    const provider = new AppConfigProvider(baseOptions)
    const result = await provider.fetchFlags()
    expect(result).toEqual(flags)
  })

  it('throws an error when response is not ok', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 503,
    })
    const provider = new AppConfigProvider(baseOptions)
    await expect(provider.fetchFlags()).rejects.toThrow('503')
  })

  it('uses custom timeout', async () => {
    // Create provider with very short timeout — just verify no error thrown
    const provider = new AppConfigProvider({ ...baseOptions, timeoutMs: 100 })
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    })
    const result = await provider.fetchFlags()
    expect(result).toEqual({})
  })

  it('propagates abort/timeout errors', async () => {
    const abortError = new DOMException('aborted', 'AbortError')
    mockFetch.mockRejectedValueOnce(abortError)
    const provider = new AppConfigProvider({ ...baseOptions, timeoutMs: 5000 })
    await expect(provider.fetchFlags()).rejects.toThrow('aborted')
  })
})
