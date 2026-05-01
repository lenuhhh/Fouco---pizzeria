import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Flame, Globe, Database, Layers, Code2, ShieldCheck,
  FileCode2, FolderOpen, ChevronDown, ChevronRight, Box,
  Table2, Key, Link2, Lock, Cpu, Package,
} from 'lucide-react'

const Section = ({ title, icon, color = 'var(--c-fire)', children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    style={{
      background: 'var(--c-surface)',
      border: '1px solid var(--c-border)',
      borderRadius: 'var(--r-xl)',
      overflow: 'hidden',
      marginBottom: 24,
    }}
  >
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '22px 28px',
      borderBottom: '1px solid var(--c-border)',
      background: 'rgba(255,255,255,0.02)',
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
        background: 'rgba(232,66,10,0.1)', border: '1px solid rgba(232,66,10,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color,
      }}>{icon}</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700 }}>{title}</h2>
    </div>
    <div style={{ padding: '24px 28px' }}>{children}</div>
  </motion.div>
)

const Badge = ({ children, color = 'rgba(232,66,10,0.15)', textColor = 'var(--c-fire2)' }) => (
  <span style={{
    display: 'inline-block', padding: '2px 10px', borderRadius: 20,
    background: color, color: textColor,
    fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em',
    textTransform: 'uppercase', marginLeft: 8,
  }}>{children}</span>
)

const Row = ({ label, value, mono = false }) => (
  <div style={{
    display: 'flex', gap: 12, padding: '10px 0',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    alignItems: 'flex-start',
  }}>
    <div style={{ minWidth: 180, color: 'var(--c-muted)', fontSize: '0.85rem', flexShrink: 0 }}>{label}</div>
    <div style={{
      color: 'var(--c-cream)', fontSize: '0.85rem', lineHeight: 1.6,
      fontFamily: mono ? 'monospace' : undefined,
    }}>{value}</div>
  </div>
)

