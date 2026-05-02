import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Clock, Weight, Star } from 'lucide-react'
import { useCartStore } from '../store'
import toast from 'react-hot-toast'
import { formatEUR } from '../lib/price'
import { optimizeImageUrl } from '../lib/image'
import { useT } from '../lib/i18n'

export default function ProductCard({ product, index = 0, onTagClick }) {
  const [imgError, setImgError] = useState(false)
  const [added, setAdded] = useState(false)
  const addItem = useCartStore(s => s.addItem)
  const t = useT()

  function handleAdd(e) {
    e.stopPropagation()
    addItem(product)
    setAdded(true)
    toast.success(`${product.name} added to cart`)
    setTimeout(() => setAdded(false), 1200)
  }

  const fallbackImg = optimizeImageUrl('https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500', 520, 70)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      whileHover={{ y: -6 }}
      style={{
        background: 'var(--c-surface)', borderRadius: 'var(--r-lg)',
        border: '1px solid var(--c-border)', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        boxShadow: 'var(--shadow-card)', transition: 'border-color 0.3s',
        cursor: 'pointer',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(232,66,10,0.25)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--c-border)'}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
        <motion.img
          src={imgError ? fallbackImg : optimizeImageUrl(product.image_url || fallbackImg, 520, 70)}
          alt={product.name}
          loading="lazy"
          decoding="async"
          onError={() => setImgError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.4 }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(13,11,8,0.7) 0%, transparent 50%)',
        }} />
        {product.is_popular && (
          <div style={{ position: 'absolute', top: 12, left: 12 }}>
            <span className="tag tag-fire" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Star size={10} fill="currentColor" /> {t('menu_tag_bestseller')}
            </span>
          </div>
        )}
        {product.category === 'pizza' && (
          <div style={{ position: 'absolute', bottom: 12, right: 12 }}>
            <span style={{ fontSize: '1.4rem' }}>🍕</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <h3 style={{
          fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700,
          color: 'var(--c-cream)', lineHeight: 1.3,
        }}>{product.name}</h3>

        <p style={{ color: 'var(--c-muted)', fontSize: '0.83rem', lineHeight: 1.6, flex: 1 }}>
          {product.description}
        </p>

        <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
          {product.weight && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--c-muted)', fontSize: '0.78rem' }}>
              <Weight size={12} /> {product.weight}
            </span>
          )}
          {product.cooking_time > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--c-muted)', fontSize: '0.78rem' }}>
              <Clock size={12} /> {product.cooking_time} min
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
          <button
            type="button"
            onClick={() => onTagClick?.({ type: 'category', value: product.category })}
            style={{ fontSize: '0.72rem', padding: '3px 9px', borderRadius: 999, border: '1px solid var(--c-border)', color: 'var(--c-muted)' }}
          >
            {t(`menu_cat_${product.category}`)}
          </button>
          {product.is_popular && (
            <button
              type="button"
              onClick={() => onTagClick?.({ type: 'search', value: 'bestseller' })}
              style={{ fontSize: '0.72rem', padding: '3px 9px', borderRadius: 999, border: '1px solid rgba(232,66,10,0.35)', color: 'var(--c-fire2)' }}
            >
              {t('menu_tag_bestseller')}
            </button>
          )}
          {(product.cooking_time || 0) > 0 && (product.cooking_time || 0) <= 15 && (
            <button
              type="button"
              onClick={() => onTagClick?.({ type: 'search', value: 'fast' })}
              style={{ fontSize: '0.72rem', padding: '3px 9px', borderRadius: 999, border: '1px solid rgba(212,160,71,0.35)', color: 'var(--c-gold2)' }}
            >
              {t('menu_tag_fast')}
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700,
            color: 'var(--c-gold2)',
          }}>
            {formatEUR(product.price)}
          </span>

          <motion.button
            onClick={handleAdd}
            whileTap={{ scale: 0.9 }}
            style={{
              width: 40, height: 40, borderRadius: 50,
              background: added
                ? 'linear-gradient(135deg, #2d7a2d, #4caf50)'
                : 'linear-gradient(135deg, var(--c-fire), var(--c-fire2))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', transition: 'background 0.3s',
              boxShadow: added ? '0 4px 20px rgba(76,175,80,0.4)' : '0 4px 20px rgba(232,66,10,0.4)',
            }}
          >
            <motion.div
              animate={{ rotate: added ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Plus size={18} />
            </motion.div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
