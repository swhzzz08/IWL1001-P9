'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { TrendingUp, Search, Menu, X, Moon, Sun, Star, BookOpen, BarChart2, AlertCircle, LogOut } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { useWatchlist } from '@/hooks/useWatchlist'
import { SUPPORTED_SYMBOLS } from '@/lib/stocks'
import { articles, categories } from '@/data/education'

const STOCK_NAMES: Record<string, string> = {
  AAPL: 'Apple Inc.',
  MSFT: 'Microsoft Corp.',
  NVDA: 'NVIDIA Corp.',
  GOOGL: 'Alphabet Inc.',
  AMZN: 'Amazon.com Inc.',
  META: 'Meta Platforms Inc.',
  TSLA: 'Tesla Inc.',
}

function getCategorySlug(categoryName: string) {
  return categories.find(c => c.name === categoryName)?.slug ?? categoryName.toLowerCase().replace(/\s+/g, '-')
}

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dark, setDark] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { data: session, status } = useSession()
  const { watchlist } = useWatchlist()
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const avatarRef = useRef<HTMLButtonElement>(null)
  const avatarDropdownRef = useRef<HTMLDivElement>(null)
  const [avatarOpen, setAvatarOpen] = useState(false)

  useEffect(() => {
    // Dark mode — preserve your friend's logic
    const saved = localStorage.getItem('theme')
    if (saved === 'dark') {
      document.documentElement.classList.add('dark')
      setDark(true)
    }
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close search dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Close avatar dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        avatarDropdownRef.current && !avatarDropdownRef.current.contains(e.target as Node) &&
        avatarRef.current && !avatarRef.current.contains(e.target as Node)
      ) {
        setAvatarOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function getInitials(name?: string | null, email?: string | null) {
    if (name) {
      const parts = name.trim().split(' ')
      return parts.length >= 2
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : parts[0].slice(0, 2).toUpperCase()
    }
    return email ? email[0].toUpperCase() : 'U'
  }

  function toggleDark() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  // Search logic
  const q = query.trim().toLowerCase()

  const matchedStocks = q.length === 0 ? [] : SUPPORTED_SYMBOLS.filter(s =>
    s.toLowerCase().includes(q) ||
    STOCK_NAMES[s]?.toLowerCase().includes(q)
  )

  const matchedArticles = q.length === 0 ? [] : articles.filter(a =>
    a.title.toLowerCase().includes(q) ||
    a.summary.toLowerCase().includes(q) ||
    a.category.toLowerCase().includes(q)
  ).slice(0, 4)

  const hasResults = matchedStocks.length > 0 || matchedArticles.length > 0
  const showNotFound = q.length >= 2 && !hasResults

  function handleSelect(path: string) {
    router.push(path)
    setQuery('')
    setOpen(false)
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
      borderBottom: '1px solid var(--color-border)',
      boxShadow: scrolled ? '0 2px 16px rgba(15,118,110,0.08)' : 'none',
      transition: 'box-shadow 0.2s',
    }}>
      <nav style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', gap: 16 }}>

        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#0f766e,#0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px #0f766e35' }}>
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

        {/* Search with dropdown */}
        <div style={{ position: 'relative', width: 260 }} className="hide-mobile">
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)', pointerEvents: 'none', zIndex: 1 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true) }}
            onFocus={() => setOpen(true)}
            placeholder="Search stocks or articles…"
            style={{
              width: '100%', height: 38, paddingLeft: 36, paddingRight: 12,
              borderRadius: 10, border: '1.5px solid var(--color-border)',
              background: 'var(--color-surface-2)', fontSize: 13,
              color: 'var(--color-text)', outline: 'none', transition: 'all 0.15s',
              fontFamily: 'var(--font-sans)',
            }}
          />

          {/* Dropdown */}
          {open && query.length >= 1 && (
            <div ref={dropdownRef} style={{
              position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
              background: 'var(--color-surface)', border: '1.5px solid var(--color-border)',
              borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              zIndex: 100, overflow: 'hidden',
            }}>
              {/* Stocks section */}
              {matchedStocks.length > 0 && (
                <div>
                  <div style={{ padding: '10px 14px 6px', fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-subtle)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <BarChart2 size={10} /> Stocks
                  </div>
                  {matchedStocks.map(symbol => (
                    <button key={symbol} onClick={() => handleSelect(`/stocks/${symbol}`)} style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                      padding: '9px 14px', background: 'none', border: 'none', cursor: 'pointer',
                      textAlign: 'left', transition: 'background 0.1s',
                    }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--color-surface-2)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'none'}
                    >
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f0fdfa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#0f766e', flexShrink: 0 }}>
                        {symbol.slice(0, 2)}
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)', margin: 0, fontFamily: 'var(--font-heading)' }}>{symbol}</p>
                        <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0 }}>{STOCK_NAMES[symbol]}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Articles section */}
              {matchedArticles.length > 0 && (
                <div style={{ borderTop: matchedStocks.length > 0 ? '1px solid var(--color-border)' : 'none' }}>
                  <div style={{ padding: '10px 14px 6px', fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-subtle)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <BookOpen size={10} /> Learn
                  </div>
                  {matchedArticles.map(article => (
                    <button key={article.slug} onClick={() => handleSelect(`/learn/${getCategorySlug(article.category)}/${article.slug}`)} style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                      padding: '9px 14px', background: 'none', border: 'none', cursor: 'pointer',
                      textAlign: 'left', transition: 'background 0.1s',
                    }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--color-surface-2)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'none'}
                    >
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <BookOpen size={14} color="#2563eb" />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{article.title}</p>
                        <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0 }}>{article.category} · {article.difficulty}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Not found */}
              {showNotFound && (
                <div style={{ padding: '20px 16px', textAlign: 'center' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                    <AlertCircle size={18} color="#dc2626" />
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', margin: '0 0 4px' }}>No results for "{query}"</p>
                  <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0 }}>
                    Try a stock ticker (AAPL, TSLA) or a topic like "RSI" or "ETF"
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dark mode toggle — preserved from friend's version */}
        <button onClick={toggleDark} className="hide-mobile" style={{
          width: 38, height: 38, borderRadius: 10,
          border: '1.5px solid var(--color-border)',
          background: 'var(--color-surface-2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'var(--color-text-muted)', flexShrink: 0,
        }}>
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Auth buttons / avatar (desktop) */}
        {status !== 'loading' && (
          <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, position: 'relative' }}>
            {status === 'unauthenticated' ? (
              <>
                <Link href="/auth/login" style={{
                  height: 38, padding: '0 16px', borderRadius: 10,
                  border: '1.5px solid var(--color-border)',
                  background: 'transparent', fontSize: 13, fontWeight: 600,
                  color: 'var(--color-text-muted)', textDecoration: 'none',
                  display: 'flex', alignItems: 'center',
                }}>
                  Log in
                </Link>
                <Link href="/auth/register" style={{
                  height: 38, padding: '0 16px', borderRadius: 10,
                  border: '1.5px solid #0f766e',
                  background: '#0f766e', fontSize: 13, fontWeight: 600,
                  color: 'white', textDecoration: 'none',
                  display: 'flex', alignItems: 'center',
                }}>
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <button
                  ref={avatarRef}
                  onClick={() => setAvatarOpen(o => !o)}
                  style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: 'linear-gradient(135deg,#0f766e,#0d9488)',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 800, color: 'white', flexShrink: 0,
                    boxShadow: '0 2px 8px #0f766e40',
                  }}
                >
                  {session?.user?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={session.user.image} alt="avatar" style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    getInitials(session?.user?.name, session?.user?.email)
                  )}
                </button>

                {avatarOpen && (
                  <div ref={avatarDropdownRef} style={{
                    position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                    background: 'var(--color-surface)', border: '1.5px solid var(--color-border)',
                    borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    zIndex: 100, minWidth: 220, overflow: 'hidden',
                  }}>
                    {/* User info header */}
                    <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid var(--color-border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                          background: 'linear-gradient(135deg,#0f766e,#0d9488)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, fontWeight: 800, color: 'white',
                        }}>
                          {session?.user?.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={session.user.image} alt="avatar" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                          ) : (
                            getInitials(session?.user?.name, session?.user?.email)
                          )}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          {session?.user?.name && (
                            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {session.user.name}
                            </p>
                          )}
                          {session?.user?.email && (
                            <p style={{ margin: 0, fontSize: 11, color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {session.user.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Sign out */}
                    <button
                      onClick={() => { setAvatarOpen(false); signOut() }}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                        padding: '11px 16px', background: 'none', border: 'none',
                        cursor: 'pointer', textAlign: 'left', fontSize: 13, fontWeight: 600,
                        color: '#dc2626', transition: 'background 0.1s',
                      }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#fef2f2'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'none'}
                    >
                      <LogOut size={14} />
                      Sign out
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

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
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          borderTop: '1px solid var(--color-border)',
          background: 'var(--color-surface)',
          padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search stocks or articles…"
              style={{
                width: '100%', height: 40, paddingLeft: 36, paddingRight: 12,
                borderRadius: 10, border: '1.5px solid var(--color-border)',
                background: 'var(--color-surface-2)', fontSize: 14,
                color: 'var(--color-text)', outline: 'none',
              }}
            />
          </div>
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)} style={{
              padding: '10px 14px', borderRadius: 8, fontSize: 14, fontWeight: 600,
              textDecoration: 'none', color: 'var(--color-text-muted)',
            }}>
              {label}
            </Link>
          ))}
          <button onClick={toggleDark} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 14px', fontSize: 14, color: 'var(--color-text-muted)',
            background: 'none', border: 'none', cursor: 'pointer',
          }}>
            {dark ? <Sun size={15} /> : <Moon size={15} />}
            {dark ? 'Light mode' : 'Dark mode'}
          </button>

          {status !== 'loading' && (
            status === 'unauthenticated' ? (
              <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
                <Link href="/auth/login" onClick={() => setMenuOpen(false)} style={{
                  flex: 1, textAlign: 'center', padding: '10px 0', borderRadius: 10,
                  border: '1.5px solid var(--color-border)', fontSize: 14, fontWeight: 600,
                  color: 'var(--color-text-muted)', textDecoration: 'none',
                }}>
                  Log in
                </Link>
                <Link href="/auth/register" onClick={() => setMenuOpen(false)} style={{
                  flex: 1, textAlign: 'center', padding: '10px 0', borderRadius: 10,
                  border: '1.5px solid #0f766e', background: '#0f766e',
                  fontSize: 14, fontWeight: 600, color: 'white', textDecoration: 'none',
                }}>
                  Sign Up
                </Link>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', borderTop: '1px solid var(--color-border)' }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'linear-gradient(135deg,#0f766e,#0d9488)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 800, color: 'white', flexShrink: 0,
                  }}>
                    {getInitials(session?.user?.name, session?.user?.email)}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    {session?.user?.name && <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--color-text)' }}>{session.user.name}</p>}
                    {session?.user?.email && <p style={{ margin: 0, fontSize: 11, color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{session.user.email}</p>}
                  </div>
                </div>
                <button onClick={() => { setMenuOpen(false); signOut() }} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 14px', fontSize: 14, fontWeight: 600, color: '#dc2626',
                  background: 'none', border: 'none', cursor: 'pointer',
                }}>
                  <LogOut size={15} /> Sign out
                </button>
              </>
            )
          )}
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
