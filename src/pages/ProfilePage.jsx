import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Phone, MapPin, Edit2, Save, LogOut, ShoppingBag, Settings } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, profile, setProfile, logout } = useAuthStore()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    full_name: profile?.full_name || user?.user_metadata?.full_name || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
  })

  // Sync form when profile loads from Supabase
  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || user?.user_metadata?.full_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
      })
    }
  }, [profile])

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🔐</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 12 }}>Authorization required</h2>
          <p style={{ color: 'var(--c-muted)', marginBottom: 32 }}>Sign in to open your profile</p>
          <button className="btn-primary" onClick={() => navigate('/auth')}>
            <span style={{ position: 'relative', zIndex: 1 }}>Sign in</span>
          </button>
        </motion.div>
      </div>
    )
  }

  async function saveProfile() {
    setSaving(true)
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, ...form })
      .select()
      .single()
    if (error) {
      toast.error('Failed to save profile')
    } else {
      setProfile(data)
      setEditing(false)
      toast.success('Profile updated!')
    }
    setSaving(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    logout()
    toast.success('Signed out successfully!')
    navigate('/')
  }

  const displayName = profile?.full_name || user?.user_metadata?.full_name || ''
  const avatar = (displayName || user?.email || '?').charAt(0).toUpperCase()

  return (
    <div style={{ minHeight: '100vh', padding: '48px 0 80px' }}>
      <div className="container" style={{ maxWidth: 720 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 40 }}>
          <h1 className="section-title">
            My <span style={{ color: 'var(--c-fire)', fontStyle: 'italic' }}>profile</span>
          </h1>
        </motion.div>

        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: 'linear-gradient(135deg, rgba(232,66,10,0.15), rgba(212,160,71,0.08))',
            border: '1px solid rgba(232,66,10,0.2)', borderRadius: 'var(--r-xl)',
            padding: '32px', marginBottom: 24,
            display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap',
          }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--c-fire), var(--c-gold))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 900,
              color: '#fff', flexShrink: 0,
              boxShadow: '0 8px 30px rgba(232,66,10,0.4)',
            }}
          >
            {avatar}
          </motion.div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, marginBottom: 4 }}>
              {displayName || 'New user'}
            </h2>
            <p style={{ color: 'var(--c-muted)', fontSize: '0.88rem' }}>{user.email}</p>
            <span className="tag tag-gold" style={{ marginTop: 10, display: 'inline-flex' }}>
              Regular guest
            </span>
          </div>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'var(--c-surface)', borderRadius: 'var(--r-lg)',
            border: '1px solid var(--c-border)', padding: 28, marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontSize: '1rem' }}>
              <Settings size={18} color="var(--c-fire)" /> Personal info
            </h3>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="btn-ghost"
                style={{ padding: '8px 16px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Edit2 size={14} /> Edit
              </button>
            ) : (
              <button
                onClick={saveProfile}
                disabled={saving}
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.82rem' }}
              >
                <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Save size={14} /> {saving ? 'Saving...' : 'Save'}
                </span>
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { icon: <User size={16} />, label: 'Name', key: 'full_name', placeholder: 'Your name' },
              { icon: <Phone size={16} />, label: 'Phone', key: 'phone', placeholder: '+49 30 5550 1990' },
              { icon: <MapPin size={16} />, label: 'Address', key: 'address', placeholder: 'Your delivery address' },
            ].map(field => (
              <div key={field.key}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, fontSize: '0.82rem', fontWeight: 500, color: 'var(--c-muted)' }}>
                  <span style={{ color: 'var(--c-fire)' }}>{field.icon}</span>
                  {field.label}
                </label>
                {editing ? (
                  <input
                    className="input-field"
                    value={form[field.key]}
                    onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                  />
                ) : (
                  <p style={{
                    padding: '12px 16px', background: 'var(--c-bg3)', borderRadius: 10,
                    color: form[field.key] ? 'var(--c-text)' : 'var(--c-muted)',
                    fontSize: '0.92rem',
                  }}>
                    {form[field.key] || field.placeholder}
                  </p>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}
        >
          <button
            className="btn-ghost"
            onClick={() => navigate('/orders')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'center', padding: '14px' }}
          >
            <ShoppingBag size={16} /> My orders
          </button>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'center',
              padding: '14px', borderRadius: 50, border: '1px solid rgba(239,68,68,0.3)',
              color: '#ef4444', background: 'rgba(239,68,68,0.08)', fontWeight: 500, fontSize: '0.9rem',
              transition: 'all 0.2s', cursor: 'pointer', fontFamily: 'var(--font-body)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)' }}
          >
            <LogOut size={16} /> Sign out
          </button>
        </motion.div>
      </div>
    </div>
  )
}
