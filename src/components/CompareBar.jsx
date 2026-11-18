import { Link, useLocation } from 'react-router-dom'
import Icon from './common/Icon'
import ProductImage from './common/ProductImage'
import { useApp } from '../context/AppContext'
import { getProductById } from '../data/products'
import './CompareBar.css'

export default function CompareBar() {
  const { compareIds, removeFromCompare, clearCompare } = useApp()
  const { pathname } = useLocation()

  // Don't show the bar on the compare page itself.
  if (compareIds.length === 0 || pathname === '/compare') return null

  return (
    <div className="comparebar fade-up">
      <div className="container cb-inner">
        <div className="cb-label">
          <Icon name="GitCompare" size={18} />
          <span>
            Compare <strong>{compareIds.length}</strong>/4
          </span>
        </div>

        <div className="cb-items">
          {compareIds.slice(0, 4).map((id) => {
            const p = getProductById(id)
            if (!p) return null
            return (
              <div key={id} className="cb-item">
                <button
                  className="cb-remove"
                  onClick={() => removeFromCompare(id)}
                  aria-label={`Remove ${p.name}`}
                >
                  <Icon name="X" size={13} />
                </button>
                <div className="cb-thumb">
                  <ProductImage product={p} size="sm" />
                </div>
                <span className="cb-name ellipsis-1">{p.name}</span>
              </div>
            )
          })}
          {Array.from({ length: 4 - compareIds.length }).map((_, i) => (
            <div key={`empty-${i}`} className="cb-item empty">
              <span className="cb-empty">
                <Icon name="Plus" size={18} />
              </span>
              <span className="cb-name">Add product</span>
            </div>
          ))}
        </div>

        <div className="cb-actions">
          <button className="cb-clear" onClick={clearCompare}>
            <Icon name="Trash2" size={15} /> Clear
          </button>
          <Link to="/compare" className="btn btn-primary btn-sm">
            <Icon name="GitCompare" size={15} /> Compare Now
          </Link>
        </div>
      </div>
    </div>
  )
}
