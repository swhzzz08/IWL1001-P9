import Link from 'next/link'
import { TrendingUp, AlertTriangle } from 'lucide-react'

export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-surface)', marginTop: 'auto' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 40, marginBottom: 40 }}>
          {/* Brand */}
          <div style={{ maxWidth: 280 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#2563eb,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={14} color="white" />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 15, color: 'var(--color-text)' }}>MarketWise</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.7, margin: 0 }}>
              A free educational platform for learning about financial markets and investing. Built for beginners.
            </p>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', gap: 48 }}>
            {[
              { title: 'Platform', links: [{ href: '/', label: 'Markets' }, { href: '/learn', label: 'Learn' }, { href: '/stocks/AAPL', label: 'Charts' }] },
              { title: 'Learn', links: [{ href: '/learn', label: 'Stocks' }, { href: '/learn', label: 'ETFs' }, { href: '/learn', label: 'Technical Analysis' }] },
            ].map(col => (
              <div key={col.title}>
                <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text)', marginBottom: 14, letterSpacing: '0.04em' }}>{col.title}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {col.links.map(l => (
                    <Link key={l.label} href={l.href} style={{ fontSize: 13, color: 'var(--color-text-muted)', textDecoration: 'none' }}>{l.label}</Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '10px 14px', maxWidth: 520 }}>
            <AlertTriangle size={14} color="#d97706" style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 12, color: '#92400e', lineHeight: 1.6 }}>
              <strong>Educational purposes only.</strong> Not financial advice. Data may be delayed. Always do your own research before investing.
            </span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--color-text-subtle)', alignSelf: 'center' }}>© 2025 MarketWise</p>
        </div>
      </div>
    </footer>
  )
}