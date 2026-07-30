'use client'

import type { Metadata } from 'next'
import { CategoryGrid } from '@/components/learn/CategoryGrid'
import { ResourceList } from '@/components/learn/ResourceList'
import { articles, categories } from '@/data/education'
import { tutorials } from '@/data/tutorials'
import { useAllTutorialProgress } from '@/hooks/useTutorialProgress'
import { GraduationCap, BookOpen, ArrowRight, Sparkles, Sprout, TrendingUp, Landmark, ListChecks, Clock, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

const DIFFICULTY_COLORS: Record<string, { bg: string; color: string }> = {
  Beginner: { bg: '#f0fdf4', color: '#15803d' },
  Intermediate: { bg: '#fffbeb', color: '#d97706' },
  Advanced: { bg: '#fef2f2', color: '#b91c1c' },
}

const STATS = [
  { value: String(categories.length), label: 'Topics' },
  { value: `${articles.length}+`, label: 'Articles' },
  { value: '100%', label: 'Free' },
]

const LEARNING_PATHS = [
  {
    icon: Sprout,
    title: 'Complete Beginner',
    desc: 'Start with What Is a Stock, then ETFs, then Risk Management.',
    color: '#f0fdf4',
    border: '#86efac',
    iconColor: '#16a34a',
    href: '/learn/stocks',
    cta: 'Start here →'
  },
  {
    icon: TrendingUp,
    title: 'Chart Reader',
    desc: 'Go straight to Technical Analysis — candlesticks, RSI, moving averages.',
    color: '#f0fdfa',
    border: '#99f6e4',
    iconColor: '#0f766e',
    href: '/learn/technical-analysis',
    cta: 'Read charts →'
  },
  {
    icon: Landmark,
    title: 'Value Investor',
    desc: 'Study Fundamentals first — P/E ratios, earnings, balance sheets.',
    color: '#fdf4ff',
    border: '#d8b4fe',
    iconColor: '#9333ea',
    href: '/learn/fundamentals',
    cta: 'Study fundamentals →'
  },
]

export default function LearnPage() {
  const progress = useAllTutorialProgress(tutorials.map(t => t.slug))

  return (
    <div>
      {/* HERO */}
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

        {/* LEARNING PATHS */}
        <section>
            <div style={{ marginBottom: 20 }}>
    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 800, color: 'var(--color-text)', margin: '0 0 6px' }}>Where Should I Start?</h2>
    <p style={{ fontSize: 14, color: 'var(--color-text-muted)', margin: 0 }}>Choose a learning path based on your goal</p>
  </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
  {LEARNING_PATHS.map(({ icon: Icon, title, desc, color, border, iconColor, href, cta }) => (
    <Link key={title} href={href} style={{ textDecoration: 'none' }}>
      <div style={{
        background: color, border: `1.5px solid ${border}`,
        borderRadius: 16, padding: '20px', height: '100%',
        transition: 'all 0.2s', cursor: 'pointer',
      }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement
          el.style.transform = 'translateY(-2px)'
          el.style.boxShadow = `0 8px 24px ${border}60`
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement
          el.style.transform = 'none'
          el.style.boxShadow = 'none'
        }}
      >
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
          <Icon size={20} color={iconColor} />
        </div>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 700, color: 'var(--color-text)', margin: '0 0 6px' }}>{title}</h3>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: '0 0 14px', lineHeight: 1.65 }}>{desc}</p>
        <p style={{ fontSize: 12, fontWeight: 700, color: iconColor, margin: 0 }}>{cta}</p>
      </div>
    </Link>
  ))}
</div>  
        </section>

        {/* STEP-BY-STEP TUTORIALS */}
        <section id="tutorials">
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fefce8', color: '#a16207', borderRadius: 999, padding: '4px 10px', fontSize: 11, fontWeight: 700, marginBottom: 8 }}>
              <ListChecks size={11} /> Hands-on format
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 800, color: 'var(--color-text)', margin: '0 0 6px' }}>Step-by-Step Tutorials</h2>
            <p style={{ fontSize: 14, color: 'var(--color-text-muted)', margin: 0 }}>Click through guided lessons with quick checks and quizzes — a more interactive approach to learning.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            {tutorials.map(tutorial => {
              const diff = DIFFICULTY_COLORS[tutorial.difficulty] ?? DIFFICULTY_COLORS.Beginner
              const stepsDone = progress[tutorial.slug]?.completedStepIds.length ?? 0
              const totalSteps = tutorial.steps.length
              const pct = totalSteps > 0 ? Math.round((stepsDone / totalSteps) * 100) : 0
              const isComplete = pct === 100

              return (
                <Link key={tutorial.slug} href={`/learn/tutorials/${tutorial.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: 'var(--color-surface)', border: '1.5px solid var(--color-border)',
                    borderRadius: 16, padding: '18px', height: '100%',
                    display: 'flex', flexDirection: 'column', gap: 8, transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.borderColor = '#ca8a0460'
                      el.style.boxShadow = '0 8px 24px rgba(202,138,4,0.1)'
                      el.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.borderColor = 'var(--color-border)'
                      el.style.boxShadow = 'none'
                      el.style.transform = 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <span style={{ ...diff, borderRadius: 999, padding: '3px 10px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {tutorial.difficulty}
                      </span>
                      {isComplete && <CheckCircle2 size={16} color="#16a34a" />}
                    </div>

                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 700, color: 'var(--color-text)', margin: 0, lineHeight: 1.35 }}>
                      {tutorial.title}
                    </h3>
                    <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.6, flex: 1 }}>
                      {tutorial.description}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11, color: 'var(--color-text-subtle)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={11} /> {tutorial.estimatedMinutes} min</span>
                      <span>{tutorial.steps.length} steps</span>
                    </div>

                    <div>
                      <div style={{ height: 5, borderRadius: 999, background: 'var(--color-surface-2)', overflow: 'hidden', marginBottom: 4 }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: isComplete ? '#16a34a' : '#ca8a04', borderRadius: 999, transition: 'width 0.3s' }} />
                      </div>
                      <p style={{ fontSize: 10.5, color: 'var(--color-text-subtle)', margin: 0 }}>
                        {stepsDone}/{totalSteps} steps complete
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* BROWSE BY TOPIC */}
        <section>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 800, color: 'var(--color-text)', margin: '0 0 6px' }}>Browse by Topic</h2>
            <p style={{ fontSize: 14, color: 'var(--color-text-muted)', margin: 0 }}>Pick a subject to explore</p>
          </div>
          <CategoryGrid categories={categories} />
        </section>

        {/* ALL ARTICLES */}
        <section>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 800, color: 'var(--color-text)', margin: '0 0 6px' }}>All Articles</h2>
            <p style={{ fontSize: 14, color: 'var(--color-text-muted)', margin: 0 }}>Search and filter by topic</p>
          </div>
          <ResourceList />
        </section>

        {/* CTA */}
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