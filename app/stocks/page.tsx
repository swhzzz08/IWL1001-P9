import { TrendingStocks } from '@/components/dashboard/TrendingStocks'
import { BarChart3, ChevronRight, Search } from 'lucide-react'

export default function StocksBrowsePage() {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 64px' }}>
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-2) 55%, var(--color-background) 100%)',
        border: '1px solid var(--color-border)',
        borderRadius: 20,
        padding: '32px 28px',
        boxShadow: '0 10px 30px rgba(37, 99, 235, 0.08)',
        marginBottom: 28,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ maxWidth: 640 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#dbeafe', color: '#1d4ed8', borderRadius: 999, padding: '6px 12px', fontSize: 12, fontWeight: 700, marginBottom: 14 }}>
              <Search size={12} /> Browse stocks first
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(32px, 5vw, 54px)', lineHeight: 1.05, margin: 0, color: 'var(--color-text)' }}>
              Pick a stock, then open its chart.
            </h1>
            <p style={{ marginTop: 14, marginBottom: 0, fontSize: 16, lineHeight: 1.7, color: 'var(--color-text-muted)' }}>
              Use this page to scan the most active symbols in the app. Click any stock to open the chart view with price history, stats, and the hint panel.
            </p>
          </div>

          <div style={{ display: 'grid', gap: 10, minWidth: 220 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 14, padding: '12px 14px' }}>
              <BarChart3 size={18} color="#2563eb" />
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--color-text)' }}>Step 1</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Browse the list below</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 14, padding: '12px 14px' }}>
              <ChevronRight size={18} color="#2563eb" />
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--color-text)' }}>Step 2</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Click any stock to chart it</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TrendingStocks />
    </div>
  )
}