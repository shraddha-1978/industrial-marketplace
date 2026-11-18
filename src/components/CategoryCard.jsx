import { Link } from 'react-router-dom'
import Icon from './common/Icon'
import './CategoryCard.css'

export default function CategoryCard({ category, variant = 'default' }) {
  if (variant === 'compact') {
    return (
      <Link to={`/products?category=${category.id}`} className="ccard-compact">
        <span className="cc-ic-compact" style={{ background: category.accentLight, color: category.accent }}>
          <Icon name={category.icon} size={22} />
        </span>
        <span className="cc-compact-name">{category.name}</span>
        <Icon name="ChevronRight" size={16} className="cc-compact-arrow" />
      </Link>
    )
  }

  return (
    <Link to={`/products?category=${category.id}`} className="ccard card card-hover">
      <div className="ccard-top" style={{ '--cc-accent': category.accent, '--cc-light': category.accentLight }}>
        <span className="ccard-icon">
          <Icon name={category.icon} size={30} strokeWidth={1.8} />
        </span>
        <span className="ccard-count">
          {category.productCount.toLocaleString('en-IN')}+
        </span>
      </div>
      <h3 className="ccard-name">{category.name}</h3>
      <p className="ccard-desc">{category.description}</p>
      <span className="ccard-link">
        Explore <Icon name="ArrowRight" size={14} />
      </span>
    </Link>
  )
}
