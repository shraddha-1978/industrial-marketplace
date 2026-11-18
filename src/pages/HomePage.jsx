import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../components/common/Icon'
import Stars from '../components/common/Stars'
import ProductCard from '../components/ProductCard'
import SupplierCard from '../components/SupplierCard'
import CategoryCard from '../components/CategoryCard'
import { categories } from '../data/categories'
import { getFeaturedProducts } from '../data/products'
import { suppliers } from '../data/suppliers'
import { testimonials } from '../data/testimonials'
import { stats, whyChooseUs, steps } from '../data/content'
import './HomePage.css'

export default function HomePage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('')

  const featured = getFeaturedProducts()

  const submit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search.trim()) params.set('search', search.trim())
    if (activeCategory) params.set('category', activeCategory)
    navigate(`/products?${params.toString()}`)
  }

  return (
    <main className="homepage">
      {/* ===== Hero ===== */}
      <section className="hero-section">
        <div className="hero-bg-pattern" />
        <div className="container hero-inner">
          <div className="hero-content fade-up">
            <div className="hero-eyebrow">
              <span className="badge badge-blue"><Icon name="Sparkles" size={12} /> Trusted B2B Marketplace</span>
              <span className="he-sep" />
              <span className="he-stat">1.2M+ Orders Facilitated</span>
            </div>
            <h1 className="hero-h1">
              India's Most Trusted<br />
              <span className="hero-accent">Industrial B2B</span> Marketplace
            </h1>
            <p className="hero-sub">
              Connect with verified suppliers for machinery, electrical equipment,
              tools, construction materials, safety gear and industrial supplies at
              the best wholesale prices.
            </p>

            {/* Search bar */}
            <form className="hero-search" onSubmit={submit}>
              <select
                className="hs-cat"
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                aria-label="Filter by category"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <div className="hs-divider" />
              <div className="hs-input-wrap">
                <Icon name="Search" size={19} className="hs-icon" />
                <input
                  type="text"
                  placeholder="Search products, brands, suppliers..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search products"
                />
              </div>
              <button type="submit" className="btn btn-primary hs-submit">
                <Icon name="Search" size={18} /> Search
              </button>
            </form>

            {/* Quick links */}
            <div className="hero-quick">
              <span className="hq-label">Popular:</span>
              {['CNC Machines', 'Safety Helmets', 'TMT Steel', 'Pumps', 'Transformers'].map((t) => (
                <button
                  key={t}
                  className="hq-chip"
                  onClick={() => navigate(`/products?search=${encodeURIComponent(t)}`)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Hero visual */}
          <div className="hero-visual fade-up" style={{ animationDelay: '0.15s' }}>
            <div className="hv-card hv-top">
              <div className="hv-row">
                <span className="hv-dot" style={{ background: '#16a34a' }} />
                <strong>Live Enquiries</strong>
              </div>
              <p className="hv-num">1,248</p>
              <p className="hv-label">Enquiries today</p>
            </div>
            <div className="hv-grid">
              {categories.slice(0, 4).map((cat) => (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.id}`}
                  className="hv-cat"
                  style={{ '--hv-ac': cat.accent, '--hv-al': cat.accentLight }}
                >
                  <span className="hv-cat-ic"><Icon name={cat.icon} size={22} /></span>
                  <span className="hv-cat-name">{cat.name.split(' ')[0]}</span>
                </Link>
              ))}
            </div>
            <div className="hv-card hv-bottom">
              <div className="hv-row">
                <span className="hv-dot" style={{ background: '#1a5dc9' }} />
                <strong>Verified Suppliers</strong>
              </div>
              <p className="hv-num">580K+</p>
              <p className="hv-label">Registered suppliers in India</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Stats ===== */}
      <section className="stats-section">
        <div className="container stats-grid">
          {stats.map((s) => (
            <div key={s.label} className="stat-item">
              <span className="si-icon"><Icon name={s.icon} size={28} /></span>
              <strong className="si-val">{s.value}</strong>
              <span className="si-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== How It Works ===== */}
      <section className="section section-grey">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Process</span>
            <h2>How IndusMart Works</h2>
            <p>Four simple steps from requirement to delivery</p>
          </div>
          <div className="steps-row">
            {steps.map((s, i) => (
              <div key={s.title} className="step-item">
                <div className="step-num-wrap">
                  <span className="step-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="step-ic"><Icon name={s.icon} size={26} /></span>
                  {i < steps.length - 1 && <span className="step-line" />}
                </div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
          <div className="text-center" style={{ marginTop: 36 }}>
            <Link to="/enquiry" className="btn btn-primary btn-lg">
              <Icon name="Send" size={18} /> Post Your Requirement
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Product Categories ===== */}
      <section className="section">
        <div className="container">
          <div className="section-bar">
            <h2>Browse Product Categories</h2>
            <Link to="/categories" className="bar-link">
              View All <Icon name="ChevronRight" size={16} />
            </Link>
          </div>
          <div className="categories-grid">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== Featured Products ===== */}
      <section className="section section-grey">
        <div className="container">
          <div className="section-bar">
            <h2>Featured Products</h2>
            <Link to="/products" className="bar-link">
              View All <Icon name="ChevronRight" size={16} />
            </Link>
          </div>
          <div className="products-grid">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== Top Suppliers ===== */}
      <section className="section">
        <div className="container">
          <div className="section-bar">
            <h2>Top Suppliers</h2>
            <Link to="/suppliers" className="bar-link">
              View All <Icon name="ChevronRight" size={16} />
            </Link>
          </div>
          <div className="suppliers-grid">
            {suppliers.slice(0, 6).map((s) => (
              <SupplierCard key={s.id} supplier={s} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== Why Choose Us ===== */}
      <section className="section section-grey">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Why IndusMart</span>
            <h2>Built for B2B Industrial Procurement</h2>
            <p>Purpose-built tools for verified sourcing at scale</p>
          </div>
          <div className="wcu-grid">
            {whyChooseUs.map((w) => (
              <div key={w.title} className="wcu-item">
                <span className="wcu-ic"><Icon name={w.icon} size={26} /></span>
                <h3>{w.title}</h3>
                <p>{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Testimonials ===== */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Testimonials</span>
            <h2>Trusted by 2.4M+ Businesses</h2>
            <p>Real stories from buyers and suppliers across India</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} t={t} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA Banner ===== */}
      <section className="cta-section">
        <div className="container cta-inner">
          <div className="cta-text">
            <h2>Start Sourcing Smarter Today</h2>
            <p>
              Join 2.4M+ verified businesses. Get competitive quotations from the
              best suppliers in minutes.
            </p>
          </div>
          <div className="cta-actions">
            <Link to="/register" className="btn btn-light btn-lg">
              <Icon name="UserPlus" size={18} /> Register as Buyer
            </Link>
            <Link to="/become-supplier" className="btn btn-amber btn-lg">
              <Icon name="Store" size={18} /> Start Selling
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

function TestimonialCard({ t }) {
  return (
    <div className="tc card">
      <div className="tc-top">
        <span className="tc-ic"><Icon name="Quote" size={22} /></span>
        <Stars value={t.rating} showValue={false} />
      </div>
      <p className="tc-text">"{t.text}"</p>
      <div className="tc-person">
        <span className="tc-avatar" style={{ background: t.avatarColor }}>{t.initials}</span>
        <div>
          <p className="tc-name">{t.name}</p>
          <p className="tc-role">{t.role} · {t.company}</p>
          <p className="tc-loc">
            <Icon name="MapPin" size={12} /> {t.location}
          </p>
        </div>
      </div>
    </div>
  )
}