const DBTable = ({ name, pk, fields, policies }) => {
  const [open, setOpen] = useState(false)
  return (
    <div style={{
      border: '1px solid var(--c-border)', borderRadius: 'var(--r-md)',
      marginBottom: 12, overflow: 'hidden',
    }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', padding: '14px 20px',
          display: 'flex', alignItems: 'center', gap: 10,
          color: 'var(--c-cream)', fontWeight: 600, fontSize: '0.92rem',
          background: 'rgba(255,255,255,0.02)', textAlign: 'left',
        }}
      >
        <Table2 size={15} color="var(--c-gold2)" />
        <span style={{ fontFamily: 'monospace' }}>{name}</span>
        <span style={{ flex: 1 }} />
        {open ? <ChevronDown size={14} color="var(--c-muted)" /> : <ChevronRight size={14} color="var(--c-muted)" />}
      </button>
      {open && (
        <div style={{ padding: '0 20px 16px', borderTop: '1px solid var(--c-border)' }}>
          <div style={{ marginTop: 12, marginBottom: 8, color: 'var(--c-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Columns</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ color: 'var(--c-muted)' }}>
                <th style={{ textAlign: 'left', padding: '6px 8px', fontWeight: 600 }}>Column</th>
                <th style={{ textAlign: 'left', padding: '6px 8px', fontWeight: 600 }}>Type</th>
                <th style={{ textAlign: 'left', padding: '6px 8px', fontWeight: 600 }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {fields.map(f => (
                <tr key={f.col} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '6px 8px', fontFamily: 'monospace', color: f.col === pk ? 'var(--c-gold2)' : 'var(--c-cream)' }}>
                    {f.col === pk && <Key size={11} style={{ marginRight: 4, verticalAlign: 'middle' }} color="var(--c-gold2)" />}
                    {f.col}
                  </td>
                  <td style={{ padding: '6px 8px', fontFamily: 'monospace', color: 'var(--c-fire2)' }}>{f.type}</td>
                  <td style={{ padding: '6px 8px', color: 'var(--c-muted)' }}>{f.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {policies && (
            <>
              <div style={{ marginTop: 14, marginBottom: 6, color: 'var(--c-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Lock size={11} /> RLS Policies
              </div>
              {policies.map(p => (
                <div key={p} style={{ fontSize: '0.8rem', color: 'var(--c-muted)', padding: '3px 0', fontFamily: 'monospace' }}>· {p}</div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}

const FileTree = ({ items }) => (
  <div style={{ fontFamily: 'monospace', fontSize: '0.82rem', lineHeight: 2 }}>
    {items.map((item, i) => (
      <div key={i} style={{
        paddingLeft: item.indent * 20,
        color: item.type === 'folder' ? 'var(--c-gold2)' : item.type === 'entry' ? 'var(--c-fire2)' : 'var(--c-cream)',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        {item.type === 'folder'
          ? <FolderOpen size={13} />
          : item.type === 'entry'
            ? <FileCode2 size={13} />
            : <span style={{ display: 'inline-block', width: 13 }} />}
        <span>{item.name}</span>
        {item.desc && <span style={{ color: 'var(--c-muted)', fontFamily: 'var(--font-body)', fontSize: '0.78rem', marginLeft: 8 }}>{item.desc}</span>}
      </div>
    ))}
  </div>
)

export default function SiteMapPage() {
  return (
    <div style={{ minHeight: '100vh', paddingBottom: 80 }}>
      {/* Hero */}
      <section style={{
        padding: '80px 0 60px',
        background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(232,66,10,0.13), transparent 70%)',
        borderBottom: '1px solid var(--c-border)',
        marginBottom: 64,
      }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <span className="tag tag-fire" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Flame size={11} fill="currentColor" /> Technical documentation
              </span>
            </div>
            <h1 className="section-title" style={{ marginBottom: 16 }}>
              Site<br />
              <span style={{ color: 'var(--c-fire)', fontStyle: 'italic' }}>Structure</span>
            </h1>
            <p style={{ color: 'var(--c-muted)', fontSize: '1.05rem', maxWidth: 560, lineHeight: 1.8 }}>
              Full overview of the project architecture — frontend pages, components, state management, utilities, and database schema.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container" style={{ maxWidth: 900 }}>

        {/* Tech Stack */}
        <Section title="Tech Stack" icon={<Cpu size={18} />} delay={0}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {[
              { name: 'React 18', role: 'UI framework', tag: 'Frontend' },
              { name: 'Vite 8', role: 'Build tool & dev server', tag: 'Build' },
              { name: 'React Router v6', role: 'Client-side routing', tag: 'Routing' },
              { name: 'Zustand', role: 'Global state management', tag: 'State' },
              { name: 'Framer Motion', role: 'Animations & transitions', tag: 'UI' },
              { name: 'Supabase', role: 'Backend-as-a-Service', tag: 'Backend' },
              { name: 'PostgreSQL', role: 'Relational database', tag: 'DB' },
              { name: 'Lucide React', role: 'Icon library', tag: 'UI' },
              { name: 'React Hot Toast', role: 'Notifications', tag: 'UI' },
              { name: 'Intl API', role: 'UAH price formatting', tag: 'i18n' },
            ].map(t => (
              <div key={t.name} style={{
                background: 'var(--c-bg3)', border: '1px solid var(--c-border)',
                borderRadius: 'var(--r-md)', padding: '14px 16px',
              }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 4 }}>{t.name}</div>
                <div style={{ color: 'var(--c-muted)', fontSize: '0.78rem', marginBottom: 8 }}>{t.role}</div>
                <Badge color="rgba(212,160,71,0.15)" textColor="var(--c-gold2)">{t.tag}</Badge>
              </div>
            ))}
          </div>
        </Section>

        {/* File Structure */}
        <Section title="File Structure" icon={<FolderOpen size={18} />} delay={0.05}>
          <FileTree items={[
            { name: 'Fuoco---pizzeria/', type: 'folder', indent: 0, desc: 'project root' },
            { name: 'index.html', type: 'entry', indent: 1, desc: 'HTML entry point, SEO meta tags' },
            { name: 'vite.config.js', type: 'entry', indent: 1, desc: 'Vite build configuration' },
            { name: 'package.json', type: 'entry', indent: 1, desc: 'dependencies & scripts' },
            { name: 'public/', type: 'folder', indent: 1, desc: 'static assets served as-is' },
            { name: 'dist/', type: 'folder', indent: 1, desc: 'production build output (git-tracked)' },
            { name: 'supabase/', type: 'folder', indent: 1, desc: 'backend SQL scripts' },
            { name: 'setup.sql', type: 'entry', indent: 2, desc: 'full DB schema + RLS policies + triggers' },
            { name: 'src/', type: 'folder', indent: 1, desc: 'application source code' },
            { name: 'main.jsx', type: 'entry', indent: 2, desc: 'React app bootstrap / DOM mount' },
            { name: 'App.jsx', type: 'entry', indent: 2, desc: 'router config, auth listener, route guards' },
            { name: 'index.css', type: 'entry', indent: 2, desc: 'global CSS variables, base styles, responsive utils' },
            { name: 'components/', type: 'folder', indent: 2, desc: 'shared UI components' },
            { name: 'Layout.jsx', type: 'entry', indent: 3, desc: 'navbar, mobile menu, footer, responsive CSS' },
            { name: 'ProductCard.jsx', type: 'entry', indent: 3, desc: 'menu item card with image, price, add-to-cart' },
            { name: 'pages/', type: 'folder', indent: 2, desc: 'full-screen route pages' },
            { name: 'HomePage.jsx', type: 'entry', indent: 3, desc: 'hero, features, popular dishes, CTA sections' },
            { name: 'MenuPage.jsx', type: 'entry', indent: 3, desc: 'product grid with category filter tabs' },
            { name: 'CartPage.jsx', type: 'entry', indent: 3, desc: 'cart items, delivery form, order placement' },
            { name: 'OrdersPage.jsx', type: 'entry', indent: 3, desc: 'order history with status badges (auth required)' },
            { name: 'ProfilePage.jsx', type: 'entry', indent: 3, desc: 'user profile edit (auth required)' },
            { name: 'AuthPage.jsx', type: 'entry', indent: 3, desc: 'sign in / sign up form via Supabase Auth' },
            { name: 'ContactsPage.jsx', type: 'entry', indent: 3, desc: 'contact cards, how-to-get-here, FAQ, contact form' },
            { name: 'SiteMapPage.jsx', type: 'entry', indent: 3, desc: 'this page — project & DB documentation' },
            { name: 'lib/', type: 'folder', indent: 2, desc: 'utility functions & shared data' },
            { name: 'supabase.js', type: 'entry', indent: 3, desc: 'Supabase client init, IS_DEMO flag' },
            { name: 'mockData.js', type: 'entry', indent: 3, desc: 'MOCK_PRODUCTS array used in demo mode' },
            { name: 'price.js', type: 'entry', indent: 3, desc: 'formatEUR() — formats number as ₴X.XX' },
            { name: 'image.js', type: 'entry', indent: 3, desc: 'optimizeImageUrl() — Unsplash query params' },
            { name: 'store/', type: 'folder', indent: 2, desc: 'Zustand global stores' },
            { name: 'index.js', type: 'entry', indent: 3, desc: 'useCartStore + useAuthStore definitions' },
          ]} />
        </Section>

        {/* Pages */}
        <Section title="Pages & Routes" icon={<Globe size={18} />} delay={0.1}>
          {[
            { path: '/', name: 'HomePage', guard: null, desc: 'Landing page with hero banner, key features (wood-fired oven, fast delivery, fresh ingredients), popular dishes carousel, and call-to-action.' },
            { path: '/menu', name: 'MenuPage', guard: null, desc: 'Full product catalog. Filter tabs: Pizza, Pasta, Starters, Desserts, Drinks. Each card shows image, name, weight, cooking time, price, and Add to Cart button.' },
            { path: '/cart', name: 'CartPage', guard: null, desc: 'Shopping cart with quantity controls, delivery address & phone form. Shows subtotal, delivery fee (₴150, free from ₴1000), and total. Places order via Supabase.' },
            { path: '/orders', name: 'OrdersPage', guard: 'Auth required', desc: 'Order history list fetched from Supabase. Shows date, status badge (pending / confirmed / preparing / delivering / delivered / cancelled), items, and total.' },
            { path: '/profile', name: 'ProfilePage', guard: 'Auth required', desc: 'Edit user profile: full name, phone, saved delivery address. Data persisted in profiles table.' },
            { path: '/auth', name: 'AuthPage', guard: 'Guest only', desc: 'Sign In / Sign Up via Supabase Auth (email + password). Redirects to /profile on success.' },
            { path: '/contacts', name: 'ContactsPage', guard: null, desc: 'Contact cards (phone, email, address, hours), how-to-get-here section, contact form, map placeholder, and FAQ accordion.' },
            { path: '/sitemap', name: 'SiteMapPage', guard: null, desc: 'This page. Full project and database documentation.' },
          ].map(p => (
            <div key={p.path} style={{
              padding: '14px 0',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              display: 'grid', gridTemplateColumns: '160px 1fr', gap: 16, alignItems: 'start',
            }}>
              <div>
                <div style={{ fontFamily: 'monospace', color: 'var(--c-fire2)', fontSize: '0.85rem', marginBottom: 4 }}>{p.path}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--c-muted)' }}>{p.name}</div>
                {p.guard && <Badge color="rgba(212,160,71,0.15)" textColor="var(--c-gold2)">{p.guard}</Badge>}
              </div>
              <div style={{ color: 'var(--c-muted)', fontSize: '0.85rem', lineHeight: 1.7 }}>{p.desc}</div>
            </div>
          ))}
        </Section>

        {/* State Management */}
        <Section title="State Management (Zustand)" icon={<Layers size={18} />} delay={0.15}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontWeight: 700, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Box size={15} color="var(--c-fire)" /> useCartStore
            </div>
            <Row label="items" value="CartItem[] — array of { id, name, price, image_url, quantity }" />
            <Row label="add(product)" value="Adds product to cart or increments quantity" />
            <Row label="remove(id)" value="Removes item from cart completely" />
            <Row label="update(id, qty)" value="Sets quantity for a specific item" />
            <Row label="clear()" value="Empties the cart" />
            <Row label="count()" value="Total number of items (sum of quantities)" />
            <Row label="total()" value="Sum of item.price × item.quantity" />
          </div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Box size={15} color="var(--c-gold)" /> useAuthStore
            </div>
            <Row label="user" value="Supabase Auth user object or null" />
            <Row label="profile" value="Row from public.profiles or null" />
            <Row label="setUser(user)" value="Called on auth state change" />
            <Row label="setProfile(profile)" value="Stores fetched profile data" />
            <Row label="logout()" value="Clears user and profile from store" />
          </div>
        </Section>

        {/* Components */}
        <Section title="Shared Components" icon={<Code2 size={18} />} delay={0.2}>
          <Row label="Layout.jsx" value="Top-level wrapper rendered by React Router. Contains fixed navbar (logo, links, cart button, sign in), mobile hamburger menu, and footer. All media-query CSS lives here as a <style> tag." />
          <Row label="ProductCard.jsx" value="Reusable card for a single menu item. Props: product. Shows optimized image (Unsplash params), BESTSELLER badge if is_popular, name, description, weight, cooking_time, formatted price, and an Add to Cart button that calls useCartStore.add()." />
        </Section>

        {/* Lib utilities */}
        <Section title="Utilities (src/lib)" icon={<Package size={18} />} delay={0.25}>
          <Row label="supabase.js" value="Creates and exports the Supabase JS client. Exports IS_DEMO = true when env vars are absent so the app works without credentials using mockData." />
          <Row label="mockData.js — MOCK_PRODUCTS" value="16 products across 5 categories. Fields match the products DB table. Used when IS_DEMO is true." />
          <Row label="price.js — formatEUR(value)" value="Formats an integer (e.g. 399) as ₴ 399.00 using Intl.NumberFormat('en-US'). Named formatEUR for legacy reasons but outputs UAH." />
          <Row label="image.js — optimizeImageUrl(url, width, quality)" value="Appends Unsplash query params (auto=format, fit=crop, w=, q=) for performance. Falls back to original URL for non-Unsplash images." />
        </Section>

        {/* Database */}
        <Section title="Database Schema (Supabase / PostgreSQL)" icon={<Database size={18} />} delay={0.3}>
          <p style={{ color: 'var(--c-muted)', fontSize: '0.88rem', marginBottom: 20, lineHeight: 1.7 }}>
            All tables have Row Level Security (RLS) enabled. Users can only read/write their own data. The <code style={{ background: 'rgba(255,255,255,0.06)', padding: '1px 6px', borderRadius: 4 }}>service_role</code> key bypasses RLS for admin operations. Click a table to expand its columns and policies.
          </p>

          <DBTable
            name="public.profiles"
            pk="id"
            fields={[
              { col: 'id', type: 'uuid', notes: 'PK · references auth.users(id) ON DELETE CASCADE' },
              { col: 'full_name', type: 'text', notes: 'User display name' },
              { col: 'phone', type: 'text', notes: 'Contact phone number' },
              { col: 'address', type: 'text', notes: 'Saved delivery address' },
              { col: 'email', type: 'text', notes: 'Copied from auth.users on signup' },
              { col: 'created_at', type: 'timestamptz', notes: 'Auto-set to now()' },
              { col: 'updated_at', type: 'timestamptz', notes: 'Auto-updated via trigger trg_profiles_updated_at' },
            ]}
            policies={[
              'profiles_select_own — SELECT where auth.uid() = id',
              'profiles_insert_own — INSERT where auth.uid() = id',
              'profiles_update_own — UPDATE where auth.uid() = id',
            ]}
          />

          <DBTable
            name="public.products"
            pk="id"
            fields={[
              { col: 'id', type: 'text', notes: 'PK · string identifier (e.g. "1", "2")' },
              { col: 'name', type: 'text NOT NULL', notes: 'Product name' },
              { col: 'description', type: 'text', notes: 'Short description shown on card' },
              { col: 'price', type: 'integer', notes: 'Price in UAH kopecks · CHECK price >= 0' },
              { col: 'image_url', type: 'text', notes: 'Unsplash or custom image URL' },
              { col: 'category', type: 'text', notes: "CHECK IN ('pizza','pasta','starters','desserts','drinks')" },
              { col: 'weight', type: 'text', notes: 'Display weight e.g. "450 g" or "400 ml"' },
              { col: 'cooking_time', type: 'integer', notes: 'Minutes · 0 = ready-made (desserts/drinks)' },
              { col: 'is_popular', type: 'boolean', notes: 'Shows BESTSELLER badge on card' },
              { col: 'is_available', type: 'boolean', notes: 'Hides item from menu when false' },
              { col: 'created_at', type: 'timestamptz', notes: 'Auto-set to now()' },
              { col: 'updated_at', type: 'timestamptz', notes: 'Auto-updated via trigger' },
            ]}
            policies={[
              'products_select_all — SELECT for everyone (public catalog)',
              'products_manage_service — ALL for service_role only (admin writes)',
            ]}
          />

          <DBTable
            name="public.orders"
            pk="id"
            fields={[
              { col: 'id', type: 'uuid', notes: 'PK · default gen_random_uuid()' },
              { col: 'user_id', type: 'uuid NOT NULL', notes: 'FK → auth.users(id) ON DELETE CASCADE' },
              { col: 'total', type: 'integer', notes: 'Order total in UAH · CHECK >= 0' },
              { col: 'delivery_address', type: 'text NOT NULL', notes: 'Delivery address string' },
              { col: 'phone', type: 'text NOT NULL', notes: 'Customer phone for delivery' },
              { col: 'comment', type: 'text', notes: 'Optional order note' },
              { col: 'status', type: 'text', notes: "DEFAULT 'pending' · CHECK IN ('pending','confirmed','preparing','delivering','delivered','cancelled')" },
              { col: 'created_at', type: 'timestamptz', notes: 'Auto-set to now()' },
              { col: 'updated_at', type: 'timestamptz', notes: 'Auto-updated via trigger' },
            ]}
            policies={[
              'orders_select_own — SELECT where auth.uid() = user_id',
              'orders_insert_own — INSERT where auth.uid() = user_id',
              'orders_update_own — UPDATE where auth.uid() = user_id',
            ]}
          />

          <DBTable
            name="public.order_items"
            pk="id"
            fields={[
              { col: 'id', type: 'uuid', notes: 'PK · default gen_random_uuid()' },
              { col: 'order_id', type: 'uuid NOT NULL', notes: 'FK → public.orders(id) ON DELETE CASCADE' },
              { col: 'product_id', type: 'text', notes: 'Nullable — product may be deleted later' },
              { col: 'product_name', type: 'text NOT NULL', notes: 'Snapshot of name at time of order' },
              { col: 'product_price', type: 'integer NOT NULL', notes: 'Snapshot of price at time of order · CHECK >= 0' },
              { col: 'quantity', type: 'integer NOT NULL', notes: 'CHECK > 0' },
              { col: 'created_at', type: 'timestamptz', notes: 'Auto-set to now()' },
            ]}
            policies={[
              'order_items_select_own — SELECT via JOIN to orders where auth.uid() = orders.user_id',
              'order_items_insert_own — INSERT via JOIN to orders where auth.uid() = orders.user_id',
            ]}
          />

          <div style={{ marginTop: 20 }}>
            <div style={{ fontWeight: 700, marginBottom: 10, color: 'var(--c-cream)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Link2 size={14} color="var(--c-gold)" /> Relationships
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.82rem', lineHeight: 2.2, color: 'var(--c-muted)' }}>
              <div><span style={{ color: 'var(--c-cream)' }}>auth.users</span> ──1:1──▶ <span style={{ color: 'var(--c-cream)' }}>profiles</span></div>
              <div><span style={{ color: 'var(--c-cream)' }}>auth.users</span> ──1:N──▶ <span style={{ color: 'var(--c-cream)' }}>orders</span></div>
              <div><span style={{ color: 'var(--c-cream)' }}>orders</span>     ──1:N──▶ <span style={{ color: 'var(--c-cream)' }}>order_items</span></div>
              <div><span style={{ color: 'var(--c-cream)' }}>products</span>   ──1:N──▶ <span style={{ color: 'var(--c-cream)' }}>order_items</span> <span style={{ color: 'rgba(255,255,255,0.25)' }}>(soft ref via product_id)</span></div>
            </div>
          </div>
        </Section>

        {/* DB Triggers & Functions */}
        <Section title="DB Triggers & Functions" icon={<ShieldCheck size={18} />} delay={0.35}>
          <Row label="set_updated_at()" value="Trigger function that sets updated_at = now() before any UPDATE. Applied to profiles, products, orders." />
          <Row label="handle_new_user()" value="AFTER INSERT on auth.users — automatically creates a row in public.profiles with the new user's id, full_name and email. Uses ON CONFLICT DO UPDATE to be idempotent." />
          <Row label="trg_profiles_updated_at" value="BEFORE UPDATE on profiles → calls set_updated_at()" />
          <Row label="trg_products_updated_at" value="BEFORE UPDATE on products → calls set_updated_at()" />
          <Row label="trg_orders_updated_at" value="BEFORE UPDATE on orders → calls set_updated_at()" />
          <Row label="on_auth_user_created" value="AFTER INSERT on auth.users → calls handle_new_user()" />
        </Section>

        {/* Demo mode */}
        <Section title="Demo Mode" icon={<Flame size={18} />} delay={0.4}>
          <p style={{ color: 'var(--c-muted)', fontSize: '0.88rem', lineHeight: 1.8, marginBottom: 12 }}>
            When <code style={{ background: 'rgba(255,255,255,0.06)', padding: '1px 6px', borderRadius: 4 }}>VITE_SUPABASE_URL</code> and <code style={{ background: 'rgba(255,255,255,0.06)', padding: '1px 6px', borderRadius: 4 }}>VITE_SUPABASE_ANON_KEY</code> env vars are not set, <code style={{ background: 'rgba(255,255,255,0.06)', padding: '1px 6px', borderRadius: 4 }}>IS_DEMO</code> is <code style={{ background: 'rgba(255,255,255,0.06)', padding: '1px 6px', borderRadius: 4 }}>true</code>.
          </p>
          <Row label="Products" value="Loaded from MOCK_PRODUCTS (mockData.js) instead of Supabase" />
          <Row label="Auth" value="Supabase Auth calls still fire but will fail silently — user stays as guest" />
          <Row label="Orders" value="Order placement attempts a real Supabase insert; fails gracefully in demo" />
          <Row label="Banner" value="Orange demo banner shown at top of every page when IS_DEMO = true" />
        </Section>

      </div>
    </div>
  )
}
