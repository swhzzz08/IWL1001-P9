import { Suspense } from 'react'
import { MarketOverview } from '@/components/dashboard/MarketOverview'
import { TrendingStocks } from '@/components/dashboard/TrendingStocks'
import Link from 'next/link'
import { BookOpen, TrendingUp, BarChart2, Shield, ArrowRight, Sparkles } from 'lucide-react'

const FEATURES = [
  { icon: BarChart2, title: 'Live Charts', desc: 'Candlestick charts with real data and multiple timeframes.', accent: '#0f766e', bg: '#f0fdfa' },
  { icon: BookOpen, title: 'Learn Finance', desc: 'Plain-language guides on stocks, ETFs and technical analysis.', accent: '#7c3aed', bg: '#f5f3ff' },
  { icon: Shield, title: 'Invest Responsibly', desc: 'Understand risk before you invest. Education first, always.', accent: '#ea580c', bg: '#fff7ed' },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Search a stock', desc: 'Type any ticker like AAPL or TSLA into the search bar.' },
  { step: '02', title: 'Read the chart', desc: 'See live price history with candlestick candles and SMA lines.' },
  { step: '03', title: 'Understand the data', desc: 'Hover key stats for plain-language definitions. Check RSI momentum.' },
  { step: '04', title: 'Read the news', desc: 'See sentiment analysis of recent headlines for that stock.' },
]

export default function HomePage() {
  return (
    <div>
      {/* ── HERO ── */}
      <section style={{ position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
        <div className="hero-grid" style={{ position: 'absolute', inset: 0, opacity: 0.7, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: -100, left: -80, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, #0f766e12 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 24px 80px', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#f0fdfa', border: '1px solid #99f6e4', borderRadius: 999, padding: '6px 14px', fontSize: 12, fontWeight: 700, color: '#0f766e', marginBottom: 28 }}>
            <Sparkles size={12} /> Free educational platform · Not financial advice
          </div>

          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(36px, 4.5vw, 58px)', lineHeight: 1.08, letterSpacing: '-0.03em', color: 'var(--color-text)', margin: '0 0 20px', maxWidth: 680 }}>
            Learn to invest.<br />
            <span style={{ color: '#0f766e' }}>Track the market.</span>
          </h1>

          <p style={{ fontSize: 17, color: 'var(--color-text-muted)', lineHeight: 1.7, margin: '0 0 36px', maxWidth: 500, fontFamily: 'var(--font-sans)' }}>
            Live market data, interactive candlestick charts, and structured financial education — built for total beginners.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 56 }}>
            <Link href="/learn" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#0f766e,#0d9488)', color: 'white', padding: '13px 24px', borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: 'none', boxShadow: '0 8px 24px #0f766e30' }}>
              <BookOpen size={16} /> Start Learning <ArrowRight size={14} />
            </Link>
            <Link href="/stocks" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', color: 'var(--color-text)', padding: '13px 24px', borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
              <TrendingUp size={16} /> View Charts
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 14, maxWidth: 800 }}>
            {FEATURES.map(({ icon: Icon, title, desc, accent, bg }) => (
              <div key={title} style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 14, padding: '18px', display: 'flex', gap: 14, alignItems: 'flex-start', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} color={accent} />
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-text)', margin: '0 0 4px', fontFamily: 'var(--font-heading)' }}>{title}</p>
                  <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.6 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ background: '#fafaf9', borderBottom: '1px solid var(--color-border)', padding: '56px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 800, color: 'var(--color-text)', margin: '0 0 8px' }}>How it works</h2>
            <p style={{ fontSize: 15, color: 'var(--color-text-muted)', margin: 0 }}>Get started in 4 simple steps</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 32 }}>
            {HOW_IT_WORKS.map(({ step, title, desc }) => (
              <div key={step} style={{ position: 'relative', paddingLeft: 20, borderLeft: '3px solid #99f6e4' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#0f766e', letterSpacing: '0.12em', marginBottom: 8 }}>STEP {step}</div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700, color: 'var(--color-text)', margin: '0 0 6px' }}>{title}</h3>
                <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARKET DATA ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 24px' }}>
        <Suspense fallback={<MarketSkeleton />}><MarketOverview /></Suspense>
        <div style={{ marginTop: 48 }}>
          <Suspense fallback={<TrendingSkeleton />}><TrendingStocks /></Suspense>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 72px' }}>
        <div style={{ background: 'linear-gradient(135deg,#134e4a 0%,#0f766e 60%,#0d9488 100%)', borderRadius: 20, padding: '48px', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 60px #0f766e25' }}>
          <div className="hero-grid" style={{ position: 'absolute', inset: 0, opacity: 0.15 }} />
          <div style={{ position: 'absolute', right: -30, top: -30, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 28, color: 'white', margin: '0 0 10px' }}>New to investing?</h2>
              <p style={{ color: '#99f6e4', fontSize: 15, margin: 0, maxWidth: 420, lineHeight: 1.65 }}>
                Start with our beginner guides — learn to read charts, understand P/E ratios, and build smart investing habits.
              </p>
            </div>
            <Link href="/learn" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'white', color: '#0f766e', padding: '13px 24px', borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', flexShrink: 0 }}>
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