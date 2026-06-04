import type { StockQuote } from '@/types/stock'

function fmt(n: number) {
  if (!n) return 'N/A'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n)
}
function fmtVol(n: number) {
  if (!n) return 'N/A'
  if (n >= 1e9) return `${(n/1e9).toFixed(1)}B`
  if (n >= 1e6) return `${(n/1e6).toFixed(1)}M`
  if (n >= 1e3) return `${(n/1e3).toFixed(1)}K`
  return String(n)
}
function fmtCap(n: number) {
  if (!n) return 'N/A'
  if (n >= 1e12) return `$${(n/1e12).toFixed(2)}T`
  if (n >= 1e9) return `$${(n/1e9).toFixed(2)}B`
  if (n >= 1e6) return `$${(n/1e6).toFixed(2)}M`
  return `$${n}`
}

const DEFS: Record<string, string> = {
  'Open': 'The price at which this stock first traded when the market opened today.',
  'Prev Close': 'Final price from the previous session. Today\'s % change is measured from this.',
  'Volume': 'Shares traded today. High volume often signals stronger conviction in a price move.',
  'Market Cap': 'Price × total shares outstanding. Measures company size. Large cap = over $10B.',
  'P/E Ratio': 'How much investors pay for $1 of earnings. High P/E = growth expectations; Low P/E = possible undervaluation.',
  '52W High': 'Highest price in the past 52 weeks. Proximity here often signals strong momentum.',
  '52W Low': 'Lowest price in the past 52 weeks. A stock near its low may be undervalued — or struggling.',
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1.5px solid var(--color-border)',
      borderRadius: 12, padding: '14px 16px',
      position: 'relative', transition: 'all 0.15s',
      cursor: 'default',
    }}
      className="stat-card"
      title={DEFS[label]}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-subtle)', margin: 0 }}>{label}</p>
        {DEFS[label] && (
          <div style={{
            width: 16, height: 16, borderRadius: '50%',
            border: '1.5px solid var(--color-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 9, fontWeight: 900, color: 'var(--color-text-subtle)',
          }}>i</div>
        )}
      </div>
      <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 16, color: 'var(--color-text)', margin: 0 }}>{value}</p>
    </div>
  )
}

export function StockStats({ quote }: { quote: StockQuote }) {
  const stats = [
    { label: 'Open', value: fmt(quote.open) },
    { label: 'Prev Close', value: fmt(quote.previousClose) },
    { label: 'Volume', value: fmtVol(quote.volume) },
    { label: 'Market Cap', value: fmtCap(quote.marketCap) },
    { label: 'P/E Ratio', value: quote.peRatio?.toFixed(2) ?? 'N/A' },
    { label: '52W High', value: fmt(quote.weekHigh52) },
    { label: '52W Low', value: fmt(quote.weekLow52) },
  ]

  return (
    <div style={{
      background: 'var(--color-surface-2)',
      border: '1.5px solid var(--color-border)',
      borderRadius: 16, padding: '20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <h2 style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-subtle)', margin: 0 }}>
          Key Statistics
        </h2>
        <span style={{ fontSize: 11, color: 'var(--color-text-subtle)' }}>· hover for definitions</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px,1fr))', gap: 10 }}>
        {stats.map(s => <StatCard key={s.label} label={s.label} value={s.value} />)}
      </div>
      <style>{`.stat-card:hover { border-color: #bfdbfe !important; box-shadow: 0 2px 8px rgba(37,99,235,0.08); }`}</style>
    </div>
  )
}