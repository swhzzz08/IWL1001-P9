'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowRightLeft, RefreshCw, Sparkles, WalletCards } from 'lucide-react'
import { SUPPORTED_CURRENCIES, type SupportedCurrency, convertCurrency } from '@/lib/fx'
import { formatCurrency } from '@/lib/formatters'
import Link from 'next/link'

type ExchangeResponse = {
  from: SupportedCurrency
  to: SupportedCurrency
  rate: number
  updatedAt: string
  provider: string
  message?: string
  convertedAmount?: number
  error?: string
}

const currencyLabels: Record<SupportedCurrency, string> = {
  USD: 'US Dollar',
  SGD: 'Singapore Dollar',
  EUR: 'Euro',
}

export default function ExchangePage() {
  const [amount, setAmount] = useState('100')
  const [fromCurrency, setFromCurrency] = useState<SupportedCurrency>('USD')
  const [toCurrency, setToCurrency] = useState<SupportedCurrency>('SGD')
  const [rateInfo, setRateInfo] = useState<ExchangeResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [balances, setBalances] = useState<Record<SupportedCurrency, number> | null>(null)
  const [unauthorized, setUnauthorized] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const amountValue = useMemo(() => {
    const parsed = Number(amount)
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0
  }, [amount])

  const convertedAmount = useMemo(() => {
    if (!rateInfo) return 0
    return convertCurrency(amountValue, rateInfo.rate)
  }, [amountValue, rateInfo])

  useEffect(() => {
    let cancelled = false

    async function loadRate() {
      setLoading(true)
      setError('')
      try {
        const response = await fetch(`/api/exchange?from=${fromCurrency}&to=${toCurrency}`)
        const data = await response.json() as ExchangeResponse
        if (!response.ok) {
          throw new Error(data.error ?? 'Unable to load exchange rate')
        }
        if (!cancelled) {
          setRateInfo(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unable to load exchange rate')
          setRateInfo(null)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadRate()

    return () => {
      cancelled = true
    }
  }, [fromCurrency, toCurrency])

  async function loadBalances() {
    const response = await fetch('/api/portfolio', { cache: 'no-store' })
    if (response.status === 401) {
      setUnauthorized(true)
      setBalances(null)
      return
    }
    const data = await response.json() as {
      balances?: Record<SupportedCurrency, number>
      error?: string
    }
    if (!response.ok || !data.balances) {
      throw new Error(data.error ?? 'Unable to load wallet balances')
    }
    setUnauthorized(false)
    setBalances(data.balances)
  }

  useEffect(() => {
    void loadBalances().catch(err => {
      setError(err instanceof Error ? err.message : 'Unable to load wallet balances')
    })
  }, [])

  function swapCurrencies() {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  async function exchangeFunds(event: React.FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setMessage('')
    setError('')
    try {
      const response = await fetch('/api/exchange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: fromCurrency,
          to: toCurrency,
          amount: amountValue,
        }),
      })
      const data = await response.json() as ExchangeResponse
      if (!response.ok) throw new Error(data.error ?? 'Unable to exchange currency')
      setMessage(data.message ?? 'Currency exchanged successfully')
      await loadBalances()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to exchange currency')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ maxWidth: 1120, margin: '0 auto', padding: '32px 24px 64px' }}>
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 24,
        border: '1px solid var(--color-border)',
        background: 'linear-gradient(135deg, #0f172a 0%, #134e4a 45%, #0f766e 100%)',
        color: 'white',
        padding: '36px 32px',
        marginBottom: 24,
        boxShadow: '0 24px 60px rgba(15, 118, 110, 0.2)',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at top right, rgba(255,255,255,0.18), transparent 28%), radial-gradient(circle at bottom left, rgba(255,255,255,0.1), transparent 26%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', display: 'grid', gap: 14 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, width: 'fit-content', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.16)', borderRadius: 999, padding: '6px 12px', fontSize: 12, fontWeight: 700 }}>
            <Sparkles size={12} /> Live FX rates
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(32px, 5vw, 54px)', lineHeight: 1.05, margin: 0 }}>
            Convert between USD, SGD and EUR
          </h1>
          <p style={{ maxWidth: 720, margin: 0, fontSize: 16, lineHeight: 1.7, color: 'rgba(255,255,255,0.86)' }}>
            Move funds between your USD, SGD and EUR wallet balances using live exchange rates.
          </p>
        </div>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        <form onSubmit={exchangeFunds} style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 22, padding: 24, boxShadow: '0 10px 30px rgba(15,23,42,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowRightLeft size={18} color="#2563eb" />
            </div>
            <div>
              <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 22, color: 'var(--color-text)' }}>Currency Exchange</h2>
              <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--color-text-muted)' }}>Convert money held in your wallet.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 14 }}>
            <label style={{ display: 'grid', gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-subtle)' }}>Amount</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                style={{ height: 46, borderRadius: 12, border: '1.5px solid var(--color-border)', background: 'var(--color-surface-2)', padding: '0 14px', fontSize: 15, color: 'var(--color-text)', outline: 'none' }}
              />
            </label>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'end' }}>
              <label style={{ display: 'grid', gap: 8, flex: '1 1 220px', minWidth: 0 }}>
                <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-subtle)' }}>From</span>
                <select
                  value={fromCurrency}
                  onChange={e => setFromCurrency(e.target.value as SupportedCurrency)}
                  style={{ height: 46, borderRadius: 12, border: '1.5px solid var(--color-border)', background: 'var(--color-surface-2)', padding: '0 14px', fontSize: 15, color: 'var(--color-text)', outline: 'none' }}
                >
                  {SUPPORTED_CURRENCIES.map(currency => (
                    <option key={currency} value={currency}>{currency} - {currencyLabels[currency]}</option>
                  ))}
                </select>
              </label>

              <button
                type="button"
                onClick={swapCurrencies}
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 14,
                  border: '1.5px solid var(--color-border)',
                  background: 'var(--color-surface-2)',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label="Swap currencies"
              >
                <RefreshCw size={16} />
              </button>

              <label style={{ display: 'grid', gap: 8, flex: '1 1 220px', minWidth: 0 }}>
                <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-subtle)' }}>To</span>
                <select
                  value={toCurrency}
                  onChange={e => setToCurrency(e.target.value as SupportedCurrency)}
                  style={{ height: 46, borderRadius: 12, border: '1.5px solid var(--color-border)', background: 'var(--color-surface-2)', padding: '0 14px', fontSize: 15, color: 'var(--color-text)', outline: 'none' }}
                >
                  {SUPPORTED_CURRENCIES.map(currency => (
                    <option key={currency} value={currency}>{currency} - {currencyLabels[currency]}</option>
                  ))}
                </select>
              </label>
            </div>

            <div style={{ display: 'grid', gap: 12, marginTop: 8 }}>
              <div style={{ borderRadius: 18, padding: 20, background: 'linear-gradient(135deg, #f8fafc 0%, #ecfeff 100%)', border: '1px solid #cbd5e1' }}>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#475569', marginBottom: 8 }}>Converted amount</div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 800, color: '#0f172a', lineHeight: 1.05 }}>
                  {loading ? 'Loading…' : rateInfo ? formatCurrency(convertedAmount, toCurrency) : '—'}
                </div>
                <div style={{ marginTop: 8, fontSize: 13, color: '#475569' }}>
                  {loading ? 'Fetching live rate…' : rateInfo ? `1 ${fromCurrency} = ${rateInfo.rate.toFixed(6)} ${toCurrency}` : error || 'Choose a pair to see the live rate.'}
                </div>
              </div>
              {unauthorized ? (
                <div style={{ padding: 12, borderRadius: 10, background: '#fffbeb', color: '#92400e', fontSize: 13 }}>
                  <Link href="/auth/login" style={{ color: '#0f766e', fontWeight: 800 }}>Sign in</Link> to exchange wallet funds.
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={submitting || loading || !rateInfo || amountValue <= 0 || fromCurrency === toCurrency}
                  style={{
                    height: 46,
                    border: 'none',
                    borderRadius: 12,
                    background: '#0f766e',
                    color: 'white',
                    fontWeight: 800,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting || loading || !rateInfo || amountValue <= 0 || fromCurrency === toCurrency ? 0.6 : 1,
                  }}
                >
                  {submitting ? 'Exchanging…' : `Exchange ${fromCurrency} to ${toCurrency}`}
                </button>
              )}
              {message && <div role="status" style={{ padding: 11, borderRadius: 10, background: '#f0fdf4', color: '#15803d', fontSize: 13 }}>{message}</div>}
              {error && <div role="alert" style={{ padding: 11, borderRadius: 10, background: '#fef2f2', color: '#b91c1c', fontSize: 13 }}>{error}</div>}
            </div>
          </div>
        </form>

        <aside style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 22, padding: 24, display: 'grid', gap: 16 }}>
          <div>
            <h3 style={{ margin: '0 0 8px', fontFamily: 'var(--font-heading)', fontSize: 18, color: 'var(--color-text)' }}>Rate details</h3>
            <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 13 }}>Stocks are purchased and sold in USD. Convert SGD or EUR to USD before buying.</p>
          </div>

          <div style={{ display: 'grid', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, fontWeight: 800, color: 'var(--color-text-muted)' }}>
              <WalletCards size={14} /> YOUR WALLET
            </div>
            {SUPPORTED_CURRENCIES.map(currency => (
              <InfoRow
                key={currency}
                label={`${currency} balance`}
                value={balances ? formatCurrency(balances[currency], currency) : '—'}
              />
            ))}
          </div>

          <div style={{ display: 'grid', gap: 12 }}>
            <InfoRow label="From currency" value={`${fromCurrency} - ${currencyLabels[fromCurrency]}`} />
            <InfoRow label="To currency" value={`${toCurrency} - ${currencyLabels[toCurrency]}`} />
            <InfoRow label="Provider" value={rateInfo?.provider ?? '—'} />
            <InfoRow label="Updated" value={rateInfo ? new Date(rateInfo.updatedAt).toLocaleString() : '—'} />
            <InfoRow label="Input amount" value={formatCurrency(amountValue, fromCurrency)} />
          </div>

          
        </aside>
      </section>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'grid', gap: 4, padding: '12px 14px', borderRadius: 14, background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-subtle)' }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>{value}</div>
    </div>
  )
}
