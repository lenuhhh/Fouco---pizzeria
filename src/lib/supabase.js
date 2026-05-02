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

// ─── Demo localStorage auth ───────────────────────────────────────────────────
const DEMO_USERS_KEY = 'fuoco_demo_users'
const DEMO_SESSION_KEY = 'fuoco_demo_session'

function getDemoUsers() {
  try { return JSON.parse(localStorage.getItem(DEMO_USERS_KEY) || '[]') } catch { return [] }
}
function saveDemoUsers(users) { localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users)) }
function getDemoSession() {
  try { return JSON.parse(localStorage.getItem(DEMO_SESSION_KEY) || 'null') } catch { return null }
}
function saveDemoSession(session) { localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(session)) }
function clearDemoSession() { localStorage.removeItem(DEMO_SESSION_KEY) }

let _authChangeListeners = []
function notifyAuthChange(event, session) {
  _authChangeListeners.forEach(cb => cb(event, session))
}

function makeSession(user) {
  return { access_token: 'demo_' + user.id, user }
}

const mockAuth = {
  getSession: () => {
    const session = getDemoSession()
    return Promise.resolve({ data: { session }, error: null })
  },
  onAuthStateChange: (callback) => {
    _authChangeListeners.push(callback)
    return { data: { subscription: { unsubscribe: () => {
      _authChangeListeners = _authChangeListeners.filter(cb => cb !== callback)
    } } } }
  },
  signInWithPassword: ({ email, password }) => {
    const normalizedEmail = (email || '').trim().toLowerCase()
    const users = getDemoUsers()
    const user = users.find(u => u.email === normalizedEmail && u.password === password)
    if (!user) return Promise.resolve({ data: {}, error: { message: 'Invalid login credentials' } })
    const session = makeSession(user)
    saveDemoSession(session)
    notifyAuthChange('SIGNED_IN', session)
    return Promise.resolve({ data: { user, session }, error: null })
  },
  signUp: ({ email, password, options }) => {
    const normalizedEmail = (email || '').trim().toLowerCase()
    const users = getDemoUsers()
    if (users.find(u => u.email === normalizedEmail)) {
      return Promise.resolve({ data: {}, error: { message: 'User already registered' } })
    }
    const user = {
      id: 'demo_' + Date.now(),
      email: normalizedEmail,
      password,
      user_metadata: { full_name: options?.data?.full_name || '' },
    }
    saveDemoUsers([...users, user])
    const session = makeSession(user)
    saveDemoSession(session)
    notifyAuthChange('SIGNED_IN', session)
    return Promise.resolve({ data: { user, session }, error: null })
  },
  resend: () => Promise.resolve({ data: {}, error: null }),
  signOut: () => {
    clearDemoSession()
    notifyAuthChange('SIGNED_OUT', null)
    return Promise.resolve({ error: null })
  },
}

// ─── Demo profiles store ──────────────────────────────────────────────────────
const DEMO_PROFILES_KEY = 'fuoco_demo_profiles'
function getDemoProfiles() {
  try { return JSON.parse(localStorage.getItem(DEMO_PROFILES_KEY) || '[]') } catch { return [] }
}
function saveDemoProfiles(p) { localStorage.setItem(DEMO_PROFILES_KEY, JSON.stringify(p)) }

function mockProfilesBuilder(userId) {
  const profiles = getDemoProfiles()
  const row = profiles.find(p => p.id === userId) || null
  let _upsertData = null
  const builder = {
    select() { return builder },
    eq() { return builder },
    single() { return Promise.resolve({ data: row, error: row ? null : { message: 'not found' } }) },
    upsert(data) {
      _upsertData = data
      const list = getDemoProfiles().filter(p => p.id !== data.id)
      saveDemoProfiles([...list, data])
      return { select() { return { single() { return Promise.resolve({ data, error: null }) } } } }
    },
  }
  return builder
}

const mockClient = {
  auth: mockAuth,
  from: (table) => {
    if (table === 'products') return mockQueryBuilder(MOCK_PRODUCTS)
    if (table === 'profiles') {
      const session = getDemoSession()
      return mockProfilesBuilder(session?.user?.id)
    }
    return mockQueryBuilder([])
  },
}

export const supabase = isConfigured ? createClient(supabaseUrl, supabaseAnonKey) : mockClient
export const IS_DEMO = !isConfigured
