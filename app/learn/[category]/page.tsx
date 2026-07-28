'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { articles, categories } from '@/data/education'
import { ArrowLeft, Clock, ChevronRight, BookOpen } from 'lucide-react'
import { use } from 'react'

const DIFFICULTY: Record<string, { bg: string; color: string }> = {
  Beginner:     { bg: '#f0fdf4', color: '#15803d' },
  Intermediate: { bg: '#fffbeb', color: '#d97706' },
  Advanced:     { bg: '#fef2f2', color: '#b91c1c' },
}

const COLOR_MAP: Record<number, { bg: string; icon: string; light: string; border: string }> = {
  0: { bg: '#eff6ff', icon: '#2563eb', light: '#dbeafe', border: '#93c5fd' },
  1: { bg: '#f0fdf4', icon: '#16a34a', light: '#bbf7d0', border: '#86efac' },
  2: { bg: '#fdf4ff', icon: '#9333ea', light: '#e9d5ff', border: '#d8b4fe' },
  3: { bg: '#fff7ed', icon: '#ea580c', light: '#fed7aa', border: '#fdba74' },
  4: { bg: '#fef2f2', icon: '#dc2626', light: '#fecaca', border: '#fca5a5' },
  5: { bg: '#f0fdfa', icon: '#0d9488', light: '#99f6e4', border: '#5eead4' },
  6: { bg: '#fefce8', icon: '#ca8a04', light: '#fef08a', border: '#fde047' },
  7: { bg: '#f8fafc', icon: '#475569', light: '#e2e8f0', border: '#cbd5e1' },
}

export default function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category: categorySlug } = use(params)
  const category = categories.find(c => c.slug === categorySlug)
  if (!category) notFound()

  const categoryArticles = articles.filter(a => a.category === category.name)
  const categoryIndex = categories.findIndex(c => c.slug === categorySlug)
  const color = COLOR_MAP[categoryIndex % 8]

  return (
    <div style={{ background: 'var(--color-background)', minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        padding: '40px 24px 48px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Link href="/learn" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 13, color: 'var(--color-text-muted)',
            textDecoration: 'none', marginBottom: 24,
          }}>
            <ArrowLeft size={14} /> Back to Learn
          </Link>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
            <div style={{
              width: 60, height: 60, borderRadius: 16,
              background: color.bg, border: `1.5px solid ${color.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <BookOpen size={26} color={color.icon} />
            </div>
            <div>
              <h1 style={{
                fontFamily: 'var(--font-heading)', fontWeight: 800,
                fontSize: 'clamp(26px, 4vw, 38px)',
                color: 'var(--color-text)', margin: '0 0 8px', letterSpacing: '-0.02em',
              }}>
                {category.name}
              </h1>
              <p style={{
                fontSize: 15, color: 'var(--color-text-muted)',
                margin: '0 0 16px', maxWidth: 560, lineHeight: 1.65,
              }}>
                {category.description}
              </p>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: color.bg, border: `1px solid ${color.border}`,
                borderRadius: 999, padding: '5px 14px',
                fontSize: 12, fontWeight: 700, color: color.icon,
              }}>
                {categoryArticles.length} {categoryArticles.length === 1 ? 'article' : 'articles'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Articles grid */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 72px' }}>
        {categoryArticles.length === 0 ? (
          <div style={{
            padding: '64px 24px', textAlign: 'center',
            background: 'var(--color-surface)',
            border: '1.5px solid var(--color-border)',
            borderRadius: 16,
          }}>
            <p style={{ fontSize: 14, color: 'var(--color-text-muted)', margin: 0 }}>
              No articles in this category yet. Check back soon!
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 16,
          }}>
            {categoryArticles.map(article => {
              const diff = DIFFICULTY[article.difficulty] ?? DIFFICULTY.Beginner
              return (
                <Link
                  key={article.slug}
                  href={`/learn/${categorySlug}/${article.slug}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div style={{
                    background: 'var(--color-surface)',
                    border: '1.5px solid var(--color-border)',
                    borderRadius: 16, padding: '20px',
                    display: 'flex', flexDirection: 'column', gap: 12,
                    height: '100%', transition: 'all 0.2s', cursor: 'pointer',
                  }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.borderColor = color.border
                      el.style.boxShadow = `0 4px 20px ${color.icon}15`
                      el.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.borderColor = 'var(--color-border)'
                      el.style.boxShadow = 'none'
                      el.style.transform = 'none'
                    }}
                  >
                    {/* Title + difficulty */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                      <h3 style={{
                        fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 700,
                        color: 'var(--color-text)', margin: 0, lineHeight: 1.4,
                      }}>
                        {article.title}
                      </h3>
                      <span style={{
                        ...diff, borderRadius: 999, padding: '3px 10px',
                        fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0,
                        textTransform: 'uppercase', letterSpacing: '0.05em',
                      }}>
                        {article.difficulty}
                      </span>
                    </div>

                    {/* Summary */}
                    <p style={{
                      fontSize: 13, color: 'var(--color-text-muted)',
                      margin: 0, lineHeight: 1.65,
                      overflow: 'hidden', display: '-webkit-box',
                      WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                    }}>
                      {article.summary}
                    </p>

                    {/* Footer */}
                    <div style={{
                      marginTop: 'auto',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      paddingTop: 10, borderTop: '1px solid var(--color-border)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--color-text-subtle)' }}>
                        <Clock size={12} />
                        {article.readTimeMinutes} min read
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: color.icon }}>
                        Read article <ChevronRight size={13} />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}