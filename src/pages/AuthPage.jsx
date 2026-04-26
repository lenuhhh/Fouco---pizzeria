import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { supabase, IS_DEMO } from '../lib/supabase'
import { useAuthStore } from '../store'
import toast from 'react-hot-toast'

export default function AuthPage() {
  const navigate = useNavigate()
  const user = useAuthStore(s => s.user)
  const setUser = useAuthStore(s => s.setUser)
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [needsEmailConfirm, setNeedsEmailConfirm] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) navigate('/profile', { replace: true })
  }, [user, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setNeedsEmailConfirm(false)
    setLoading(true)

    try {
      if (mode === 'register') {
        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: { data: { full_name: form.name } },
        })
        if (error) throw error

        // If email confirmation is enabled, session is null until user confirms email.
        if (!data?.session) {
          setNeedsEmailConfirm(true)
          setMode('login')
          setError('Confirm your email and then sign in.')
          toast.success('Registration successful. Check your email for confirmation link.')
          return
        }

        if (data?.user) setUser(data.user)
        toast.success('Account created! Welcome to Fuoco 🔥')
        navigate('/profile')
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        })
        if (error) throw error
        if (data?.user) setUser(data.user)
        toast.success('Welcome back!')
        navigate('/profile')
      }
    } catch (err) {
      const msg = err.message.includes('Invalid login') ? 'Incorrect email or password'
        : err.message.includes('already registered') ? 'This email is already registered'
        : err.message.includes('Password should be') ? 'Password must be at least 6 characters'
        : err.message.toLowerCase().includes('email not confirmed') ? 'Email not confirmed. Please confirm email first.'
        : err.message
      if (msg.toLowerCase().includes('email not confirmed')) {
        setNeedsEmailConfirm(true)
      }
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  async function handleResendConfirmation() {
    if (!form.email) {
      setError('Enter your email to resend confirmation.')
      return
    }

    setResendLoading(true)
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: form.email,
      })
      if (error) throw error
      toast.success('Confirmation email sent. Check your inbox.')
    } catch (err) {
      setError(err.message || 'Failed to resend confirmation email')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
      background: 'radial-gradient(ellipse 60% 80% at 50% 0%, rgba(232,66,10,0.12), transparent 70%)',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: '100%', maxWidth: 440 }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <motion.div
            animate={{ rotate: [0, -8, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
            style={{ display: 'inline-block', marginBottom: 12 }}
          >
            <Flame size={40} color="var(--c-fire)" />
          </motion.div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
            Fuoco<span style={{ color: 'var(--c-fire)', fontStyle: 'italic' }}>.</span>
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--c-surface)', borderRadius: 'var(--r-xl)',
          border: '1px solid var(--c-border)', padding: '40px',
          boxShadow: 'var(--shadow-card)',
        }}>
          {IS_DEMO && (
            <div style={{
              marginBottom: 18,
              border: '1px solid rgba(212,160,71,0.35)',
              background: 'rgba(212,160,71,0.08)',
              borderRadius: 12,
              padding: '12px 14px',
              color: 'var(--c-gold2)',
              fontSize: '0.82rem',
              lineHeight: 1.6,
            }}>
              Demo mode is currently enabled. To use real signup and login with Supabase, set
              `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`, then restart the dev server.
            </div>
          )}

          {/* Tabs */}
          <div style={{
            display: 'flex', background: 'var(--c-bg3)', borderRadius: 50,
            padding: 4, marginBottom: 32,
          }}>
            {[['login', 'Sign in'], ['register', 'Register']].map(([m, label]) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m)
                  setError('')
                  setNeedsEmailConfirm(false)
                }}
                style={{
                  flex: 1, padding: '10px', borderRadius: 50, fontSize: '0.88rem', fontWeight: 600,
                  background: mode === m ? 'linear-gradient(135deg, var(--c-fire), var(--c-fire2))' : 'transparent',
                  color: mode === m ? '#fff' : 'var(--c-muted)',
                  transition: 'all 0.2s', cursor: 'pointer', border: 'none',
                  fontFamily: 'var(--font-body)',
                }}
              >{label}</button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AnimatePresence>
              {mode === 'register' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--c-muted)' }} />
                    <input
                      className="input-field"
                      placeholder="Your name"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      style={{ paddingLeft: 46 }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--c-muted)' }} />
              <input
                className="input-field"
                type="email"
                placeholder="Email"
                value={form.email}
                required
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                style={{ paddingLeft: 46 }}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--c-muted)' }} />
              <input
                className="input-field"
                type={showPw ? 'text' : 'password'}
                placeholder="Password"
                value={form.password}
                required
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                style={{ paddingLeft: 46, paddingRight: 46 }}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--c-muted)' }}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    color: '#ef4444', fontSize: '0.85rem', padding: '10px 14px',
                    background: 'rgba(239,68,68,0.1)', borderRadius: 8,
                    border: '1px solid rgba(239,68,68,0.2)',
                  }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              className="btn-primary"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '0.95rem', opacity: loading ? 0.7 : 1, marginTop: 8 }}
            >
              <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                {loading ? 'Please wait...' : (mode === 'login' ? 'Sign in' : 'Create account')}
                {!loading && <ArrowRight size={16} />}
              </span>
            </motion.button>

            {needsEmailConfirm && (
              <button
                type="button"
                onClick={handleResendConfirmation}
                className="btn-ghost"
                disabled={resendLoading}
                style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.88rem' }}
              >
                {resendLoading ? 'Sending...' : 'Resend confirmation email'}
              </button>
            )}
          </form>

          {mode === 'login' && (
            <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.82rem', color: 'var(--c-muted)' }}>
              No account yet?{' '}
              <span style={{ color: 'var(--c-fire2)', cursor: 'pointer', fontWeight: 600 }}
                onClick={() => setMode('register')}
              >Create one</span>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  )
}
