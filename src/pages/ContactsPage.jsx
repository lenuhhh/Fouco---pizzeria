import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, Flame, Car, Train } from 'lucide-react'
import toast from 'react-hot-toast'
import { useT } from '../lib/i18n'

export default function ContactsPage() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)
  const t = useT()

  const FAQS = [
    { q: t('contacts_faq1_q'), a: t('contacts_faq1_a') },
    { q: t('contacts_faq2_q'), a: t('contacts_faq2_a') },
    { q: t('contacts_faq3_q'), a: t('contacts_faq3_a') },
    { q: t('contacts_faq4_q'), a: t('contacts_faq4_a') },
    { q: t('contacts_faq5_q'), a: t('contacts_faq5_a') },
  ]

  function handleSend(e) {
    e.preventDefault()
    if (!form.name || !form.phone) { toast.error(t('contacts_form_required')); return }
    setSent(true)
    toast.success(t('contacts_form_toast'))
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 80 }}>
      {/* Hero */}
      <section style={{
        padding: '80px 0 60px',
        background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(232,66,10,0.15), transparent 70%)',
        borderBottom: '1px solid var(--c-border)',
        marginBottom: 80,
      }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <span className="tag tag-fire" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Flame size={11} fill="currentColor" /> {t('contacts_hero_tag')}
              </span>
            </div>
            <h1 className="section-title" style={{ marginBottom: 16 }}>
              {t('contacts_hero_title')}<br />
              <span style={{ color: 'var(--c-fire)', fontStyle: 'italic' }}>{t('contacts_hero_title2')}</span>
            </h1>
            <p style={{ color: 'var(--c-muted)', fontSize: '1.05rem', maxWidth: 500, lineHeight: 1.8 }}>
              {t('contacts_hero_sub')}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48, marginBottom: 80 }}>
          {/* Contact info cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              {
                icon: <Phone size={22} />,
                title: t('contacts_card_phone_title'),
                main: '+38 044 555 01 99',
                sub: t('contacts_card_phone_sub'),
              },
              {
                icon: <Mail size={22} />,
                title: t('contacts_card_email_title'),
                main: 'hello@fuoco.ua',
                sub: t('contacts_card_email_sub'),
              },
              {
                icon: <MapPin size={22} />,
                title: t('contacts_card_address_title'),
                main: t('contacts_card_address_main'),
                sub: t('contacts_card_address_sub'),
              },
              {
                icon: <Clock size={22} />,
                title: t('contacts_card_hours_title'),
                main: t('contacts_card_hours_main'),
                sub: t('contacts_card_hours_sub'),
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: 'var(--c-surface)',
                  border: '1px solid var(--c-border)',
                  borderRadius: 'var(--r-lg)',
                  padding: '24px 28px',
                  display: 'flex', alignItems: 'flex-start', gap: 18,
                  transition: 'border-color 0.25s',
                }}
                whileHover={{ borderColor: 'rgba(232,66,10,0.3)' }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                  background: 'rgba(232,66,10,0.1)', border: '1px solid rgba(232,66,10,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--c-fire)',
                }}>{card.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: 'var(--c-muted)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{card.title}</div>
                  <div style={{ color: 'var(--c-cream)', fontWeight: 600, fontSize: '1rem', marginBottom: 4 }}>{card.main}</div>
                  <div style={{ color: 'var(--c-muted)', fontSize: '0.82rem', lineHeight: 1.6 }}>{card.sub}</div>
                </div>
              </motion.div>
            ))}

            {/* How to get here */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              style={{
                background: 'linear-gradient(135deg, rgba(232,66,10,0.08), rgba(212,160,71,0.06))',
                border: '1px solid rgba(232,66,10,0.2)',
                borderRadius: 'var(--r-lg)', padding: '24px 28px',
              }}
            >
              <h3 style={{ fontWeight: 700, color: 'var(--c-cream)', marginBottom: 16, fontSize: '0.95rem' }}>{t('contacts_howto_title')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <Train size={16} color="var(--c-fire)" style={{ marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <div style={{ color: 'var(--c-cream)', fontSize: '0.88rem', fontWeight: 500 }}>{t('contacts_metro_title')}</div>
                    <div style={{ color: 'var(--c-muted)', fontSize: '0.8rem' }}>{t('contacts_metro_sub')}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <Car size={16} color="var(--c-gold)" style={{ marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <div style={{ color: 'var(--c-cream)', fontSize: '0.88rem', fontWeight: 500 }}>{t('contacts_parking_title')}</div>
                    <div style={{ color: 'var(--c-muted)', fontSize: '0.8rem' }}>{t('contacts_parking_sub')}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          >
            <div style={{
              background: 'var(--c-surface)', border: '1px solid var(--c-border)',
              borderRadius: 'var(--r-xl)', padding: '40px 36px',
            }}>
              {sent ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  style={{ textAlign: 'center', padding: '40px 0' }}>
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                    style={{ fontSize: 64, marginBottom: 24 }}
                  >✅</motion.div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: 12 }}>{t('contacts_sent_title')}</h3>
                  <p style={{ color: 'var(--c-muted)', lineHeight: 1.8 }}>
                    {t('contacts_sent_sub')}
                  </p>
                  <button className="btn-primary" onClick={() => setSent(false)} style={{ marginTop: 32, padding: '12px 32px' }}>
                    <span style={{ position: 'relative', zIndex: 1 }}>{t('contacts_sent_again')}</span>
                  </button>
                </motion.div>
              ) : (
                <>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, marginBottom: 8 }}>
                    {t('contacts_form_title')}
                  </h2>
                  <p style={{ color: 'var(--c-muted)', marginBottom: 32, fontSize: '0.9rem' }}>
                    {t('contacts_form_sub')}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', color: 'var(--c-muted)', fontSize: '0.8rem', marginBottom: 8, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        {t('contacts_form_name_label')}
                      </label>
                      <input
                        className="input-field"
                        placeholder="Ivan Petrenko"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', color: 'var(--c-muted)', fontSize: '0.8rem', marginBottom: 8, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        {t('contacts_form_phone_label')}
                      </label>
                      <input
                        className="input-field"
                        placeholder="+38 044 555 01 99"
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', color: 'var(--c-muted)', fontSize: '0.8rem', marginBottom: 8, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        {t('contacts_form_message_label')}
                      </label>
                      <textarea
                        className="input-field"
                        placeholder={t('contacts_form_message_placeholder')}
                        rows={5}
                        value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })}
                        style={{ resize: 'vertical' }}
                      />
                    </div>

                    <motion.button
                      className="btn-primary"
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={handleSend}
                      style={{ padding: '16px', fontSize: '1rem', width: '100%', justifyContent: 'center', marginTop: 8 }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative', zIndex: 1 }}>
                        <Send size={18} /> {t('contacts_form_send_btn')}
                      </span>
                    </motion.button>

                    <p style={{ color: 'var(--c-muted)', fontSize: '0.75rem', textAlign: 'center' }}>
                      {t('contacts_form_privacy')}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Map placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              style={{
                marginTop: 24, borderRadius: 'var(--r-xl)', overflow: 'hidden',
                background: 'var(--c-bg3)', border: '1px solid var(--c-border)',
                height: 200,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
                position: 'relative',
              }}
            >
              <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(ellipse at center, rgba(232,66,10,0.08), transparent 70%)',
              }} />
              <MapPin size={32} color="var(--c-fire)" />
              <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--c-cream)', fontWeight: 600, marginBottom: 4 }}>{t('contacts_map_address')}</div>
              <div style={{ color: 'var(--c-muted)', fontSize: '0.85rem' }}>{t('contacts_map_sub')}</div>
              </div>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ zIndex: 1 }}
              >
                <button className="btn-ghost" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
                  {t('contacts_map_btn')}
                </button>
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* FAQ */}
        <motion.section
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        >
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <span className="tag tag-gold">FAQ</span>
            </div>
            <h2 className="section-title">
              {t('contacts_faq_title1')} <span style={{ color: 'var(--c-fire)', fontStyle: 'italic' }}>{t('contacts_faq_title2')}</span>
            </h2>
          </div>

          <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                style={{
                  background: 'var(--c-surface)', border: '1px solid var(--c-border)',
                  borderRadius: 'var(--r-md)', overflow: 'hidden',
                  transition: 'border-color 0.2s',
                  borderColor: openFaq === i ? 'rgba(232,66,10,0.3)' : 'var(--c-border)',
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%', padding: '20px 24px', textAlign: 'left',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
                    color: 'var(--c-cream)', fontWeight: 600, fontSize: '0.95rem',
                  }}
                >
                  {faq.q}
                  <motion.div animate={{ rotate: openFaq === i ? 45 : 0 }} style={{ flexShrink: 0 }}>
                    <CheckCircle size={18} color={openFaq === i ? 'var(--c-fire)' : 'var(--c-muted)'} />
                  </motion.div>
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ padding: '0 24px 20px', color: 'var(--c-muted)', fontSize: '0.9rem', lineHeight: 1.8 }}
                  >
                    {faq.a}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  )
}
