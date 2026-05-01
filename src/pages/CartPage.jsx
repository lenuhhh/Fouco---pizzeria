import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react'
import { useCartStore, useAuthStore } from '../store'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import { formatEUR } from '../lib/price'
import { optimizeImageUrl } from '../lib/image'

export default function CartPage() {
  const navigate = useNavigate()
  const { items, updateQty, removeItem, clearCart, total, count } = useCartStore()
  const user = useAuthStore(s => s.user)
  const [step, setStep] = useState(1) // 1=cart 2=checkout 3=done
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ address: '', phone: '', comment: '' })
  const [orderId, setOrderId] = useState(null)

  const deliveryFee = total() >= 1000 ? 0 : 150
  const finalTotal = total() + deliveryFee

  async function placeOrder() {
    if (!user) { navigate('/auth'); return }
    if (!form.address.trim() || !form.phone.trim()) {
      toast.error('Please fill in address and phone number')
      return
    }
    setLoading(true)
    try {
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total: finalTotal,
          delivery_address: form.address,
          phone: form.phone,
          comment: form.comment,
          status: 'confirmed',
        })
        .select()
        .single()
      if (error) throw error

      const orderItems = items.map(i => ({
        order_id: order.id,
        product_id: i.id,
        product_name: i.name,
        product_price: i.price,
        quantity: i.quantity,
      }))
      await supabase.from('order_items').insert(orderItems)

      setOrderId(order.id)
      clearCart()
      setStep(3)
    } catch (e) {
      toast.error('Checkout failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (step === 3) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: 'center', maxWidth: 480 }}
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{ fontSize: 80, marginBottom: 24 }}
          >🎉</motion.div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, marginBottom: 16 }}>
            Order confirmed!
          </h2>
          <p style={{ color: 'var(--c-muted)', marginBottom: 8, fontSize: '1.05rem' }}>
            Your pizza is already in the oven.
          </p>
          <p style={{ color: 'var(--c-muted)', fontSize: '0.88rem', marginBottom: 40 }}>
            Delivery estimate: around 30 minutes.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => navigate('/orders')}>
              <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                My orders <ArrowRight size={16} />
              </span>
            </button>
            <button className="btn-ghost" onClick={() => navigate('/menu')}>
              Order more
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', padding: '48px 0 80px' }}>
      <div className="container" style={{ maxWidth: 900 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 40 }}
        >
          <button
            onClick={() => step === 1 ? navigate('/menu') : setStep(1)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--c-muted)', marginBottom: 20, fontSize: '0.9rem' }}
          >
            <ArrowLeft size={16} /> {step === 1 ? 'Continue shopping' : 'Back to cart'}
          </button>
          <h1 className="section-title">
            {step === 1 ? 'Cart' : 'Checkout'}
          </h1>
          {count() > 0 && step === 1 && (
            <p style={{ color: 'var(--c-muted)', marginTop: 8 }}>{count()} items</p>
          )}
        </motion.div>

        {count() === 0 && step === 1 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '80px 0' }}
          >
            <div style={{ fontSize: 72, marginBottom: 20 }}>🛒</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: 12 }}>Your cart is empty</h3>
            <p style={{ color: 'var(--c-muted)', marginBottom: 32 }}>Add something delicious</p>
            <button className="btn-primary" onClick={() => navigate('/menu')}>
              <span style={{ position: 'relative', zIndex: 1 }}>Open menu</span>
            </button>
          </motion.div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'start' }}>
            {/* LEFT */}
            <div>
              {step === 1 ? (
                <AnimatePresence>
                  {items.map(item => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      style={{
                        display: 'flex', gap: 16, padding: 20,
                        background: 'var(--c-surface)', borderRadius: 'var(--r-md)',
                        border: '1px solid var(--c-border)', marginBottom: 12,
                        alignItems: 'center',
                      }}
                    >
                      <img
                        src={optimizeImageUrl(item.image_url || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100', 144, 68)}
                        alt={item.name}
                        loading="lazy"
                        decoding="async"
                        style={{ width: 72, height: 72, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }}
                        onError={e => e.target.src = optimizeImageUrl('https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100', 144, 68)}
                      />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontWeight: 600, marginBottom: 4, color: 'var(--c-cream)' }}>{item.name}</h4>
                        <p style={{ color: 'var(--c-gold2)', fontWeight: 700 }}>{formatEUR(item.price)}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          style={{
                            width: 32, height: 32, borderRadius: 8,
                            background: 'var(--c-bg3)', border: '1px solid var(--c-border)',
                            color: 'var(--c-text)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        ><Minus size={14} /></button>
                        <span style={{ width: 28, textAlign: 'center', fontWeight: 600 }}>{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          style={{
                            width: 32, height: 32, borderRadius: 8,
                            background: 'var(--c-fire)', color: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        ><Plus size={14} /></button>
                      </div>
                      <p style={{ width: 80, textAlign: 'right', fontWeight: 700, color: 'var(--c-cream)' }}>
                        {formatEUR(item.price * item.quantity)}
                      </p>
                      <button onClick={() => removeItem(item.id)} style={{ color: 'var(--c-muted)', padding: 4, transition: 'color 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--c-fire)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--c-muted)'}
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              ) : (
                /* Checkout form */
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{ background: 'var(--c-surface)', borderRadius: 'var(--r-lg)', border: '1px solid var(--c-border)', padding: 32 }}
                >
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, marginBottom: 24 }}>
                    Delivery details
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: '0.88rem', color: 'var(--c-muted)' }}>
                        Delivery address *
                      </label>
                      <input
                        className="input-field"
                        placeholder="Khreshchatyk St 22, Kyiv"
                        value={form.address}
                        onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: '0.88rem', color: 'var(--c-muted)' }}>
                        Phone *
                      </label>
                      <input
                        className="input-field"
                        placeholder="+49 30 5550 1990"
                        value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: '0.88rem', color: 'var(--c-muted)' }}>
                        Comment
                      </label>
                      <textarea
                        className="input-field"
                        placeholder="Order notes..."
                        value={form.comment}
                        onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                        style={{ resize: 'vertical', minHeight: 100 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* RIGHT — Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              style={{
                background: 'var(--c-surface)', borderRadius: 'var(--r-lg)',
                border: '1px solid var(--c-border)', padding: 28,
                position: 'sticky', top: 96,
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, marginBottom: 20 }}>
                Your order
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                {items.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                    <span style={{ color: 'var(--c-muted)' }}>{item.name} × {item.quantity}</span>
                    <span>{formatEUR(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid var(--c-border)', paddingTop: 16, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--c-muted)' }}>Subtotal</span>
                  <span>{formatEUR(total())}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--c-muted)' }}>Delivery</span>
                  <span style={{ color: deliveryFee === 0 ? '#4caf50' : 'var(--c-text)' }}>
                    {deliveryFee === 0 ? 'Free' : formatEUR(deliveryFee)}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <p style={{ fontSize: '0.78rem', color: 'var(--c-muted)', marginBottom: 12 }}>
                    Add {formatEUR(1000 - total())} more for free delivery
                  </p>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.2rem' }}>
                  <span style={{ fontFamily: 'var(--font-display)' }}>Total</span>
                  <span style={{ color: 'var(--c-gold2)' }}>{formatEUR(finalTotal)}</span>
                </div>
              </div>

              {step === 1 ? (
                <button
                  className="btn-primary"
                  onClick={() => { if (!user) { navigate('/auth'); return } setStep(2) }}
                  style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '0.95rem' }}
                >
                  <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ShoppingBag size={16} /> Proceed to checkout
                  </span>
                </button>
              ) : (
                <button
                  className="btn-primary"
                  onClick={placeOrder}
                  disabled={loading}
                  style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '0.95rem', opacity: loading ? 0.7 : 1 }}
                >
                  <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                    {loading ? 'Placing order...' : `Pay ${formatEUR(finalTotal)}`}
                  </span>
                </button>
              )}

              {!user && (
                <p style={{ marginTop: 12, fontSize: '0.8rem', color: 'var(--c-muted)', textAlign: 'center' }}>
                  Please <span style={{ color: 'var(--c-fire2)', cursor: 'pointer' }} onClick={() => navigate('/auth')}>sign in</span> to place an order
                </p>
              )}
            </motion.div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .cart-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
