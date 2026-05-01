import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { MOCK_PRODUCTS } from '../lib/mockData'
import ProductCard from '../components/ProductCard'
import { useT } from '../lib/i18n'

const CATEGORIES = [
  { id: 'all', emoji: '🍽️', labelKey: 'menu_cat_all' },
  { id: 'pizza', emoji: '🍕', labelKey: 'menu_cat_pizza' },
  { id: 'pasta', emoji: '🍝', labelKey: 'menu_cat_pasta' },
  { id: 'starters', emoji: '🥗', labelKey: 'menu_cat_starters' },
  { id: 'desserts', emoji: '🍰', labelKey: 'menu_cat_desserts' },
  { id: 'drinks', emoji: '🥤', labelKey: 'menu_cat_drinks' },
]

export default function MenuPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('popular')
  const t = useT()

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_available', true)
      .order('is_popular', { ascending: false })

    if (error || !data || data.length === 0) {
      const fallback = MOCK_PRODUCTS
        .filter(p => p.is_available)
        .sort((a, b) => (b.is_popular ? 1 : 0) - (a.is_popular ? 1 : 0))
      setProducts(fallback)
    } else {
      setProducts(data)
    }

    setLoading(false)
  }

  const filtered = products
    .filter(p => category === 'all' || p.category === category)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'popular') return (b.is_popular ? 1 : 0) - (a.is_popular ? 1 : 0)
      if (sort === 'price_asc') return a.price - b.price
      if (sort === 'price_desc') return b.price - a.price
      return 0
    })

  return (
    <div style={{ minHeight: '100vh', padding: '48px 0 80px' }}>
      {/* Header */}
      <div style={{ padding: '48px 0 32px', borderBottom: '1px solid var(--c-border)', marginBottom: 48 }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="section-title" style={{ marginBottom: 8 }}>
              {t('menu_title1')} <span style={{ color: 'var(--c-fire)', fontStyle: 'italic' }}>{t('menu_title2')}</span>
            </h1>
            <p style={{ color: 'var(--c-muted)' }}>{t('menu_sub')}</p>
          </motion.div>
        </div>
      </div>

      <div className="container">
        {/* Search + Sort */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--c-muted)' }} />
            <input
              className="input-field"
              placeholder={t('menu_search_placeholder')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 46 }}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <SlidersHorizontal size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--c-muted)', pointerEvents: 'none' }} />
            <select
              className="input-field"
              value={sort}
              onChange={e => setSort(e.target.value)}
              style={{ paddingLeft: 42, paddingRight: 16, appearance: 'none', minWidth: 180, cursor: 'pointer' }}
            >
              <option value="popular">{t('menu_sort_popular')}</option>
              <option value="price_asc">{t('menu_sort_price_asc')}</option>
              <option value="price_desc">{t('menu_sort_price_desc')}</option>
            </select>
          </div>
        </div>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 48, flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <motion.button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '10px 20px', borderRadius: 50,
                background: category === cat.id
                  ? 'linear-gradient(135deg, var(--c-fire), var(--c-fire2))'
                  : 'var(--c-surface)',
                border: category === cat.id ? 'none' : '1px solid var(--c-border)',
                color: category === cat.id ? '#fff' : 'var(--c-muted)',
                fontWeight: category === cat.id ? 600 : 400,
                fontSize: '0.88rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
                transition: 'all 0.2s',
              }}
            >
              <span>{cat.emoji}</span> {t(cat.labelKey)}
            </motion.button>
          ))}
        </div>

        {/* Products grid */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <div className="spinner" />
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '80px 0', color: 'var(--c-muted)' }}
          >
            <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
            <p style={{ fontSize: '1.1rem' }}>{t('menu_empty')}</p>
            <p style={{ fontSize: '0.88rem', marginTop: 8 }}>{t('menu_empty_sub')}</p>
          </motion.div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
