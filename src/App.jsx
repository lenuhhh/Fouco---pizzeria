import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { supabase } from './lib/supabase'
import { useAuthStore } from './store'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import CartPage from './pages/CartPage'
import OrdersPage from './pages/OrdersPage'
import ProfilePage from './pages/ProfilePage'
import AuthPage from './pages/AuthPage'
import ContactsPage from './pages/ContactsPage'
import SiteMapPage from './pages/SiteMapPage'
import './index.css'

function ProtectedRoute({ children }) {
  const user = useAuthStore(s => s.user)
  if (!user) return <Navigate to="/auth" replace />
  return children
}

function GuestOnlyRoute({ children }) {
  const user = useAuthStore(s => s.user)
  if (user) return <Navigate to="/profile" replace />
  return children
}

export default function App() {
  const { setUser, setProfile, logout } = useAuthStore()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        fetchProfile(session.user.id, session.user)
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user)
        fetchProfile(session.user.id, session.user)
      } else {
        logout()
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId, authUser) {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()

    if (!error && data) {
      setProfile(data)
      return
    }

    if (authUser) {
      // Keep profile usable even if table is missing/unavailable.
      const fallbackProfile = {
        id: userId,
        full_name: authUser.user_metadata?.full_name || '',
        email: authUser.email || '',
        phone: '',
        address: '',
      }
      setProfile(fallbackProfile)

      // Try to persist profile when table exists.
      const { data: created } = await supabase
        .from('profiles')
        .upsert({ id: userId, full_name: fallbackProfile.full_name, email: fallbackProfile.email })
        .select()
        .single()
      if (created) setProfile(created)
    }
  }

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#241e18', color: '#f0e8dc',
            border: '1px solid rgba(255,255,255,0.08)',
            fontFamily: 'Raleway, sans-serif', fontSize: '0.9rem',
          },
          success: { iconTheme: { primary: '#e8420a', secondary: '#fff' } },
        }}
      />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="auth" element={<GuestOnlyRoute><AuthPage /></GuestOnlyRoute>} />
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="sitemap" element={<SiteMapPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
