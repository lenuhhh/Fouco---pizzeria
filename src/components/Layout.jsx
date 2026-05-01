import React, { useState, useEffect, useRef } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ShoppingCart, User, Menu, X, Flame, MapPin, Phone, Mail,
  Clock, Instagram, Send, ChevronRight, Heart
} from 'lucide-react'
import { useCartStore, useAuthStore } from '../store'
import { supabase, IS_DEMO } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const scrollRafRef = useRef(null)
  const scrolledStateRef = useRef(false)
  const location = useLocation()
  const navigate = useNavigate()
  const count = useCartStore(s => s.count())
  const user = useAuthStore(s => s.user)

  useEffect(() => {
    const onScroll = () => {
      if (scrollRafRef.current !== null) return
      scrollRafRef.current = window.requestAnimationFrame(() => {
        const nextScrolled = window.scrollY > 30
        if (scrolledStateRef.current !== nextScrolled) {
          scrolledStateRef.current = nextScrolled
          setScrolled(nextScrolled)
        }
        scrollRafRef.current = null
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (scrollRafRef.current !== null) {
        window.cancelAnimationFrame(scrollRafRef.current)
      }
    }
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setMenuOpen(false)
    }
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    toast.success('Signed out successfully!')
    navigate('/')
  }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/menu', label: 'Menu' },
    { to: '/contacts', label: 'Contact' },
    { to: '/orders', label: 'Orders' },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* ── FIXED TOP SHELL: demo banner + navbar always pinned ── */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }}>

        {/* DEMO BANNER */}
        {IS_DEMO && (
          <div style={{
            background: 'linear-gradient(90deg, rgba(212,160,71,0.2), rgba(232,66,10,0.2))',
            borderBottom: '1px solid rgba(212,160,71,0.3)',
            padding: '8px 24px', textAlign: 'center',
            fontSize: '0.78rem', color: 'var(--c-gold2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            letterSpacing: '0.04em',
          }}>
            <Flame size={12} fill="currentColor" />
            DEMO MODE - connect Supabase credentials to enable real data
            <Flame size={12} fill="currentColor" />
          </div>
        )}

        {/* NAVBAR */}
        <motion.header
          style={{
            background: scrolled
              ? 'linear-gradient(90deg, rgba(13,11,8,0.96), rgba(25,16,11,0.95))'
              : 'linear-gradient(90deg, rgba(13,11,8,0.84), rgba(24,14,10,0.8))',
            backdropFilter: 'blur(12px)',
            borderBottom: `1px solid ${menuOpen ? 'rgba(232,66,10,0.28)' : 'rgba(212,160,71,0.16)'}`,
            boxShadow: scrolled ? '0 12px 28px rgba(0,0,0,0.34)' : '0 8px 20px rgba(0,0,0,0.2)',
            transition: 'background 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease',
          }}
          initial={{ y: IS_DEMO ? -109 : -76 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
        <div style={{
          width: '100%',
          maxWidth: 'var(--content-width)',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 76,
          padding: '0 var(--content-gutter)',
        }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <motion.div whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.4 }}>
              <Flame size={28} color="var(--c-fire)" strokeWidth={2.5} />
            </motion.div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
              Fuoco<span style={{ color: 'var(--c-fire)', fontStyle: 'italic' }}>.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', gap: 4, alignItems: 'center' }} className="desktop-nav">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to}>
                <motion.span
                  style={{
                    padding: '8px 16px', borderRadius: 50, fontSize: '0.9rem',
                    fontWeight: 500, display: 'block', position: 'relative',
                    color: location.pathname === link.to ? 'var(--c-fire2)' : 'rgba(245,230,200,0.68)',
                    transition: 'color 0.2s',
                  }}
                  whileHover={{ color: 'var(--c-text)' }}
                >
                  {link.label}
                  {location.pathname === link.to && (
                    <motion.div layoutId="nav-indicator" style={{
                      position: 'absolute', bottom: -2, left: '50%', transform: 'translateX(-50%)',
                      width: 4, height: 4, borderRadius: 2, background: 'var(--c-fire)',
                    }} />
                  )}
                </motion.span>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/cart')}
              style={{
                position: 'relative', padding: '10px 20px',
                background: 'rgba(232,66,10,0.1)', border: '1px solid rgba(232,66,10,0.24)',
                borderRadius: 50, color: 'var(--c-text)', display: 'flex', alignItems: 'center', gap: 8,
                fontSize: '0.9rem', fontWeight: 500,
              }}
            >
              <ShoppingCart size={18} />
              <span className="desktop-nav">Cart</span>
              {count > 0 && (
                <motion.span className="badge" initial={{ scale: 0 }} animate={{ scale: 1 }}
                  style={{ position: 'absolute', top: -6, right: -6 }}>
                  {count}
                </motion.span>
              )}
            </motion.button>

            {user ? (
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/profile')}
                style={{
                  width: 42, height: 42, borderRadius: 50,
                  background: 'linear-gradient(135deg, var(--c-fire), var(--c-gold))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                }}>
                <User size={18} />
              </motion.button>
            ) : (
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/auth')} className="btn-ghost"
                style={{ padding: '8px 18px', fontSize: '0.88rem' }}>
                Sign in
              </motion.button>
            )}

            <button onClick={() => setMenuOpen(v => !v)} className="mobile-menu-btn"
              aria-expanded={menuOpen}
              style={{
                padding: 8,
                color: 'var(--c-text)',
                display: 'none',
                borderRadius: 10,
                border: '1px solid rgba(212,160,71,0.2)',
                background: 'rgba(255,255,255,0.02)',
              }}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.header>

        {/* Mobile Menu — inside fixed shell, slots naturally below nav */}
        <div
          style={{
            background: 'linear-gradient(180deg, rgba(13,11,8,0.98), rgba(18,12,9,0.97))',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(212,160,71,0.14)',
            padding: '16px 24px 24px',
            transform: menuOpen ? 'translateY(0)' : 'translateY(-8px)',
            opacity: menuOpen ? 1 : 0,
            pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'opacity 0.2s ease, transform 0.2s ease',
        }}
      >
        {navLinks.map(link => (
          <div key={link.to}>
            <Link to={link.to} style={{
              display: 'block', padding: '14px 0',
              borderBottom: '1px solid var(--c-border)',
              color: location.pathname === link.to ? 'var(--c-fire2)' : 'var(--c-text)',
              fontWeight: 500, fontSize: '1.1rem',
            }}>
              {link.label}
            </Link>
          </div>
        ))}
        <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
          {user ? (
            <>
              <button onClick={() => navigate('/profile')} className="btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>
                <User size={16} /><span>Profile</span>
              </button>
              <button onClick={handleLogout} className="btn-ghost" style={{ flex: 1, justifyContent: 'center', color: 'var(--c-muted)' }}>
                Sign out
              </button>
            </>
          ) : (
            <button onClick={() => navigate('/auth')} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
              <span>Sign in</span>
            </button>
          )}
        </div>
      </div>{/* ── end mobile menu ── */}
      </div>{/* ── end fixed top shell ── */}

      {/* PAGE CONTENT */}
      <main style={{ flex: 1, paddingTop: IS_DEMO ? 76 + 33 : 76 }}>
        <Outlet />
      </main>

      {/* ─── FOOTER ─── */}
      <footer style={{ background: 'var(--c-bg2)', borderTop: '1px solid var(--c-border)' }}>
        {/* Top newsletter strip */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(232,66,10,0.1), rgba(212,160,71,0.08))',
          borderBottom: '1px solid var(--c-border)',
          padding: '40px 0',
        }}>
          <div className="container footer-newsletter">
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, marginBottom: 6 }}>
                Get <span style={{ color: 'var(--c-fire)' }}>10%</span> off your first order
              </h3>
              <p style={{ color: 'var(--c-muted)', fontSize: '0.88rem' }}>Sign up and receive your personal promo code</p>
            </div>
            <div className="footer-newsletter-form">
              <input
                className="input-field footer-newsletter-input"
                placeholder="Your email"
                style={{ borderColor: 'rgba(232,66,10,0.2)' }}
              />
              <button
                className="btn-primary footer-newsletter-btn"
                style={{ whiteSpace: 'nowrap' }}
                onClick={() => toast.success('Welcome! Your discount is active.')}
              >
                <span style={{ position: 'relative', zIndex: 1 }}>Claim</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main footer grid */}
        <div className="container" style={{ padding: '60px 0 40px' }}>
          <div className="footer-grid">
            {/* Brand */}
            <div style={{ gridColumn: 'span 1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <Flame size={24} color="var(--c-fire)" />
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 900 }}>
                  Fuoco<span style={{ color: 'var(--c-fire)', fontStyle: 'italic' }}>.</span>
                </span>
              </div>
              <p style={{ color: 'var(--c-muted)', fontSize: '0.88rem', lineHeight: 1.9, marginBottom: 24 }}>
                Italian pizza crafted with traditional recipes. Baked in a wood-fired oven at 485°C, inspired by classic Neapolitan style.
              </p>
              {/* Social */}
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { icon: <Instagram size={16} />, label: 'Instagram' },
                  { icon: <Send size={16} />, label: 'Telegram' },
                ].map(s => (
                  <motion.button key={s.label} whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }}
                    style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: 'var(--c-surface)', border: '1px solid var(--c-border)',
                      color: 'var(--c-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--c-fire)'; e.currentTarget.style.color = 'var(--c-fire)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--c-border)'; e.currentTarget.style.color = 'var(--c-muted)' }}
                  >
                    {s.icon}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Menu links */}
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: 20, color: 'var(--c-cream)', fontSize: '0.9rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Menu
              </h4>
              {[
                { label: 'Pizza', to: '/menu' },
                { label: 'Pasta', to: '/menu' },
                { label: 'Starters', to: '/menu' },
                { label: 'Desserts', to: '/menu' },
                { label: 'Drinks', to: '/menu' },
              ].map(item => (
                <Link key={item.label} to={item.to}>
                  <motion.div whileHover={{ x: 4 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--c-muted)', fontSize: '0.88rem', marginBottom: 12, transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--c-fire2)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--c-muted)'}
                  >
                    <ChevronRight size={12} /> {item.label}
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Company */}
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: 20, color: 'var(--c-cream)', fontSize: '0.9rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Company
              </h4>
              {[
                { label: 'About us', to: '/' },
                { label: 'Contact', to: '/contacts' },
                { label: 'Promotions', to: '/menu' },
                { label: 'Delivery', to: '/contacts' },
                { label: 'Site Structure', to: '/sitemap' },
              ].map(item => (
                <Link key={item.label} to={item.to}>
                  <motion.div whileHover={{ x: 4 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--c-muted)', fontSize: '0.88rem', marginBottom: 12, transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--c-fire2)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--c-muted)'}
                  >
                    <ChevronRight size={12} /> {item.label}
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Contacts */}
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: 20, color: 'var(--c-cream)', fontSize: '0.9rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Contact
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { icon: <Phone size={15} />, text: '+38 044 555 01 99', sub: 'Mon-Sun 10:00–23:00' },
                  { icon: <Mail size={15} />, text: 'hello@fuoco.ua', sub: 'Email support' },
                  { icon: <MapPin size={15} />, text: 'Khreshchatyk St 22, Kyiv', sub: 'City centre' },
                  { icon: <Clock size={15} />, text: 'Mon-Sun: 11:00-23:00', sub: 'Open every day' },
                ].map(c => (
                  <div key={c.text} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                      background: 'rgba(232,66,10,0.1)', border: '1px solid rgba(232,66,10,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--c-fire)',
                    }}>{c.icon}</div>
                    <div>
                      <div style={{ color: 'var(--c-cream)', fontSize: '0.88rem', fontWeight: 500 }}>{c.text}</div>
                      <div style={{ color: 'var(--c-muted)', fontSize: '0.78rem', marginTop: 2 }}>{c.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="footer-bottom">
            <p style={{ color: 'var(--c-muted)', fontSize: '0.82rem' }}>
              © 2024 Fuoco. All rights reserved.
            </p>
            <p style={{ color: 'var(--c-muted)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 4 }}>
              Made with <Heart size={12} fill="var(--c-fire)" color="var(--c-fire)" /> in Italy
            </p>
            <div style={{ display: 'flex', gap: 20 }}>
              {['Privacy Policy', 'Terms of Service'].map(link => (
                <span key={link} style={{ color: 'var(--c-muted)', fontSize: '0.78rem', cursor: 'pointer', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = 'var(--c-fire)'}
                  onMouseLeave={e => e.target.style.color = 'var(--c-muted)'}
                >{link}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }

        /* ── Footer layout ── */
        .footer-newsletter {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 24px;
        }
        .footer-newsletter-form {
          display: flex;
          gap: 0;
        }
        .footer-newsletter-input {
          border-radius: 12px 0 0 12px !important;
          border-right: none !important;
          min-width: 240px;
        }
        .footer-newsletter-btn {
          border-radius: 0 12px 12px 0 !important;
          padding: 14px 24px !important;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
          gap: 48px;
          margin-bottom: 48px;
        }
        .footer-bottom {
          border-top: 1px solid var(--c-border);
          padding-top: 28px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        /* ── Tablet (≤ 1024px) ── */
        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 36px;
          }
          .footer-newsletter-input {
            min-width: 200px;
          }
        }

        /* ── Mobile (≤ 640px) ── */
        @media (max-width: 640px) {
          .footer-newsletter {
            flex-direction: column;
            align-items: flex-start;
          }
          .footer-newsletter-form {
            width: 100%;
            flex-direction: column;
            gap: 8px;
          }
          .footer-newsletter-input {
            border-radius: 12px !important;
            border-right: 1px solid rgba(232,66,10,0.2) !important;
            min-width: unset;
            width: 100% !important;
          }
          .footer-newsletter-btn {
            border-radius: 12px !important;
            width: 100% !important;
            justify-content: center;
          }
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 28px;
          }
          .footer-bottom {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 16px;
          }
        }
      `}</style>
    </div>
  )
}
