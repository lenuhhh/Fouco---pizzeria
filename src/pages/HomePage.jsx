import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Flame, Clock, Star, Shield, Truck } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { MOCK_PRODUCTS } from '../lib/mockData'
import ProductCard from '../components/ProductCard'
import { optimizeImageUrl } from '../lib/image'

export default function HomePage() {
  const navigate = useNavigate()
  const [popular, setPopular] = useState([])
  const [isCompactMotion, setIsCompactMotion] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 992 : false
  )

  useEffect(() => {
    async function loadPopular() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_popular', true)
        .eq('is_available', true)
        .limit(6)

      if (error || !data || data.length === 0) {
        const fallback = MOCK_PRODUCTS
          .filter(p => p.is_popular && p.is_available)
          .slice(0, 6)
        setPopular(fallback)
        return
      }

      setPopular(data)
    }

    loadPopular()
  }, [])

  useEffect(() => {
    const onResize = () => setIsCompactMotion(window.innerWidth < 992)
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <>
      {/* HERO */}
      <section style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          background: 'radial-gradient(ellipse 80% 80% at 35% 10%, rgba(232,66,10,0.2), transparent 72%), radial-gradient(ellipse 65% 65% at 85% 85%, rgba(212,160,71,0.12), transparent 66%)',
        }} />

        {!isCompactMotion && [...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: [340, 210, 420, 170][i],
              height: [340, 210, 420, 170][i],
              borderRadius: '50%',
              background: `radial-gradient(circle, ${['rgba(232,66,10,0.08)', 'rgba(212,160,71,0.06)', 'rgba(232,66,10,0.05)', 'rgba(212,160,71,0.1)'][i]}, transparent)`,
              left: ['6%', '68%', '58%', '18%'][i],
              top: ['8%', '14%', '58%', '74%'][i],
              filter: 'blur(40px)',
            }}
            animate={{ y: [0, -28, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 6 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: i * 1.2 }}
          />
        ))}

        <motion.div
          className="container hero-grid"
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.1fr) minmax(320px, 0.9fr)',
            alignItems: 'center',
            gap: 'clamp(28px, 5vw, 72px)',
            paddingTop: 'clamp(110px, 14vh, 160px)',
            paddingBottom: 'clamp(52px, 8vh, 90px)',
          }}
        >
          <div style={{ width: '100%', maxWidth: 760 }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              style={{ marginBottom: 24 }}
            >
              <span className="tag tag-fire" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Flame size={12} fill="currentColor" /> Open now · 11:00 - 23:00
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3rem, 7.4vw, 6.2rem)',
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: '-0.03em',
                marginBottom: 28,
              }}
            >
              Real
              <br />
              <span style={{ color: 'var(--c-fire)', fontStyle: 'italic' }}>Italian</span>
              <br />
              pizza
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{ fontSize: '1.1rem', color: 'var(--c-muted)', maxWidth: 560, lineHeight: 1.8, marginBottom: 34 }}
            >
              Wood-fired at 485°C. Fresh ingredients, classic recipes, and fast delivery in around 30 minutes.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}
            >
              <button className="btn-primary" onClick={() => navigate('/menu')} style={{ padding: '14px 32px', fontSize: '1rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative', zIndex: 1 }}>
                  View menu <ArrowRight size={18} />
                </span>
              </button>
              <button className="btn-ghost" onClick={() => navigate('/menu')} style={{ padding: '14px 28px', fontSize: '1rem' }}>
                Order now
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{ display: 'flex', gap: 42, marginTop: 54, flexWrap: 'wrap' }}
            >
              {[
                { n: '4.9', label: 'Rating' },
                { n: '2K+', label: 'Orders' },
                { n: '30', label: 'Min delivery' },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900, color: 'var(--c-cream)' }}>{s.n}</div>
                  <div style={{ color: 'var(--c-muted)', fontSize: '0.82rem', marginTop: 2, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 60, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              justifySelf: 'end',
              width: 'min(44vw, 620px)',
              minWidth: 290,
              aspectRatio: '1 / 1',
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.12)',
              overflow: 'hidden',
              boxShadow: '0 30px 80px rgba(0,0,0,0.55)',
              position: 'relative',
            }}
            className="hero-pizza-image"
          >
            <img
              src={optimizeImageUrl('https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1400', 1280, 76)}
              alt="Fresh pizza from the oven"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(circle at 20% 25%, rgba(255,255,255,0.24), transparent 42%), linear-gradient(to top, rgba(0,0,0,0.3), transparent 40%)',
            }} />
          </motion.div>
        </motion.div>

        <div
          style={{
            position: 'absolute',
            bottom: 34,
            left: 'max(var(--content-gutter), calc((100vw - var(--content-width)) / 2 + var(--content-gutter)))',
          }}
        >
          <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, transparent, var(--c-fire))' }} />
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '80px 0', background: 'var(--c-bg2)', borderTop: '1px solid var(--c-border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 2 }}>
            {[
              { icon: <Flame size={22} />, title: 'Wood-fired oven', desc: 'Baked at 485°C for a perfect crust' },
              { icon: <Clock size={22} />, title: 'Fast delivery', desc: 'Hot pizza at your door in about 30 min' },
              { icon: <Shield size={22} />, title: 'Fresh produce', desc: 'Ingredients delivered daily' },
              { icon: <Truck size={22} />, title: 'Free delivery', desc: 'For orders over €10.00' },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  padding: '36px 32px', borderRight: i < 3 ? '1px solid var(--c-border)' : 'none',
                  display: 'flex', flexDirection: 'column', gap: 16,
                }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: 'rgba(232,66,10,0.12)', border: '1px solid rgba(232,66,10,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--c-fire2)',
                }}>{f.icon}</div>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--c-cream)', marginBottom: 6 }}>{f.title}</h3>
                  <p style={{ color: 'var(--c-muted)', fontSize: '0.85rem', lineHeight: 1.7 }}>{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR */}
      <section style={{ padding: '100px 0' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56, flexWrap: 'wrap', gap: 20 }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Star size={14} color="var(--c-gold)" fill="var(--c-gold)" />
                <span style={{ color: 'var(--c-gold)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Best sellers
                </span>
              </div>
              <h2 className="section-title">Guest favorites</h2>
            </div>
            <button className="btn-ghost" onClick={() => navigate('/menu')}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              Full menu <ArrowRight size={16} />
            </button>
          </motion.div>

          {popular.length === 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{
                  height: 360, background: 'var(--c-surface)', borderRadius: 'var(--r-lg)',
                  border: '1px solid var(--c-border)',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
              {popular.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          )}
        </div>
      </section>

      {/* EXTRA INFO */}
      <section style={{ padding: '0 0 100px' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              background: 'linear-gradient(140deg, rgba(255,255,255,0.02), rgba(232,66,10,0.08))',
              border: '1px solid var(--c-border)',
              borderRadius: 'var(--r-xl)',
              padding: 'clamp(28px, 4vw, 42px)',
            }}
          >
            <div style={{ marginBottom: 26 }}>
              <span className="tag tag-gold" style={{ marginBottom: 12 }}>Behind the scenes</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', lineHeight: 1.15 }}>
                How we cook and deliver
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="home-info-grid">
              {[
                {
                  title: 'Wood-fired bake',
                  text: 'Every pizza is baked at 485°C on stone, creating a crisp edge and juicy center.',
                  extra: 'Average bake time: 90 seconds',
                },
                {
                  title: 'Ingredient control',
                  text: 'Our dough ferments for 24 hours, and vegetables, sauces, and cheese are refreshed daily.',
                  extra: 'Batches are checked before every shift',
                },
                {
                  title: 'Transparent delivery',
                  text: 'After checkout you can follow every stage: confirmed, in oven, packed, courier, delivered.',
                  extra: 'Average delivery checkpoint: 29 min',
                },
                {
                  title: 'Support 7 days a week',
                  text: 'If anything goes wrong, our team resolves it quickly and can prioritize a replacement order.',
                  extra: 'Care team response within ~2 min',
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  style={{
                    background: 'rgba(13,11,8,0.6)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 'var(--r-lg)',
                    padding: '22px 22px 20px',
                  }}
                >
                  <div style={{ color: 'var(--c-fire2)', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>
                    Step 0{index + 1}
                  </div>
                  <h3 style={{ fontSize: '1.08rem', marginBottom: 10, color: 'var(--c-cream)' }}>{item.title}</h3>
                  <p style={{ color: 'var(--c-muted)', fontSize: '0.9rem', lineHeight: 1.75, marginBottom: 12 }}>{item.text}</p>
                  <p style={{ color: 'var(--c-gold2)', fontSize: '0.82rem' }}>{item.extra}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHY US */}
      <section style={{ padding: '0 0 90px' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: 24 }}
          >
            <span className="tag tag-fire" style={{ marginBottom: 10 }}>Why choose us</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.7rem)' }}>
              More than pizza delivery
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 24 }} className="home-why-grid">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{
                border: '1px solid var(--c-border)',
                borderRadius: 'var(--r-lg)',
                padding: '24px 24px 20px',
                background: 'rgba(255,255,255,0.02)',
              }}
            >
              <p style={{ color: 'var(--c-muted)', lineHeight: 1.9, marginBottom: 18 }}>
                We do not simply dispatch orders. We control the full cycle from dough freshness
                to the handoff at your door, so food arrives hot and flavor stays consistent every day.
              </p>
              <ul style={{ listStyle: 'none', display: 'grid', gap: 10 }}>
                {[
                  '24-hour long-fermented dough',
                  'Real-time oven temperature control',
                  'Ventilated packaging for crispy crust',
                  'Fast refund or replacement support',
                ].map(point => (
                  <li key={point} style={{ color: 'var(--c-text)', fontSize: '0.92rem' }}>
                    • {point}
                  </li>
                ))}
              </ul>
            </motion.div>

            <div style={{ display: 'grid', gap: 14 }}>
              {[
                { k: '4.9/5', t: 'average rating' },
                { k: '29 min', t: 'average city delivery time' },
                { k: '98%', t: 'orders without delays' },
              ].map((item, idx) => (
                <motion.div
                  key={item.t}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  style={{
                    border: '1px solid var(--c-border)',
                    borderRadius: 'var(--r-md)',
                    padding: '16px 18px',
                    background: 'rgba(232,66,10,0.08)',
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--c-fire2)' }}>{item.k}</div>
                  <div style={{ color: 'var(--c-muted)', fontSize: '0.86rem' }}>{item.t}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{
              background: 'linear-gradient(135deg, rgba(232,66,10,0.15), rgba(212,160,71,0.1))',
              border: '1px solid rgba(232,66,10,0.25)',
              borderRadius: 'var(--r-xl)', padding: 'clamp(48px, 8vw, 80px)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              flexWrap: 'wrap', gap: 32, position: 'relative', overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                right: 18,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 170,
                height: 170,
                borderRadius: '50%',
                border: '1px dashed rgba(240,192,96,0.35)',
                opacity: 0.45,
                pointerEvents: 'none',
                background: 'radial-gradient(circle, rgba(232,66,10,0.2) 0%, rgba(232,66,10,0.02) 65%, transparent 70%)',
              }}
            >
              <div style={{
                position: 'absolute',
                inset: 18,
                borderRadius: '50%',
                border: '1px solid rgba(240,192,96,0.24)',
              }} />
              <div style={{ position: 'absolute', left: 20, bottom: 28, width: 14, height: 14, borderRadius: '50%', background: 'rgba(232,66,10,0.45)' }} />
              <div style={{ position: 'absolute', right: 36, top: 28, width: 18, height: 18, borderRadius: '50%', background: 'rgba(232,66,10,0.38)' }} />
              <div style={{ position: 'absolute', right: 24, bottom: 42, width: 12, height: 12, borderRadius: '50%', background: 'rgba(240,192,96,0.5)' }} />
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, marginBottom: 12 }}>
                First order?<br />
                <span style={{ color: 'var(--c-fire)' }}>15% off</span>
              </h2>
              <p style={{ color: 'var(--c-muted)', maxWidth: 400 }}>
                Sign up and unlock a first-order discount. Minimum order amount is €6.00.
              </p>
            </div>
            <button className="btn-primary" onClick={() => navigate('/auth')}
              style={{ padding: '16px 40px', fontSize: '1rem', whiteSpace: 'nowrap' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative', zIndex: 1 }}>
                Sign up <ArrowRight size={18} />
              </span>
            </button>
          </motion.div>
        </div>
      </section>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @media (max-width: 980px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            padding-top: 110px !important;
            padding-bottom: 56px !important;
            gap: 18px !important;
          }

          .hero-pizza-image {
            display: none !important;
          }

          .home-info-grid {
            grid-template-columns: 1fr !important;
          }

          .home-why-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 640px) {
          .hero-grid {
            padding-top: 100px !important;
            padding-bottom: 44px !important;
          }
        }
      `}</style>
    </>
  )
}
