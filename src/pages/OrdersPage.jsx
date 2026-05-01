import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Clock, CheckCircle, Truck, XCircle, ChefHat, Package } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store'
import { formatEUR } from '../lib/price'
import { useT } from '../lib/i18n'

const STATUS_CONFIG = {
  pending:     { labelKey: 'orders_status_pending', color: '#f59e0b', icon: Clock, bg: 'rgba(245,158,11,0.12)' },
  confirmed:   { labelKey: 'orders_status_confirmed', color: '#3b82f6', icon: CheckCircle, bg: 'rgba(59,130,246,0.12)' },
  preparing:   { labelKey: 'orders_status_preparing', color: 'var(--c-fire)', icon: ChefHat, bg: 'rgba(232,66,10,0.12)' },
  delivering:  { labelKey: 'orders_status_delivering', color: '#8b5cf6', icon: Truck, bg: 'rgba(139,92,246,0.12)' },
  delivered:   { labelKey: 'orders_status_delivered', color: '#10b981', icon: Package, bg: 'rgba(16,185,129,0.12)' },
  cancelled:   { labelKey: 'orders_status_cancelled', color: '#ef4444', icon: XCircle, bg: 'rgba(239,68,68,0.12)' },
}

function OrderCard({ order, index }) {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState([])
  const t = useT()
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
  const Icon = cfg.icon

  async function loadItems() {
    if (items.length > 0) { setOpen(!open); return }
    const { data } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', order.id)
    if (data) setItems(data)
    setOpen(true)
  }

  const date = new Date(order.created_at).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      style={{
        background: 'var(--c-surface)', borderRadius: 'var(--r-lg)',
        border: '1px solid var(--c-border)', overflow: 'hidden', marginBottom: 16,
      }}
    >
      <div
        onClick={loadItems}
        style={{
          padding: '20px 24px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', cursor: 'pointer',
          transition: 'background 0.2s', flexWrap: 'wrap', gap: 12,
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={20} color={cfg.color} />
          </div>
          <div>
            <p style={{ fontWeight: 600, marginBottom: 2, color: 'var(--c-cream)' }}>
              Order #{order.id.slice(-8).toUpperCase()}
            </p>
            <p style={{ color: 'var(--c-muted)', fontSize: '0.82rem' }}>{date}</p>
          </div>
          <span style={{
            padding: '4px 12px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600,
            background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}33`,
          }}>
            {t(cfg.labelKey)}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--c-gold2)' }}>
            {formatEUR(order.total)}
          </span>
          <div style={{ color: 'var(--c-muted)' }}>
            {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 24px 24px', borderTop: '1px solid var(--c-border)' }}>
              <div style={{ marginTop: 16 }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--c-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
                  {t('orders_items_label')}
                </p>
                {items.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--c-border)', fontSize: '0.9rem' }}>
                    <span>{item.product_name} × {item.quantity}</span>
                    <span style={{ color: 'var(--c-gold2)', fontWeight: 600 }}>
                      {formatEUR(item.product_price * item.quantity)}
                    </span>
                  </div>
                ))}
                {order.delivery_address && (
                  <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--c-bg3)', borderRadius: 10 }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--c-muted)', marginBottom: 4 }}>{t('orders_address_label')}</p>
                    <p style={{ fontSize: '0.88rem' }}>{order.delivery_address}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function OrdersPage() {
  const navigate = useNavigate()
  const user = useAuthStore(s => s.user)
  const t = useT()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setOrders(data)
        setLoading(false)
      })
  }, [user])

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🔐</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 12 }}>{t('orders_auth_title')}</h2>
          <p style={{ color: 'var(--c-muted)', marginBottom: 32 }}>{t('orders_auth_sub')}</p>
          <button className="btn-primary" onClick={() => navigate('/auth')}>
            <span style={{ position: 'relative', zIndex: 1 }}>{t('auth_signin_tab')}</span>
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', padding: '48px 0 80px' }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 40 }}>
          <h1 className="section-title">
            {t('orders_title1')} <span style={{ color: 'var(--c-fire)', fontStyle: 'italic' }}>{t('orders_title2')}</span>
          </h1>
        </motion.div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <div className="spinner" />
          </div>
        ) : orders.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🍕</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: 12 }}>{t('orders_empty_title')}</h3>
            <p style={{ color: 'var(--c-muted)', marginBottom: 32 }}>{t('orders_empty_sub')}</p>
            <button className="btn-primary" onClick={() => navigate('/menu')}>
              <span style={{ position: 'relative', zIndex: 1 }}>{t('nav_menu')}</span>
            </button>
          </motion.div>
        ) : (
          <div>
            {orders.map((order, i) => <OrderCard key={order.id} order={order} index={i} />)}
          </div>
        )}
      </div>
    </div>
  )
}
