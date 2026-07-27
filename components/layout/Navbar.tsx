'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { TrendingUp, Search, Menu, X, Star } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { useWatchlist } from '@/hooks/useWatchlist'

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const accountRef = useRef<HTMLDivElement>(null)
  const { data: session, status } = useSession()
  const { watchlist } = useWatchlist()

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

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

        {/* Auth section */}
        {status === 'authenticated' && session?.user ? (
          <div ref={accountRef} style={{ position: 'relative', flexShrink: 0 }} className="hide-mobile">
            <button onClick={() => setAccountOpen(o => !o)} style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, #0f766e, #0d9488)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: 14, fontWeight: 700,
            }}>
              {(session.user.name || session.user.email || '?').charAt(0).toUpperCase()}
            </button>
            {accountOpen && (
              <div style={{
                position: 'absolute', top: 44, right: 0, minWidth: 200,
                background: 'var(--color-surface)', border: '1.5px solid var(--color-border)',
                borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.08)', overflow: 'hidden', zIndex: 60,
              }}>
                <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>
                    {session.user.name || 'Account'}
                  </div>
                  {session.user.email && (
                    <div style={{ fontSize: 12, color: 'var(--color-text-subtle)' }}>{session.user.email}</div>
                  )}
                </div>
                <button
                  onClick={() => { setAccountOpen(false); signOut({ callbackUrl: '/' }) }}
                  style={{
                    width: '100%', textAlign: 'left', padding: '10px 14px', border: 'none', background: 'transparent',
                    cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)',
                  }}
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        ) : status === 'unauthenticated' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }} className="hide-mobile">
            <Link href="/auth/login" style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-muted)', textDecoration: 'none' }}>
              Log in
            </Link>
            <Link href="/auth/register" style={{
              padding: '8px 18px', borderRadius: 999, fontSize: 14, fontWeight: 600,
              background: 'linear-gradient(135deg, #0f766e, #0d9488)', color: 'white', textDecoration: 'none',
            }}>
              Sign up
            </Link>
          </div>
        ) : null}

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
          {status === 'authenticated' && session?.user ? (
            <>
              <div style={{ padding: '10px 14px', fontSize: 13, color: 'var(--color-text-subtle)' }}>
                {session.user.name || session.user.email}
              </div>
              <button
                onClick={() => { setMenuOpen(false); signOut({ callbackUrl: '/' }) }}
                style={{ textAlign: 'left', padding: '10px 14px', borderRadius: 8, border: 'none', background: 'transparent', fontSize: 14, fontWeight: 600, color: 'var(--color-text-muted)', cursor: 'pointer' }}
              >
                Log out
              </button>
            </>
          ) : status === 'unauthenticated' ? (
            <>
              <Link href="/auth/login" onClick={() => setMenuOpen(false)} style={{ padding: '10px 14px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', color: 'var(--color-text-muted)' }}>
                Log in
              </Link>
              <Link href="/auth/register" onClick={() => setMenuOpen(false)} style={{
                padding: '10px 14px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none',
                textAlign: 'center', background: 'linear-gradient(135deg, #0f766e, #0d9488)', color: 'white',
              }}>
                Sign up
              </Link>
            </>
          ) : null}
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