import { Link, useNavigate, useParams } from 'react-router-dom'
import Icon from '../components/common/Icon'
import Stars from '../components/common/Stars'
import ProductCard from '../components/ProductCard'
import Breadcrumb from '../components/common/Breadcrumb'
import { getSupplierById } from '../data/suppliers'
import { getProductsBySupplier } from '../data/products'
import { getCategoryById } from '../data/categories'
import { useApp } from '../context/AppContext'
import './SupplierDetailPage.css'

export default function SupplierDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { openEnquiry } = useApp()
  const supplier = getSupplierById(id)

  if (!supplier) {
    return (
      <main className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="empty-state">
          <Icon name="Building2" />
          <h3>Supplier not found</h3>
          <p>This supplier profile doesn't exist.</p>
          <button className="btn btn-primary" onClick={() => navigate('/suppliers')}>Browse Suppliers</button>
        </div>
      </main>
    )
  }

  const products = getProductsBySupplier(supplier.id)
  const servedCats = supplier.categories.map(getCategoryById).filter(Boolean)
  const crumbs = [
    { label: 'Home', path: '/' },
    { label: 'Suppliers', path: '/suppliers' },
    { label: supplier.name },
  ]

  return (
    <main className="supplier-detail">
      {/* Banner */}
      <div className="sd-banner">
        <div className="container sd-banner-inner">
          <div className="sd-logo" style={{ background: supplier.accent }}>{supplier.logoText}</div>
          <div className="sd-title">
            <div className="sd-name-row">
              <h1>{supplier.name}</h1>
              {supplier.verified && (
                <span className="badge badge-green"><Icon name="BadgeCheck" size={13} /> GST Verified</span>
              )}
            </div>
            <div className="sd-loc-row">
              <span><Icon name="MapPin" size={14} /> {supplier.location}</span>
              <span><Icon name="Calendar" size={14} /> Established {supplier.established}</span>
              <span><Icon name="Users" size={14} /> {supplier.employees} Employees</span>
            </div>
            <div className="sd-badges">
              {supplier.badges.map((b) => (
                <span key={b} className="sd-badge">
                  <Icon name="CheckCircle2" size={12} /> {b}
                </span>
              ))}
            </div>
          </div>
          <div className="sd-cta">
            <button
              className="btn btn-amber btn-lg"
              onClick={() => openEnquiry({ kind: 'supplier', id: supplier.id, name: supplier.name })}
            >
              <Icon name="Send" size={17} /> Send Enquiry
            </button>
            <a href={`tel:${supplier.phone}`} className="btn btn-light btn-lg">
              <Icon name="Phone" size={17} /> Call Now
            </a>
          </div>
        </div>
      </div>

      <div className="container">
        <Breadcrumb items={crumbs} />

        {/* Stats */}
        <div className="sd-stats">
          <div className="sd-stat">
            <span className="sd-stat-val">
              <Stars value={supplier.rating} showValue={false} size={15} />
            </span>
            <span className="sd-stat-lbl">{supplier.rating} Rating ({supplier.reviewCount})</span>
          </div>
          <div className="sd-stat">
            <span className="sd-stat-val">{supplier.trustScore}%</span>
            <span className="sd-stat-lbl">Trust Score</span>
          </div>
          <div className="sd-stat">
            <span className="sd-stat-val">{supplier.responseRate}</span>
            <span className="sd-stat-lbl">Response Rate</span>
          </div>
          <div className="sd-stat">
            <span className="sd-stat-val">{supplier.responseTime}</span>
            <span className="sd-stat-lbl">Avg Reply Time</span>
          </div>
          <div className="sd-stat">
            <span className="sd-stat-val">{supplier.productCount}</span>
            <span className="sd-stat-lbl">Products Listed</span>
          </div>
        </div>

        <div className="sd-layout">
          {/* Main */}
          <div className="sd-main">
            <section className="sd-block">
              <h2>About the Company</h2>
              <p className="sd-about">{supplier.description}</p>
            </section>

            <section className="sd-block">
              <h2>Products &amp; Specialties</h2>
              <div className="sd-specs">
                {supplier.specialties.map((s) => (
                  <span key={s} className="chip"><Icon name="Check" size={13} /> {s}</span>
                ))}
              </div>
            </section>

            <section className="sd-block">
              <h2>Categories Served</h2>
              <div className="sd-cats">
                {servedCats.map((c) => (
                  <Link key={c.id} to={`/products?category=${c.id}`} className="sd-cat-pill" style={{ '--ca': c.accent, '--cal': c.accentLight }}>
                    <Icon name={c.icon} size={16} /> {c.name}
                  </Link>
                ))}
              </div>
            </section>

            <section className="sd-block">
              <div className="section-bar">
                <h2>Products by {supplier.name.split(' ').slice(0, 2).join(' ')}</h2>
                <Link to="/products" className="bar-link">View All <Icon name="ChevronRight" size={16} /></Link>
              </div>
              {products.length === 0 ? (
                <p className="text-muted">No products listed yet.</p>
              ) : (
                <div className="products-grid">
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="sd-side">
            <div className="card sd-contact-card">
              <h3>Contact Information</h3>
              <div className="sdc-list">
                <div className="sdc-item">
                  <span className="sdc-ic"><Icon name="MapPin" size={16} /></span>
                  <div>
                    <span className="sdc-label">Address</span>
                    <span className="sdc-val">{supplier.address}</span>
                  </div>
                </div>
                <div className="sdc-item">
                  <span className="sdc-ic"><Icon name="Phone" size={16} /></span>
                  <div>
                    <span className="sdc-label">Phone</span>
                    <span className="sdc-val">{supplier.phone}</span>
                  </div>
                </div>
                <div className="sdc-item">
                  <span className="sdc-ic"><Icon name="Mail" size={16} /></span>
                  <div>
                    <span className="sdc-label">Email</span>
                    <span className="sdc-val">{supplier.email}</span>
                  </div>
                </div>
                <div className="sdc-item">
                  <span className="sdc-ic"><Icon name="FileText" size={16} /></span>
                  <div>
                    <span className="sdc-label">GST Number</span>
                    <span className="sdc-val">{supplier.gst}</span>
                  </div>
                </div>
              </div>
              <button
                className="btn btn-primary btn-block"
                onClick={() => openEnquiry({ kind: 'supplier', id: supplier.id, name: supplier.name })}
              >
                <Icon name="Send" size={16} /> Send Enquiry
              </button>
            </div>

            <div className="card sd-hours">
              <h3>Business Hours</h3>
              <div className="sdc-list">
                <div className="sd-hour-row"><span>Mon – Fri</span><strong>9:00 AM – 7:00 PM</strong></div>
                <div className="sd-hour-row"><span>Saturday</span><strong>10:00 AM – 5:00 PM</strong></div>
                <div className="sd-hour-row closed"><span>Sunday</span><strong>Closed</strong></div>
              </div>
              <div className="sd-open-now">
                <span className="sd-dot" /> Open Now · Closes 7 PM
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
