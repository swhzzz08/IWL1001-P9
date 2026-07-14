import { notFound } from 'next/navigation'
import Link from 'next/link'
import { articles, categories } from '@/data/education'
import { ArrowLeft, Clock, BookOpen, ChevronRight } from 'lucide-react'

const DIFFICULTY: Record<string, { bg: string; color: string }> = {
  Beginner:     { bg: '#f0fdf4', color: '#15803d' },
  Intermediate: { bg: '#fffbeb', color: '#d97706' },
  Advanced:     { bg: '#fef2f2', color: '#b91c1c' },
}

export default async function ArticlePage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category: categorySlug, slug } = await params
  const article = articles.find(a => a.slug === slug)
  const category = categories.find(c => c.slug === categorySlug)
  if (!article || !category) notFound()

  const diff = DIFFICULTY[article.difficulty] ?? DIFFICULTY.Beginner

  // Related articles in same category (excluding current)
  const related = articles.filter(a => a.category === category.name && a.slug !== slug).slice(0, 3)

  return (
    <div style={{ background: 'var(--color-background)', minHeight: '100vh' }}>
      {/* Top bar */}
      <div style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: '12px 24px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-text-subtle)' }}>
          <Link href="/learn" style={{ color: 'var(--color-text-subtle)', textDecoration: 'none' }}>Learn</Link>
          <ChevronRight size={12} />
          <Link href={`/learn/${categorySlug}`} style={{ color: 'var(--color-text-subtle)', textDecoration: 'none' }}>{category.name}</Link>
          <ChevronRight size={12} />
          <span style={{ color: 'var(--color-text)', fontWeight: 600 }}>{article.title}</span>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px 80px' }}>
        {/* Back link */}
        <Link href={`/learn/${categorySlug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-text-muted)', textDecoration: 'none', marginBottom: 28 }}>
          <ArrowLeft size={14} /> Back to {category.name}
        </Link>

        {/* Article card */}
        <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}>
          {/* Header */}
          <div style={{ padding: '36px 40px 28px', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
              <span style={{ ...diff, borderRadius: 999, padding: '4px 12px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {article.difficulty}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--color-text-subtle)' }}>
                <Clock size={12} />
                {article.readTimeMinutes} min read
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--color-text-subtle)' }}>
                <BookOpen size={12} />
                {category.name}
              </div>
            </div>

            <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(24px, 4vw, 34px)', color: 'var(--color-text)', margin: '0 0 12px', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              {article.title}
            </h1>
            <p style={{ fontSize: 16, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.7 }}>
              {article.summary}
            </p>
          </div>

          {/* Body */}
          <div style={{ padding: '32px 40px 36px' }}>
            {article.body.split('\n\n').map((paragraph, i) => {
              const parts = paragraph.split(/(\*\*[^*]+\*\*)/)
              return (
                <p key={i} style={{ fontSize: 15, lineHeight: 1.85, color: 'var(--color-text)', margin: '0 0 20px', fontFamily: 'var(--font-sans)' }}>
                  {parts.map((part, j) =>
                    part.startsWith('**') && part.endsWith('**')
                      ? <strong key={j} style={{ fontWeight: 700, color: 'var(--color-text)' }}>{part.slice(2, -2)}</strong>
                      : part
                  )}
                </p>
              )
            })}
          </div>

          {/* Footer */}
          <div style={{ padding: '20px 40px', borderTop: '1px solid var(--color-border)', background: 'var(--color-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontSize: 12, color: 'var(--color-text-subtle)', margin: 0 }}>
              Category: <Link href={`/learn/${categorySlug}`} style={{ color: '#0f766e', textDecoration: 'none', fontWeight: 600 }}>{category.name}</Link>
            </p>
            <Link href={`/learn/${categorySlug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#0f766e', textDecoration: 'none' }}>
              More {category.name} articles <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 800, color: 'var(--color-text)', margin: '0 0 16px' }}>
              More in {category.name}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
              {related.map(a => {
                const d = DIFFICULTY[a.difficulty] ?? DIFFICULTY.Beginner
                return (
                  <Link key={a.slug} href={`/learn/${categorySlug}/${a.slug}`} style={{ textDecoration: 'none' }}>
                    <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 14, padding: '16px', height: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)', margin: 0, lineHeight: 1.4, fontFamily: 'var(--font-heading)' }}>{a.title}</p>
                        <span style={{ ...d, borderRadius: 999, padding: '2px 8px', fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>{a.difficulty}</span>
                      </div>
                      <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: '0 0 10px', lineHeight: 1.6 }}>{a.summary}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--color-text-subtle)' }}>
                        <Clock size={10} /> {a.readTimeMinutes} min read
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}