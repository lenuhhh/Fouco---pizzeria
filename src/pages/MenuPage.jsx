import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { MOCK_PRODUCTS } from '../lib/mockData'
import ProductCard from '../components/ProductCard'
import { useT } from '../lib/i18n'

const FILTER_CHIPS = [
  { id: 'all', type: 'category', value: 'all', emoji: '🍽️', labelKey: 'menu_cat_all' },
  { id: 'pizza', type: 'category', value: 'pizza', emoji: '🍕', labelKey: 'menu_cat_pizza' },
  { id: 'pasta', type: 'category', value: 'pasta', emoji: '🍝', labelKey: 'menu_cat_pasta' },
  { id: 'starters', type: 'category', value: 'starters', emoji: '🥗', labelKey: 'menu_cat_starters' },
  { id: 'desserts', type: 'category', value: 'desserts', emoji: '🍰', labelKey: 'menu_cat_desserts' },
  { id: 'drinks', type: 'category', value: 'drinks', emoji: '🥤', labelKey: 'menu_cat_drinks' },
  { id: 'popular', type: 'search', value: 'bestseller', emoji: '🔥', labelKey: 'menu_tag_bestseller' },
  { id: 'fast', type: 'search', value: 'fast', emoji: '⚡', labelKey: 'menu_tag_fast' },
]

const SORT_OPTIONS = [
  { id: 'popular', labelKey: 'menu_sort_popular' },
  { id: 'price_asc', labelKey: 'menu_sort_price_asc' },
  { id: 'price_desc', labelKey: 'menu_sort_price_desc' },
  { id: 'name_asc', labelKey: 'menu_sort_name_asc' },
  { id: 'name_desc', labelKey: 'menu_sort_name_desc' },
  { id: 'time_asc', labelKey: 'menu_sort_time_asc' },
  { id: 'time_desc', labelKey: 'menu_sort_time_desc' },
]

function buildSearchIndex(product, t) {
  const categoryLabelKey = `menu_cat_${product.category}`
  const categoryLabel = t(categoryLabelKey)
  const tags = [
    product.name || '',
    product.description || '',
    product.category || '',
    categoryLabel || '',
    product.weight || '',
    String(product.cooking_time ?? ''),
    `${product.cooking_time || 0} min`,
    `${product.cooking_time || 0} хв`,
    ...(Array.isArray(product.tags) ? product.tags : []),
  ]

  if (product.is_popular) {
    tags.push('popular', 'bestseller', 'хіт', t('menu_tag_bestseller'))
  }

  if ((product.cooking_time || 0) > 0 && (product.cooking_time || 0) <= 15) {
    tags.push('fast', 'quick', 'швидко', t('menu_tag_fast'))
  }

  return tags.join(' ').toLowerCase()
}

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

  function applyTagFilter(tag) {
    if (tag.type === 'category') {
      setCategory(tag.value)
      setSearch('')
      return
    }

    setCategory('all')
    setSearch(tag.value)
  }

  function handleCategoryClick(nextCategory) {
    setCategory(nextCategory)
    setSearch('')
  }

  function isQuickTagActive(tag) {
    if (tag.type === 'category') return category === tag.value && search.trim() === ''
    return search.trim().toLowerCase() === tag.value.toLowerCase() && category === 'all'
  }

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
    .filter(p => {
      const query = search.trim().toLowerCase()
      if (!query) return true

      const searchIndex = buildSearchIndex(p, t)
      const terms = query.split(/\s+/).filter(Boolean)
      return terms.every(term => searchIndex.includes(term))
    })
    .sort((a, b) => {
      if (sort === 'popular') {
        const byPopular = (b.is_popular ? 1 : 0) - (a.is_popular ? 1 : 0)
        if (byPopular !== 0) return byPopular
        return a.name.localeCompare(b.name)
      }
      if (sort === 'price_asc') return a.price - b.price
      if (sort === 'price_desc') return b.price - a.price
      if (sort === 'name_asc') return a.name.localeCompare(b.name)
      if (sort === 'name_desc') return b.name.localeCompare(a.name)
      if (sort === 'time_asc') return (a.cooking_time || 0) - (b.cooking_time || 0)
      if (sort === 'time_desc') return (b.cooking_time || 0) - (a.cooking_time || 0)
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
        <div className="menu-controls-sticky">
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
            <div className="menu-sort-select" style={{ position: 'relative' }}>
              <SlidersHorizontal size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--c-muted)', pointerEvents: 'none' }} />
              <select
                className="input-field"
                value={sort}
                onChange={e => setSort(e.target.value)}
                style={{ paddingLeft: 42, paddingRight: 16, appearance: 'none', minWidth: 180, cursor: 'pointer' }}
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>{t(opt.labelKey)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="menu-sort-chips" aria-label={t('menu_sort_label')}>
            <div className="menu-sort-chips-title">
              <SlidersHorizontal size={14} />
              <span>{t('menu_sort_label')}</span>
            </div>
            <div className="menu-sort-chips-scroll">
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSort(opt.id)}
                  className={`menu-sort-chip ${sort === opt.id ? 'menu-sort-chip-active' : ''}`}
                >
                  {t(opt.labelKey)}
                </button>
              ))}
            </div>
          </div>

          <div className="menu-categories" style={{ display: 'flex', gap: 8, marginBottom: 48, flexWrap: 'wrap' }}>
            {FILTER_CHIPS.map(tag => {
              const active = isQuickTagActive(tag)
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => {
                    if (active) {
                      setSearch('')
                      setCategory('all')
                      return
                    }
                    applyTagFilter(tag)
                  }}
                  className="menu-category-btn"
                  style={{
                    padding: '10px 20px', borderRadius: 50,
                    background: active
                      ? 'linear-gradient(135deg, var(--c-fire), var(--c-fire2))'
                      : 'var(--c-surface)',
                    border: active ? 'none' : '1px solid var(--c-border)',
                    color: active ? '#fff' : 'var(--c-muted)',
                    fontWeight: active ? 600 : 400,
                    fontSize: '0.88rem', cursor: 'pointer',
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    transition: 'all 0.2s',
                  }}
                >
                  <span>{tag.emoji}</span>
                  {t(tag.labelKey)}
                </button>
              )
            })}
          </div>
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
              <ProductCard
                key={p.id}
                product={p}
                index={i}
                onTagClick={(tag) => applyTagFilter(tag)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
