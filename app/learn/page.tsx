import type { Metadata } from 'next'
import { CategoryGrid } from '@/components/learn/CategoryGrid'
import { ResourceList } from '@/components/learn/ResourceList'
import { categories } from '@/data/education'
import { GraduationCap, BookOpen, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Learn — MarketWise',
  description: 'Financial education for beginners.',
}

const STATS = [
  { value: '8', label: 'Topics' },
  { value: '7+', label: 'Articles' },
  { value: '100%', label: 'Free' },
]

const LEARNING_PATHS = [
  { emoji: '🌱', title: 'Complete Beginner', desc: 'Start with What Is a Stock, then ETFs, then Risk Management.', color: '#f0fdf4', border: '#86efac' },
  { emoji: '📈', title: 'Chart Reader', desc: 'Go straight to Technical Analysis — candlesticks, RSI, moving averages.', color: '#f0fdfa', border: '#99f6e4' },
  { emoji: '🏦', title: 'Value Investor', desc: 'Study Fundamentals first — P/E ratios, earnings, balance sheets.', color: '#fdf4ff', border: '#d8b4fe' },
]

export default function LearnPage() {
  return (
    <div>
      {/* ── HERO ── */}
      <section style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #134e4a 0%, #0f766e 55%, #0d9488 100%)', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none', backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(99,255,220,0.1)', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 24px 72px', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 999, padding: '6px 14px', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: 24 }}>
            <Sparkles size={12} /> Free financial education for everyone
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <GraduationCap size={28} color="white" />
            </div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(30px, 5vw, 50px)', color: 'white', margin: 0, lineHeight: 1.1 }}>
                Financial Education Hub
              </h1>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', margin: '12px 0 0', maxWidth: 560, lineHeight: 1.7 }}>
                Everything you need to understand about markets — from what a stock is to reading financial statements and managing risk.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 32, marginTop: 36, flexWrap: 'wrap' }}>
            {STATS.map(({ value, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: 32, fontWeight: 800, color: 'white' }}>{value}</span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 80px', display: 'flex', flexDirection: 'column', gap: 56 }}>

        {/* ── LEARNING PATHS ── */}
        <section>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 800, color: 'var(--color-text)', margin: '0 0 6px' }}>Where should I start?</h2>
            <p style={{ fontSize: 14, color: 'var(--color-text-muted)', margin: 0 }}>Choose a learning path based on your goal</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            {LEARNING_PATHS.map(({ emoji, title, desc, color, border }) => (
              <div key={title} style={{ background: color, border: `1.5px solid ${border}`, borderRadius: 16, padding: '20px' }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{emoji}</div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 700, color: 'var(--color-text)', margin: '0 0 6px' }}>{title}</h3>
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── BROWSE BY TOPIC ── */}
        <section>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 800, color: 'var(--color-text)', margin: '0 0 6px' }}>Browse by Topic</h2>
            <p style={{ fontSize: 14, color: 'var(--color-text-muted)', margin: 0 }}>Pick a subject to explore</p>
          </div>
          <CategoryGrid categories={categories} />
        </section>

        {/* ── ALL ARTICLES ── */}
        <section>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 800, color: 'var(--color-text)', margin: '0 0 6px' }}>All Articles</h2>
            <p style={{ fontSize: 14, color: 'var(--color-text-muted)', margin: 0 }}>Search and filter by topic or difficulty</p>
          </div>
          <ResourceList />
        </section>

        {/* ── CTA ── */}
        <section style={{ background: '#f0fdfa', border: '1.5px solid #99f6e4', borderRadius: 20, padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#ccfbf1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <BookOpen size={20} color="#0f766e" />
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 17, color: 'var(--color-text)', margin: '0 0 4px' }}>
                  Ready to apply what you've learned?
                </h3>
                <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: 0 }}>
                  Open a real stock chart and practise reading candlesticks, SMA lines and RSI.
                </p>
              </div>
            </div>
            <Link href="/stocks/AAPL" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', borderRadius: 12, fontSize: 13, fontWeight: 700, background: '#0f766e', color: 'white', textDecoration: 'none', flexShrink: 0 }}>
              Open AAPL chart <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}