import { convertCurrency, fetchExchangeRate } from '@/lib/fx'

describe('convertCurrency', () => {
  it('multiplies by the exchange rate', () => {
    expect(convertCurrency(100, 1.36)).toBe(136)
  })
})

describe('fetchExchangeRate', () => {
  const originalFetch = global.fetch

  afterEach(() => {
    global.fetch = originalFetch
    jest.restoreAllMocks()
  })

  it('returns 1 for identical currencies without calling fetch', async () => {
    const fetchSpy = jest.fn()
    global.fetch = fetchSpy as typeof fetch

    const result = await fetchExchangeRate('USD', 'USD')

    expect(result.rate).toBe(1)
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('reads the live rate from the provider response', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        result: 'success',
        provider: 'open.er-api.com',
        time_last_update_utc: 'Tue, 01 Jul 2026 00:00:00 +0000',
        rates: { SGD: 1.34 },
      }),
    }) as typeof fetch

    await expect(fetchExchangeRate('USD', 'SGD')).resolves.toMatchObject({
      rate: 1.34,
      provider: 'open.er-api.com',
    })
  })

  it('throws when the target rate is missing', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ result: 'success', rates: { EUR: 0.92 } }),
    }) as typeof fetch

    await expect(fetchExchangeRate('USD', 'SGD')).rejects.toThrow('No exchange rate available')
  })
})