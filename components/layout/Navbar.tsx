'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { TrendingUp, Search, Menu, X, Star } from 'lucide-react'
import { useWatchlist } from '@/hooks/useWatchlist'

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { watchlist } = useWatchlist()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const s = search.trim().toUpperCase()
    if (s) { router.push(`/stocks/${s}`); setSearch('') }
  }

  const navLinks = [
    { href: '/', label: 'Markets' },
    { href: '/learn', label: 'Learn' },
    { href: '/watchlist', label: 'Watchlist', badge: watchlist.length || undefined },
  ]

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'var(--color-surface)',
      borderBottom: `1px solid var(--color-border)`,
      boxShadow: scrolled ? '0 2px 16px rgba(15,118,110,0.08)' : 'none',
      transition: 'box-shadow 0.2s',
    }}>
      <nav style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #0f766e, #0d9488)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px #0f766e35',
          }}>
            <TrendingUp size={18} color="white" />
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 19, color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
            MarketWise
          </span>
        </Link>

        {/* Desktop nav links */}
        <div style={{ display: 'flex', gap: 2, marginLeft: 8 }} className="hide-mobile">
          {navLinks.map(({ href, label, badge }) => {
            const active = pathname === href
            return (
              <Link key={href} href={href} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '7px 14px', borderRadius: 8, fontSize: 14, fontWeight: 600,
                textDecoration: 'none', transition: 'all 0.15s',
                background: active ? '#f0fdfa' : 'transparent',
                color: active ? '#0f766e' : 'var(--color-text-muted)',
              }}>
                {href === '/watchlist' && <Star size={13} fill={active ? '#0f766e' : 'none'} color={active ? '#0f766e' : 'var(--color-text-muted)'} />}
                {label}
                {badge ? (
                  <span style={{ background: '#0f766e', color: 'white', borderRadius: 999, padding: '1px 7px', fontSize: 11, fontWeight: 800 }}>
                    {badge}
                  </span>
                ) : null}
              </Link>
            )
          })}
        </div>

        <div style={{ flex: 1 }} />

        {/* Search */}
        <form onSubmit={handleSearch} style={{ position: 'relative', width: 220 }} className="hide-mobile">
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)', pointerEvents: 'none' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search ticker… AAPL"
            style={{
              width: '100%', height: 38, paddingLeft: 36, paddingRight: 12,
              borderRadius: 10, border: '1.5px solid var(--color-border)',
              background: 'var(--color-surface-2)', fontSize: 13,
              color: 'var(--color-text)', outline: 'none', transition: 'all 0.15s',
              fontFamily: 'var(--font-sans)',
            }}
            onFocus={e => { (e.target as HTMLInputElement).style.borderColor = '#0d9488'; (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px #0f766e15' }}
            onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--color-border)'; (e.target as HTMLInputElement).style.boxShadow = 'none' }}
          />
        </form>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(o => !o)} className="show-mobile" style={{ width: 38, height: 38, borderRadius: 10, border: '1.5px solid var(--color-border)', background: 'var(--color-surface-2)', display: 'none', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-text-muted)', flexShrink: 0 }}>
          {menuOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-surface)', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <form onSubmit={handleSearch} style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search ticker…"
              style={{ width: '100%', height: 40, paddingLeft: 36, paddingRight: 12, borderRadius: 10, border: '1.5px solid var(--color-border)', background: 'var(--color-surface-2)', fontSize: 14, color: 'var(--color-text)', outline: 'none' }} />
          </form>
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)} style={{ padding: '10px 14px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', color: 'var(--color-text-muted)' }}>
              {label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </header>
  )
}