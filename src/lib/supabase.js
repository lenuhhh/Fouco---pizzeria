import { createClient } from '@supabase/supabase-js'
import { MOCK_PRODUCTS } from './mockData'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

const hasValidUrl = supabaseUrl
  && !supabaseUrl.includes('your-project')
  && supabaseUrl.startsWith('https://')

const hasValidAnonKey = supabaseAnonKey
  && !supabaseAnonKey.includes('your-anon-key')
  && !supabaseAnonKey.includes('your_supabase_anon_key')

const isConfigured = hasValidUrl && hasValidAnonKey

function buildMockResult(data) {
  return Promise.resolve({ data, error: null })
}

function mockQueryBuilder(data) {
  const builder = {
    _data: [...data],
    select() { return builder },
    eq(col, val) { builder._data = builder._data.filter(r => r[col] === val); return builder },
    neq(col, val) { builder._data = builder._data.filter(r => r[col] !== val); return builder },
    order(col, opts = {}) {
      builder._data = [...builder._data].sort((a, b) => {
        if (opts.ascending === false) return a[col] > b[col] ? -1 : 1
        return a[col] < b[col] ? -1 : 1
      })
      return builder
    },
    limit(n) { builder._data = builder._data.slice(0, n); return builder },
    single() { return buildMockResult(builder._data[0] ?? null) },
    then(resolve) { return buildMockResult(builder._data).then(resolve) },
  }
  return builder
}

const mockAuth = {
  getSession: () => Promise.resolve({ data: { session: null }, error: null }),
  onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  signInWithPassword: () => Promise.resolve({ data: {}, error: { message: 'Supabase is not configured - demo mode is active' } }),
  signUp: () => Promise.resolve({ data: {}, error: { message: 'Supabase is not configured - demo mode is active' } }),
  resend: () => Promise.resolve({ data: {}, error: { message: 'Supabase is not configured - demo mode is active' } }),
  signOut: () => Promise.resolve({ error: null }),
}

const mockClient = {
  auth: mockAuth,
  from: (table) => {
    if (table === 'products') return mockQueryBuilder(MOCK_PRODUCTS)
    return mockQueryBuilder([])
  },
}

export const supabase = isConfigured ? createClient(supabaseUrl, supabaseAnonKey) : mockClient
export const IS_DEMO = !isConfigured
