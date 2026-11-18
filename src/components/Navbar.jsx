import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import Icon from './common/Icon'
import Logo from './common/Logo'
import { navLinks, popularSearches } from '../data/content'
import { categories } from '../data/categories'
import { useApp } from '../context/AppContext'
import './Navbar.css'

export default function Navbar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [urlParams] = useSearchParams()
  const { authUser, isAuthenticated, logout, compareCount } = useApp()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenu, setUserMenu] = useState(false)
  // Keep search bar in sync with the ?search= URL param whenever the route changes.
  const [search, setSearch] = useState(() => urlParams.get('search') || '')
  const userRef = useRef(null)

  // Sync search input when URL changes (e.g. user navigates back/forward).
  useEffect(() => {
    if (pathname === '/products') {
      setSearch(urlParams.get('search') || '')
    } else if (pathname !== '/products') {
      // Don't wipe the field on other pages — keep last typed value.
    }
  }, [pathname, urlParams])

  // Close all menus on route change.
  useEffect(() => {
    setMobileOpen(false)
    setUserMenu(false)
  }, [pathname])

  // Close user dropdown on outside click.
  useEffect(() => {
    const onClick = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setUserMenu(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const submitSearch = (e) => {
    e.preventDefault()
    const q = search.trim()
    if (q) {
      navigate(`/products?search=${encodeURIComponent(q)}`)
    } else {
      navigate('/products')
    }
    setMobileOpen(false)
  }

  const goCategory = (id) => {
    navigate(`/products?category=${id}`)
    setMobileOpen(false)   // close mobile drawer after picking a category
  }

  return (
    <header className="navbar">
      {/* ── Top utility bar ── */}
      <div className="nav-topbar">
        <div className="container nav-topbar-inner">
          <div className="nav-topbar-contact">
            <span className="ntc-item">
              <Icon name="Phone" size={13} /> +91 80000 12345
            </span>
            <span className="ntc-item ntc-email">
              <Icon name="Mail" size={13} /> support@indusmart.in
            </span>
          </div>
          <div className="nav-topbar-links">
            <Link to="/become-supplier" className="ntc-link">
              <Icon name="Store" size={13} /> Sell on IndusMart
            </Link>
            <span className="ntc-divider" />
            <Link to="/enquiry" className="ntc-link">
              <Icon name="Send" size={13} /> Post Requirement
            </Link>
            <span className="ntc-divider" />
            {isAuthenticated ? (
              <span className="ntc-item">Hi, {authUser.name.split(' ')[0]}</span>
            ) : (
              <Link to="/login" className="ntc-link">
                <Icon name="LogIn" size={13} /> Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Main bar ── */}
      <div className="nav-main">
        <div className="container nav-main-inner">
          <Link to="/" className="nav-logo" aria-label="IndusMart home">
            <Logo />
          </Link>

          {/* Search form */}
          <form className="nav-search" onSubmit={submitSearch} role="search">
            <div className="nav-search-wrap">
              <Icon name="Search" size={18} className="ns-icon" />
              <input
                type="text"
                className="nav-search-input"
                placeholder="Search products, suppliers, categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search products"
              />
              {search && (
                <button
                  type="button"
                  className="ns-clear"
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                >
                  <Icon name="X" size={16} />
                </button>
              )}
            </div>
            <button type="submit" className="btn btn-primary ns-btn">
              <Icon name="Search" size={17} />
              <span className="ns-label">Search</span>
            </button>
          </form>

          {/* Right-side actions */}
          <div className="nav-actions">
            <Link to="/compare" className="nav-action" title="Compare products">
              <span className="nav-action-ic">
                <Icon name="GitCompare" size={21} />
                {compareCount > 0 && (
                  <span className="nav-badge" aria-label={`${compareCount} products in compare`}>
                    {compareCount}
                  </span>
                )}
              </span>
              <span className="nav-action-label">Compare</span>
            </Link>

            {isAuthenticated ? (
              <div className="nav-user" ref={userRef}>
                <button
                  className="nav-user-btn"
                  onClick={() => setUserMenu((v) => !v)}
                  aria-label="Account menu"
                  aria-expanded={userMenu}
                >
                  <span className="nav-avatar" style={{ background: authUser.avatarColor }}>
                    {authUser.initials}
                  </span>
                  <span className="nav-user-name">
                    {authUser.name.split(' ')[0]}
                    <Icon name="ChevronDown" size={14} />
                  </span>
                </button>

                {userMenu && (
                  <div className="nav-user-menu scale-in" role="menu">
                    <div className="num-head">
                      <span className="nav-avatar lg" style={{ background: authUser.avatarColor }}>
                        {authUser.initials}
                      </span>
                      <div className="num-head-info">
                        <p className="num-name">{authUser.name}</p>
                        <p className="num-email">{authUser.email}</p>
                      </div>
                    </div>
                    <Link to="/dashboard" className="num-item" role="menuitem">
                      <Icon name="LayoutDashboard" size={17} /> Dashboard
                    </Link>
                    <Link to="/dashboard?tab=enquiries" className="num-item" role="menuitem">
                      <Icon name="Send" size={17} /> My Enquiries
                    </Link>
                    <Link to="/dashboard?tab=favourites" className="num-item" role="menuitem">
                      <Icon name="Heart" size={17} /> Favourites
                    </Link>
                    <Link to="/dashboard?tab=profile" className="num-item" role="menuitem">
                      <Icon name="Settings" size={17} /> Profile Settings
                    </Link>
                    <button
                      className="num-item num-logout"
                      role="menuitem"
                      onClick={() => { logout(); navigate('/') }}
                    >
                      <Icon name="LogOut" size={17} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="nav-auth">
                <Link to="/login" className="btn btn-outline btn-sm">
                  <Icon name="LogIn" size={16} /> Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  <Icon name="UserPlus" size={16} /> Register
                </Link>
              </div>
            )}

            <button
              className="nav-toggle"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              <Icon name={mobileOpen ? 'X' : 'Menu'} size={24} />
            </button>
          </div>
        </div>

        {/* Trending searches — desktop only */}
        <div className="container nav-popular">
          <span className="np-label">Trending:</span>
          {popularSearches.map((term) => (
            <button
              key={term}
              className="np-chip"
              onClick={() => {
                setSearch(term)
                navigate(`/products?search=${encodeURIComponent(term)}`)
              }}
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* ── Category bar ── */}
      <nav className="nav-cats" aria-label="Product categories">
        <div className="container nav-cats-inner">
          <button
            className="nav-cats-all"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="All categories"
          >
            <Icon name="Grid3x3" size={16} /> All Categories
            <Icon name="ChevronDown" size={15} />
          </button>
          <div className="nav-cats-scroll" role="list">
            {categories.map((c) => (
              <button
                key={c.id}
                className={`nav-cat-link ${pathname === '/products' && urlParams.get('category') === c.id ? 'active' : ''}`}
                onClick={() => goCategory(c.id)}
                role="listitem"
              >
                <Icon name={c.icon} size={15} />
                {c.name}
              </button>
            ))}
          </div>
          <Link to="/categories" className="nav-cat-more">
            View All <Icon name="ChevronRight" size={14} />
          </Link>
        </div>
      </nav>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="nav-mobile-backdrop"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="nav-mobile fade-in" role="dialog" aria-label="Navigation menu">
            {/* Mobile search */}
            <form className="nm-search" onSubmit={submitSearch}>
              <div className="nav-search-wrap" style={{ flex: 1 }}>
                <Icon name="Search" size={18} className="ns-icon" />
                <input
                  type="text"
                  className="nav-search-input"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Go
              </button>
            </form>

            <div className="nm-section">
              <p className="nm-title">Pages</p>
              {navLinks.map((l) => (
                <Link
                  key={l.path}
                  to={l.path}
                  className={`nm-link ${pathname === l.path ? 'active' : ''}`}
                >
                  {l.label}
                </Link>
              ))}
              <Link to="/enquiry" className="nm-link">Post Requirement</Link>
              {!isAuthenticated && (
                <>
                  <Link to="/login" className="nm-link">
                    <Icon name="LogIn" size={16} /> Login
                  </Link>
                  <Link to="/register" className="nm-link">
                    <Icon name="UserPlus" size={16} /> Register
                  </Link>
                </>
              )}
            </div>

            <div className="nm-section">
              <p className="nm-title">Categories</p>
              {categories.map((c) => (
                <button
                  key={c.id}
                  className="nm-link"
                  onClick={() => goCategory(c.id)}
                >
                  <Icon name={c.icon} size={16} /> {c.name}
                </button>
              ))}
            </div>

            {isAuthenticated && (
              <div className="nm-section">
                <p className="nm-title">Account</p>
                <Link to="/dashboard" className="nm-link">
                  <Icon name="LayoutDashboard" size={16} /> Dashboard
                </Link>
                <Link to="/dashboard?tab=enquiries" className="nm-link">
                  <Icon name="Send" size={16} /> My Enquiries
                </Link>
                <button
                  className="nm-link nm-logout"
                  onClick={() => { logout(); navigate('/') }}
                >
                  <Icon name="LogOut" size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </header>
  )
}
