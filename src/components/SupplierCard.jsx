import { Link } from 'react-router-dom'
import Icon from './common/Icon'
import Stars from './common/Stars'
import { useApp } from '../context/AppContext'
import './SupplierCard.css'

export default function SupplierCard({ supplier }) {
  const { openEnquiry } = useApp()

  return (
    <article className="scard card card-hover">
      <div className="scard-top">
        <Link to={`/suppliers/${supplier.id}`} className="scard-logo" style={{ background: supplier.accent }}>
          {supplier.logoText}
        </Link>
        <div className="scard-id">
          <div className="scard-name-row">
            <Link to={`/suppliers/${supplier.id}`} className="scard-name">
              {supplier.name}
            </Link>
            {supplier.verified && (
              <span className="badge badge-green"><Icon name="BadgeCheck" size={11} /> Verified</span>
            )}
          </div>
          <span className="scard-loc">
            <Icon name="MapPin" size={13} /> {supplier.location}
          </span>
        </div>
      </div>

      <div className="scard-stats">
        <div className="sc-stat">
          <Stars value={supplier.rating} count={supplier.reviewCount} size={13} />
        </div>
        <div className="sc-stat">
          <span className="sc-stat-val">{supplier.responseRate}</span>
          <span className="sc-stat-label">Response</span>
        </div>
        <div className="sc-stat">
          <span className="sc-stat-val">{supplier.responseTime}</span>
          <span className="sc-stat-label">Reply Time</span>
        </div>
      </div>

      <p className="scard-desc ellipsis-2">{supplier.description}</p>

      <div className="scard-specs">
        {supplier.specialties.slice(0, 3).map((s) => (
          <span key={s} className="chip">{s}</span>
        ))}
      </div>

      <div className="scard-badges">
        {supplier.badges.slice(0, 3).map((b) => (
          <span key={b} className="sc-badge">
            <Icon name="CheckCircle2" size={12} /> {b}
          </span>
        ))}
      </div>

      <div className="scard-foot">
        <span className="scard-prods">
          <Icon name="Package" size={14} /> {supplier.productCount} Products
        </span>
        <div className="scard-actions">
          <Link to={`/suppliers/${supplier.id}`} className="btn btn-outline btn-sm">
            View Profile
          </Link>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => openEnquiry({ kind: 'supplier', id: supplier.id, name: supplier.name })}
          >
            <Icon name="Send" size={14} /> Enquiry
          </button>
        </div>
      </div>
    </article>
  )
}
