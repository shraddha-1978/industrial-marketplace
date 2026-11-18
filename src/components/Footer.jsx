import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from './common/Icon'
import Logo from './common/Logo'
import { categories } from '../data/categories'
import './Footer.css'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const subscribe = (e) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3500)
    }
  }

  return (
    <footer className="footer">
      {/* CTA strip */}
      <div className="footer-cta">
        <div className="container footer-cta-inner">
          <div className="fcta-text">
            <h3>Ready to grow your business?</h3>
            <p>Join 580,000+ suppliers and reach verified B2B buyers across India and 190+ countries.</p>
          </div>
          <div className="fcta-actions">
            <Link to="/become-supplier" className="btn btn-light btn-lg">
              <Icon name="Store" size={18} /> Become a Supplier
            </Link>
            <Link to="/enquiry" className="btn btn-amber btn-lg">
              <Icon name="Send" size={18} /> Post Requirement
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="footer-main">
        <div className="container footer-grid">
          {/* Brand + newsletter */}
          <div className="fg-brand">
            <Logo />
            <p className="fg-about">
              IndusMart is India's trusted B2B marketplace connecting verified
              suppliers of industrial machinery, electrical equipment, tools and
              construction materials with buyers worldwide.
            </p>
            <div className="fg-contact">
              <span className="fgc-item">
                <Icon name="MapPin" size={16} /> 4th Floor, Trade Tower, Bandra Kurla Complex, Mumbai 400051
              </span>
              <span className="fgc-item">
                <Icon name="Phone" size={16} /> +91 80000 12345
              </span>
              <span className="fgc-item">
                <Icon name="Mail" size={16} /> support@indusmart.in
              </span>
            </div>
            <div className="fg-social">
              {['Globe', 'MessageSquare', 'Send', 'Mail'].map((i) => (
                <span key={i} className="fg-social-ic">
                  <Icon name={i} size={17} />
                </span>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="fg-col">
            <h4>Top Categories</h4>
            {categories.slice(0, 6).map((c) => (
              <Link key={c.id} to={`/products?category=${c.id}`} className="fg-link">
                {c.name}
              </Link>
            ))}
            <Link to="/categories" className="fg-link fg-link-bold">
              View All Categories <Icon name="ArrowRight" size={13} />
            </Link>
          </div>

          {/* Company */}
          <div className="fg-col">
            <h4>Company</h4>
            <Link to="/" className="fg-link">About Us</Link>
            <Link to="/suppliers" className="fg-link">Find Suppliers</Link>
            <Link to="/become-supplier" className="fg-link">Become a Supplier</Link>
            <Link to="/categories" className="fg-link">Browse Categories</Link>
            <Link to="/enquiry" className="fg-link">Post a Requirement</Link>
          </div>

          {/* Support */}
          <div className="fg-col">
            <h4>Support &amp; Help</h4>
            <Link to="/enquiry" className="fg-link">Customer Support</Link>
            <Link to="/" className="fg-link">How IndusMart Works</Link>
            <Link to="/" className="fg-link">Help Centre</Link>
            <Link to="/" className="fg-link">Report an Issue</Link>
            <Link to="/login" className="fg-link">My Account</Link>
          </div>

          {/* Newsletter */}
          <div className="fg-news">
            <h4>Stay Updated</h4>
            <p>Get the latest product launches and price alerts in your inbox.</p>
            <form className="fg-news-form" onSubmit={subscribe}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email for newsletter"
              />
              <button type="submit" className="btn btn-primary" aria-label="Subscribe">
                <Icon name="ArrowRight" size={18} />
              </button>
            </form>
            {subscribed && (
              <p className="alert alert-success fg-news-done">
                <Icon name="CheckCircle2" size={16} /> Subscribed successfully!
              </p>
            )}
            <div className="fg-news-trust">
              <Icon name="ShieldCheck" size={15} /> Trusted by 2.4M+ businesses
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© {new Date().getFullYear()} IndusMart Technologies Pvt Ltd. All rights reserved.</p>
          <div className="fb-links">
            <Link to="/">Privacy Policy</Link>
            <Link to="/">Terms of Use</Link>
            <Link to="/">Cookies</Link>
          </div>
          <div className="fb-pay">
            <span className="fb-pay-item">GST</span>
            <span className="fb-pay-item">ISO</span>
            <span className="fb-pay-item">MCA</span>
            <span className="fb-pay-item">BIS</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
