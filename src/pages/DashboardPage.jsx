import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Icon from '../components/common/Icon'
import Stars from '../components/common/Stars'
import ProductCard from '../components/ProductCard'
import ProductImage from '../components/common/ProductImage'
import Breadcrumb from '../components/common/Breadcrumb'
import { useApp } from '../context/AppContext'
import { getProductById } from '../data/products'
import { getSupplierById } from '../data/suppliers'
import './DashboardPage.css'

const TABS = [
  { id: 'overview',   label: 'Overview',      icon: 'LayoutDashboard' },
  { id: 'enquiries',  label: 'My Enquiries',  icon: 'Send' },
  { id: 'favourites', label: 'Favourites',    icon: 'Heart' },
  { id: 'compare',    label: 'Compare List',  icon: 'GitCompare' },
  { id: 'profile',    label: 'Profile',       icon: 'Settings' },
]

export default function DashboardPage() {
  const navigate  = useNavigate()
  const {
    authUser, isAuthenticated, logout,
    enquiries, favouriteIds, compareIds,
    toggleFavourite, removeFromCompare, updateUser,
  } = useApp()

  const [urlParams, setUrlParams] = useSearchParams()
  const tab = urlParams.get('tab') || 'overview'

  if (!isAuthenticated || !authUser) {
    return (
      <main className="container dash-auth">
        <div className="dash-auth-box card">
          <span className="da-ic"><Icon name="User" size={32} /></span>
          <h2>Login Required</h2>
          <p>Please login to access your customer dashboard.</p>
          <div className="da-actions">
            <Link to="/login"    className="btn btn-primary"><Icon name="LogIn"    size={16} /> Login</Link>
            <Link to="/register" className="btn btn-outline"><Icon name="UserPlus" size={16} /> Register</Link>
          </div>
        </div>
      </main>
    )
  }

  const setTab       = (t) => setUrlParams(t === 'overview' ? {} : { tab: t }, { replace: true })
  const favProducts  = favouriteIds.map(getProductById).filter(Boolean)
  const cmpProducts  = compareIds.map(getProductById).filter(Boolean)

  return (
    <main className="dashboard">
      <div className="container">
        <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Dashboard' }]} />

        {/* Header */}
        <div className="dash-header">
          <div className="dh-user">
            <span className="dh-avatar" style={{ background: authUser.avatarColor }}>
              {authUser.initials}
            </span>
            <div>
              <h1>Hi, {authUser.name.split(' ')[0]} 👋</h1>
              <p>Manage your enquiries, favourites and profile</p>
            </div>
          </div>
          <button
            className="btn btn-outline"
            onClick={() => { logout(); navigate('/') }}
          >
            <Icon name="LogOut" size={16} /> Logout
          </button>
        </div>

        <div className="dash-layout">
          {/* ── Sidebar ── */}
          <aside className="dash-side">
            <div className="dsc-profile">
              <span className="dh-avatar sm" style={{ background: authUser.avatarColor }}>
                {authUser.initials}
              </span>
              <div className="dsc-info">
                <p className="dsc-name">{authUser.name}</p>
                <p className="dsc-email ellipsis-1">{authUser.email}</p>
                {authUser.company && (
                  <p className="dsc-company ellipsis-1">{authUser.company}</p>
                )}
              </div>
            </div>

            <nav className="dash-nav" aria-label="Dashboard navigation">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  className={`dn-item ${tab === t.id ? 'active' : ''}`}
                  onClick={() => setTab(t.id)}
                  aria-current={tab === t.id ? 'page' : undefined}
                >
                  <Icon name={t.icon} size={18} />
                  <span className="dn-label">{t.label}</span>
                  {t.id === 'enquiries'  && enquiries.length  > 0 && <span className="dn-badge">{enquiries.length}</span>}
                  {t.id === 'favourites' && favProducts.length > 0 && <span className="dn-badge">{favProducts.length}</span>}
                  {t.id === 'compare'    && cmpProducts.length > 0 && <span className="dn-badge">{cmpProducts.length}</span>}
                </button>
              ))}
            </nav>

            <Link to="/become-supplier" className="dash-side-cta">
              <Icon name="Store" size={20} />
              <div>
                <strong>Become a Supplier</strong>
                <span>Start selling on IndusMart</span>
              </div>
            </Link>
          </aside>

          {/* ── Content ── */}
          <div className="dash-content">
            {tab === 'overview' && (
              <Overview
                authUser={authUser}
                enquiries={enquiries}
                favCount={favProducts.length}
                cmpCount={cmpProducts.length}
                setTab={setTab}
                favProducts={favProducts}
              />
            )}

            {tab === 'enquiries' && (
              <section className="dash-panel">
                <div className="section-bar">
                  <h2>My Enquiries</h2>
                  <Link to="/enquiry" className="btn btn-primary btn-sm">
                    <Icon name="Plus" size={15} /> New Enquiry
                  </Link>
                </div>
                {enquiries.length === 0 ? (
                  <div className="empty-state">
                    <Icon name="Send" />
                    <h3>No enquiries yet</h3>
                    <p>When you submit enquiries they'll appear here so you can track responses.</p>
                    <Link to="/products" className="btn btn-primary">Browse Products</Link>
                  </div>
                ) : (
                  <div className="enq-list">
                    {enquiries.map((e) => (
                      <div key={e.id} className="enq-item card">
                        <div className="ei-top">
                          <span className="ei-product">{e.product}</span>
                          <span className="badge badge-blue">{e.status}</span>
                        </div>
                        <div className="ei-grid">
                          <span><Icon name="User"     size={13} /> {e.name}</span>
                          <span><Icon name="Package"  size={13} /> {e.quantity}</span>
                          <span><Icon name="MapPin"   size={13} /> {e.location}</span>
                          <span>
                            <Icon name="Calendar" size={13} />
                            {new Date(e.createdAt).toLocaleDateString('en-IN', {
                              day: '2-digit', month: 'short', year: 'numeric',
                            })}
                          </span>
                        </div>
                        {e.message && <p className="ei-msg">{e.message}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {tab === 'favourites' && (
              <section className="dash-panel">
                <div className="section-bar">
                  <h2>Favourite Products</h2>
                  <span className="text-muted">{favProducts.length} saved</span>
                </div>
                {favProducts.length === 0 ? (
                  <div className="empty-state">
                    <Icon name="Heart" />
                    <h3>No favourites yet</h3>
                    <p>Tap the heart icon on any product to save it for later.</p>
                    <Link to="/products" className="btn btn-primary">Browse Products</Link>
                  </div>
                ) : (
                  <div className="products-grid">
                    {favProducts.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                )}
              </section>
            )}

            {tab === 'compare' && (
              <section className="dash-panel">
                <div className="section-bar">
                  <h2>Compare List</h2>
                  {cmpProducts.length > 0 && (
                    <Link to="/compare" className="btn btn-primary btn-sm">
                      <Icon name="GitCompare" size={15} /> Open Compare
                    </Link>
                  )}
                </div>
                {cmpProducts.length === 0 ? (
                  <div className="empty-state">
                    <Icon name="GitCompare" />
                    <h3>Nothing to compare yet</h3>
                    <p>Add products to compare using the compare icon on any card.</p>
                    <Link to="/products" className="btn btn-primary">Browse Products</Link>
                  </div>
                ) : (
                  <div className="dash-compare-list">
                    {cmpProducts.map((p) => {
                      const supplier = getSupplierById(p.supplierId)
                      return (
                        <div key={p.id} className="dci card">
                          <button
                            className="dci-remove"
                            onClick={() => removeFromCompare(p.id)}
                            aria-label={`Remove ${p.name}`}
                          >
                            <Icon name="X" size={16} />
                          </button>
                          <Link to={`/products/${p.id}`} className="dci-thumb">
                            <ProductImage product={p} size="sm" />
                          </Link>
                          <div className="dci-info">
                            <Link to={`/products/${p.id}`} className="dci-name ellipsis-2">
                              {p.name}
                            </Link>
                            <Stars value={p.rating} count={p.reviewCount} size={13} />
                            <span className="dci-price">
                              ₹{p.price.toLocaleString('en-IN')} {p.priceUnit}
                            </span>
                            <span className="dci-supplier">by {supplier?.name}</span>
                          </div>
                          <div className="dci-actions">
                            <Link to={`/products/${p.id}`} className="btn btn-outline btn-sm">
                              View
                            </Link>
                            <button
                              className={`btn btn-sm ${favProducts.some((fp) => fp.id === p.id) ? 'btn-ghost fav-on' : 'btn-ghost'}`}
                              onClick={() => toggleFavourite(p.id)}
                              title="Toggle favourite"
                            >
                              <Icon name="Heart" size={14} />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </section>
            )}

            {tab === 'profile' && (
              <ProfilePanel authUser={authUser} updateUser={updateUser} />
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

/* ── Overview panel ── */
function Overview({ authUser, enquiries, favCount, cmpCount, setTab, favProducts }) {
  const stats = [
    { label: 'Total Enquiries', value: enquiries.length, icon: 'Send',       color: '#1a5dc9', tab: 'enquiries'  },
    { label: 'Favourites',      value: favCount,         icon: 'Heart',      color: '#dc2626', tab: 'favourites' },
    { label: 'In Compare',      value: cmpCount,         icon: 'GitCompare', color: '#7c3aed', tab: 'compare'    },
    {
      label: 'Member Since',
      value: new Date(authUser.joinedAt).getFullYear(),
      icon: 'Calendar',
      color: '#0d9488',
      tab:   null,
    },
  ]

  return (
    <>
      <div className="dash-stats">
        {stats.map((s) => (
          <button
            key={s.label}
            className="ds-card card"
            onClick={() => s.tab && setTab(s.tab)}
            style={{ cursor: s.tab ? 'pointer' : 'default' }}
          >
            <span className="ds-ic" style={{ background: `${s.color}1a`, color: s.color }}>
              <Icon name={s.icon} size={22} />
            </span>
            <div>
              <strong className="ds-val">{s.value}</strong>
              <span className="ds-lbl">{s.label}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="dash-row">
        {/* Recent enquiries */}
        <section className="dash-panel dash-recent">
          <div className="section-bar">
            <h2>Recent Enquiries</h2>
            <button className="bar-link" onClick={() => setTab('enquiries')}>
              View All <Icon name="ChevronRight" size={14} />
            </button>
          </div>
          {enquiries.length === 0 ? (
            <p className="text-muted" style={{ padding: '8px 0' }}>
              No enquiries yet.{' '}
              <Link to="/products" style={{ color: 'var(--blue-600)', fontWeight: 600 }}>
                Start exploring
              </Link>
              .
            </p>
          ) : (
            <div className="dr-list">
              {enquiries.slice(0, 5).map((e) => (
                <div key={e.id} className="dr-item">
                  <span className="dr-ic"><Icon name="Send" size={15} /></span>
                  <div className="dr-content">
                    <span className="dr-product ellipsis-1">{e.product}</span>
                    <span className="dr-meta">
                      {e.quantity} · {e.location}
                    </span>
                  </div>
                  <span className="badge badge-blue">{e.status}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Saved products */}
        <section className="dash-panel dash-fav">
          <div className="section-bar">
            <h2>Saved Products</h2>
            <button className="bar-link" onClick={() => setTab('favourites')}>
              View All <Icon name="ChevronRight" size={14} />
            </button>
          </div>
          {favProducts.length === 0 ? (
            <p className="text-muted" style={{ padding: '8px 0' }}>No saved products yet.</p>
          ) : (
            <div className="df-list">
              {favProducts.slice(0, 4).map((p) => (
                <Link key={p.id} to={`/products/${p.id}`} className="df-item">
                  <div className="df-thumb">
                    <ProductImage product={p} size="sm" />
                  </div>
                  <div className="df-info">
                    <span className="df-name ellipsis-1">{p.name}</span>
                    <span className="df-price">
                      ₹{p.price.toLocaleString('en-IN')} {p.priceUnit}
                    </span>
                  </div>
                  <Icon name="ChevronRight" size={15} className="df-arrow" />
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  )
}

/* ── Profile panel ── */
function ProfilePanel({ authUser, updateUser }) {
  // Keep form in sync whenever authUser changes externally (e.g. after a save).
  const [form, setForm] = useState({
    name:     authUser.name,
    email:    authUser.email,
    phone:    authUser.phone    || '',
    company:  authUser.company  || '',
    location: authUser.location || '',
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setForm({
      name:     authUser.name,
      email:    authUser.email,
      phone:    authUser.phone    || '',
      company:  authUser.company  || '',
      location: authUser.location || '',
    })
  }, [authUser])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const save = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) return
    const initials = form.name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
    updateUser({ ...form, initials })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const reset = () =>
    setForm({
      name:     authUser.name,
      email:    authUser.email,
      phone:    authUser.phone    || '',
      company:  authUser.company  || '',
      location: authUser.location || '',
    })

  const previewInitials = form.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <section className="dash-panel">
      <div className="section-bar">
        <h2>Profile Settings</h2>
      </div>

      {saved && (
        <div className="alert alert-success" style={{ marginBottom: 18 }}>
          <Icon name="CheckCircle2" size={18} /> Profile updated successfully!
        </div>
      )}

      <form onSubmit={save} noValidate>
        <div className="pf-avatar-row">
          <span className="dh-avatar lg" style={{ background: authUser.avatarColor }}>
            {previewInitials}
          </span>
          <div>
            <h3>{form.name || 'Your Name'}</h3>
            <p className="text-muted">{form.email}</p>
            {form.company && <p className="text-muted" style={{ fontSize: 13 }}>{form.company}</p>}
          </div>
        </div>

        <div className="form-grid">
          <div className="field">
            <label>Full Name <span className="req">*</span></label>
            <input
              className="input"
              value={form.name}
              onChange={set('name')}
              required
              placeholder="Your full name"
            />
          </div>
          <div className="field">
            <label>Email Address <span className="req">*</span></label>
            <input
              className="input"
              type="email"
              value={form.email}
              onChange={set('email')}
              required
            />
          </div>
          <div className="field">
            <label>Phone Number</label>
            <input
              className="input"
              value={form.phone}
              onChange={set('phone')}
              placeholder="+91 98765 43210"
            />
          </div>
          <div className="field">
            <label>City / Location</label>
            <input
              className="input"
              value={form.location}
              onChange={set('location')}
              placeholder="Mumbai, Maharashtra"
            />
          </div>
          <div className="field full">
            <label>Company Name</label>
            <input
              className="input"
              value={form.company}
              onChange={set('company')}
              placeholder="Your company or business"
            />
          </div>
        </div>

        <div className="pf-actions">
          <button type="submit" className="btn btn-primary">
            <Icon name="Check" size={16} /> Save Changes
          </button>
          <button type="button" className="btn btn-outline" onClick={reset}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  )
}
