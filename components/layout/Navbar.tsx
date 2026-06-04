'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { TrendingUp, Search, Menu, X, Moon, Sun } from 'lucide-react'

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [dark, setDark] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark')
      setDark(true)
    }
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function toggleDark() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const s = search.trim().toUpperCase()
    if (s) { router.push(`/stocks/${s}`); setSearch('') }
  }

  const navStyle: React.CSSProperties = {
    position: 'sticky', top: 0, zIndex: 50,
    background: 'var(--color-surface)',
    borderBottom: '1px solid var(--color-border)',
    boxShadow: scrolled ? '0 1px 12px rgba(0,0,0,0.06)' : 'none',
    transition: 'box-shadow 0.2s',
  }

  const containerStyle: React.CSSProperties = {
    maxWidth: 1200, margin: '0 auto',
    padding: '0 24px', height: 64,
    display: 'flex', alignItems: 'center', gap: 16,
  }

  return (
    <header style={navStyle}>
      <div style={containerStyle}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg,#2563eb,#4f46e5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px #2563eb40',
          }}>
            <TrendingUp size={16} color="white" />
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 18, color: 'var(--color-text)' }}>
            MarketWise
          </span>
        </Link>

        {/* Nav links - desktop */}
        <div style={{ display: 'flex', gap: 4, marginLeft: 8 }} className="hide-mobile">
          {[{ href: '/', label: 'Markets' }, { href: '/learn', label: 'Learn' }].map(({ href, label }) => (
            <Link key={href} href={href} style={{
              padding: '7px 14px', borderRadius: 8, fontSize: 14, fontWeight: 600,
              textDecoration: 'none', transition: 'all 0.15s',
              background: pathname === href ? '#eff6ff' : 'transparent',
              color: pathname === href ? '#2563eb' : 'var(--color-text-muted)',
            }}>{label}</Link>
          ))}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Search */}
        <form onSubmit={handleSearch} style={{ position: 'relative', width: 220 }} className="hide-mobile">
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)', pointerEvents: 'none' }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search ticker… AAPL"
            style={{
              width: '100%', height: 38, paddingLeft: 36, paddingRight: 12,
              borderRadius: 10, border: '1.5px solid var(--color-border)',
              background: 'var(--color-surface-2)', fontSize: 13,
              color: 'var(--color-text)', outline: 'none', transition: 'all 0.15s',
            }}
          />
        </form>

        {/* Dark toggle */}
        <button onClick={toggleDark} className="hide-mobile" style={{
          width: 38, height: 38, borderRadius: 10,
          border: '1.5px solid var(--color-border)',
          background: 'var(--color-surface-2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'var(--color-text-muted)',
          flexShrink: 0,
        }}>
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(o => !o)} className="show-mobile" style={{
          width: 38, height: 38, borderRadius: 10,
          border: '1.5px solid var(--color-border)',
          background: 'var(--color-surface-2)',
          display: 'none', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'var(--color-text-muted)', flexShrink: 0,
        }}>
          {menuOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          borderTop: '1px solid var(--color-border)',
          background: 'var(--color-surface)',
          padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          <form onSubmit={handleSearch} style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search ticker…"
              style={{ width: '100%', height: 40, paddingLeft: 36, paddingRight: 12, borderRadius: 10, border: '1.5px solid var(--color-border)', background: 'var(--color-surface-2)', fontSize: 14, color: 'var(--color-text)', outline: 'none' }} />
          </form>
          {[{ href: '/', label: 'Markets' }, { href: '/learn', label: 'Learn' }].map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)} style={{
              padding: '10px 14px', borderRadius: 8, fontSize: 14, fontWeight: 600,
              textDecoration: 'none', color: 'var(--color-text-muted)',
            }}>{label}</Link>
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