import { Suspense } from 'react'
import { MarketOverview } from '@/components/dashboard/MarketOverview'
import { TrendingStocks } from '@/components/dashboard/TrendingStocks'
import Link from 'next/link'
import { BookOpen, TrendingUp, BarChart2, Shield, ArrowRight, Sparkles } from 'lucide-react'

const FEATURES = [
  { icon: BarChart2, title: 'Live Charts', desc: 'Candlestick charts with real data and multiple timeframes.', accent: '#2563eb', bg: '#eff6ff' },
  { icon: BookOpen, title: 'Learn Finance', desc: 'Plain-language guides on stocks, ETFs and technical analysis.', accent: '#059669', bg: '#ecfdf5' },
  { icon: Shield, title: 'Invest Responsibly', desc: 'Understand risk before you invest. Education first, always.', accent: '#7c3aed', bg: '#f5f3ff' },
]

export default function HomePage() {
  return (
    <div>
      {/* ── HERO ── */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
      }}>
        {/* Grid background */}
        <div className="hero-grid" style={{ position: 'absolute', inset: 0, opacity: 0.6, pointerEvents: 'none' }} />
        {/* Blue glow */}
        <div style={{
          position: 'absolute', top: -120, left: -80,
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, #2563eb18 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px 96px' }}>
          {/* Badge */}
          <div className="fade-up" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#eff6ff', border: '1px solid #bfdbfe',
            borderRadius: 999, padding: '6px 14px',
            fontSize: 12, fontWeight: 700, color: '#1d4ed8', marginBottom: 28,
          }}>
            <Sparkles size={12} />
            Free educational platform · Not financial advice
          </div>

          {/* Headline */}
          <h1 className="fade-up-1" style={{
            fontFamily: 'var(--font-heading)', fontWeight: 800,
            fontSize: 'clamp(42px, 6vw, 72px)',
            lineHeight: 1.05, letterSpacing: '-0.03em',
            color: 'var(--color-text)', margin: 0, maxWidth: 700,
          }}>
            Learn to invest.<br />
            <span style={{ color: '#2563eb' }}>Track the market.</span>
          </h1>

          <p className="fade-up-2" style={{
            fontSize: 18, color: 'var(--color-text-muted)',
            lineHeight: 1.7, marginTop: 20, maxWidth: 520,
          }}>
            Live market data, interactive candlestick charts, and structured financial education — all in one free platform for beginners.
          </p>

          {/* CTA buttons */}
          <div className="fade-up-3" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 36 }}>
            <Link href="/learn" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'linear-gradient(135deg,#2563eb,#4f46e5)',
              color: 'white', padding: '13px 24px', borderRadius: 12,
              fontSize: 14, fontWeight: 700, textDecoration: 'none',
              boxShadow: '0 8px 24px #2563eb35',
              transition: 'all 0.2s',
            }}>
              <BookOpen size={16} /> Start Learning <ArrowRight size={14} />
            </Link>
            <Link href="/stocks/AAPL" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'var(--color-surface)',
              border: '1.5px solid var(--color-border)',
              color: 'var(--color-text)', padding: '13px 24px', borderRadius: 12,
              fontSize: 14, fontWeight: 700, textDecoration: 'none',
              transition: 'all 0.2s',
            }}>
              <TrendingUp size={16} /> View Charts
            </Link>
          </div>

          {/* Feature cards */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16, marginTop: 56, maxWidth: 760,
          }}>
            {FEATURES.map(({ icon: Icon, title, desc, accent, bg }, i) => (
              <div key={title} className={`fade-up-${i + 1}`} style={{
                background: 'var(--color-surface)',
                border: '1.5px solid var(--color-border)',
                borderRadius: 16, padding: '20px',
                display: 'flex', gap: 14, alignItems: 'flex-start',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, background: bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={18} color={accent} />
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-text)', margin: 0 }}>{title}</p>
                  <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4, lineHeight: 1.6 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARKET DATA ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 24px' }}>
        <Suspense fallback={<MarketSkeleton />}>
          <MarketOverview />
        </Suspense>
        <div style={{ marginTop: 48 }}>
          <Suspense fallback={<TrendingSkeleton />}>
            <TrendingStocks />
          </Suspense>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 64px' }}>
        <div style={{
          background: 'linear-gradient(135deg,#1e40af 0%,#4f46e5 100%)',
          borderRadius: 20, padding: '48px', position: 'relative', overflow: 'hidden',
          boxShadow: '0 20px 60px #2563eb30',
        }}>
          <div className="hero-grid" style={{ position: 'absolute', inset: 0, opacity: 0.15 }} />
          <div style={{ position: 'absolute', right: -30, top: -30, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 28, color: 'white', margin: 0 }}>
                New to investing?
              </h2>
              <p style={{ color: '#bfdbfe', fontSize: 15, marginTop: 8, maxWidth: 400, lineHeight: 1.6 }}>
                Start with our beginner guides — learn to read charts, understand P/E ratios, and build smart investing habits.
              </p>
            </div>
            <Link href="/learn" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'white', color: '#2563eb',
              padding: '13px 24px', borderRadius: 12,
              fontSize: 14, fontWeight: 700, textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              flexShrink: 0,
            }}>
              Browse lessons <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function MarketSkeleton() {
  return (
    <div>
      <div className="skeleton" style={{ height: 16, width: 160, marginBottom: 20 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ border: '1px solid var(--color-border)', borderRadius: 16, padding: 24 }}>
            <div className="skeleton" style={{ height: 12, width: 80, marginBottom: 16 }} />
            <div className="skeleton" style={{ height: 32, width: 140, marginBottom: 10 }} />
            <div className="skeleton" style={{ height: 24, width: 100, borderRadius: 999 }} />
          </div>
        ))}
      </div>
    </div>
  )
}

function TrendingSkeleton() {
  return (
    <div>
      <div className="skeleton" style={{ height: 16, width: 160, marginBottom: 20 }} />
      <div style={{ border: '1px solid var(--color-border)', borderRadius: 16, overflow: 'hidden' }}>
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div className="skeleton" style={{ width: 40, height: 40, borderRadius: 10 }} />
              <div>
                <div className="skeleton" style={{ height: 14, width: 60, marginBottom: 6 }} />
                <div className="skeleton" style={{ height: 11, width: 100 }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <div className="skeleton" style={{ height: 14, width: 70 }} />
              <div className="skeleton" style={{ height: 28, width: 72, borderRadius: 999 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}