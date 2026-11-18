import { Link } from 'react-router-dom'
import Icon from './common/Icon'
import Logo from './common/Logo'
import './AuthLayout.css'

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <main className="auth">
      <div className="auth-brand">
        <Link to="/" className="auth-brand-logo">
          <Logo light />
        </Link>
        <h2 className="auth-brand-h">
          India's Most Trusted<br />B2B Industrial Marketplace
        </h2>
        <p className="auth-brand-p">
          Join 2.4M+ verified buyers and suppliers sourcing industrial products at the best wholesale prices.
        </p>
        <ul className="auth-features">
          {[
            { icon: 'ShieldCheck', text: 'Trade with GST-verified suppliers only' },
            { icon: 'BadgeIndianRupee', text: 'Get competitive quotes in minutes' },
            { icon: 'GitCompare', text: 'Compare products, specs & prices' },
            { icon: 'Headset', text: 'Dedicated buyer support 24/7' },
          ].map((f) => (
            <li key={f.text}>
              <span className="af-ic"><Icon name={f.icon} size={20} /></span>
              {f.text}
            </li>
          ))}
        </ul>
        <div className="auth-stats">
          <div><strong>2.4M+</strong><span>Buyers</span></div>
          <div><strong>580K+</strong><span>Suppliers</span></div>
          <div><strong>190+</strong><span>Countries</span></div>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-panel-inner">
          <Link to="/" className="auth-mobile-logo">
            <Logo />
          </Link>
          <div className="auth-head">
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          {children}
          {footer}
        </div>
      </div>
    </main>
  )
}
