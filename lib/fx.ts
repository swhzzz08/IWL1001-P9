export const SUPPORTED_CURRENCIES = ['USD', 'SGD', 'EUR'] as const

export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number]

const FX_BASE_URL = 'https://open.er-api.com/v6/latest'

export function isSupportedCurrency(currency: string): currency is SupportedCurrency {
  return (SUPPORTED_CURRENCIES as readonly string[]).includes(currency)
}

export async function fetchExchangeRate(from: SupportedCurrency, to: SupportedCurrency): Promise<{ rate: number; updatedAt: string; provider: string }> {
  if (from === to) {
    return { rate: 1, updatedAt: new Date().toISOString(), provider: 'static' }
  }

  const response = await fetch(`${FX_BASE_URL}/${from}`)
  if (!response.ok) {
    throw new Error(`FX request failed: ${response.status}`)
  }

  const payload = await response.json() as {
    result?: string
    provider?: string
    time_last_update_utc?: string
    rates?: Record<string, number>
    error_type?: string
    'error-type'?: string
  }

  if (payload.result && payload.result !== 'success') {
    throw new Error(payload.error_type ?? payload['error-type'] ?? 'FX provider returned an error')
  }

  const rate = payload.rates?.[to]
  if (typeof rate !== 'number') {
    throw new Error(`No exchange rate available for ${from} to ${to}`)
  }

  return {
    rate,
    updatedAt: payload.time_last_update_utc ?? new Date().toISOString(),
    provider: payload.provider ?? 'open.er-api.com',
  }
}

export function convertCurrency(amount: number, rate: number): number {
  return amount * rate
}