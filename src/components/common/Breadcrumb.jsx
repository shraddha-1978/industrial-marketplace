import { Link } from 'react-router-dom'
import Icon from './Icon'
import './Breadcrumb.css'

export default function Breadcrumb({ items }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol>
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <li key={i}>
              {last || !item.path ? (
                <span className="bc-current">{item.label}</span>
              ) : (
                <Link to={item.path} className="bc-link">{item.label}</Link>
              )}
              {!last && <Icon name="ChevronRight" size={13} className="bc-sep" />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
