import { useState } from 'react'
import Icon from '../components/common/Icon'
import Breadcrumb from '../components/common/Breadcrumb'
import { categories } from '../data/categories'
import './BecomeSupplierPage.css'

const benefits = [
  { icon: 'Users', title: 'Reach 2.4M+ Buyers', text: 'Get discovered by verified industrial buyers searching for your products.' },
  { icon: 'TrendingUp', title: 'Grow Your Sales', text: 'Suppliers on IndusMart report 3x more enquiries within the first 90 days.' },
  { icon: 'Send', title: 'Real-time Enquiries', text: 'Receive instant buyer enquiries with full requirement and contact details.' },
  { icon: 'BadgeIndianRupee', title: 'Zero Commission', text: 'No commission on orders. You deal directly with the buyer on your terms.' },
  { icon: 'Building2', title: 'Supplier Dashboard', text: 'Manage listings, enquiries, leads and performance from one dashboard.' },
  { icon: 'ShieldCheck', title: 'Verified Badge', text: 'GST verification builds buyer trust and improves your enquiry rate.' },
]

const steps = [
  { icon: 'UserPlus', title: 'Register Your Business', text: 'Sign up with your GST and business details to get verified.' },
  { icon: 'Package', title: 'List Your Products', text: 'Add products with images, specs and pricing in minutes.' },
  { icon: 'MessagesSquare', title: 'Receive Enquiries', text: 'Buyers find you and send enquiries directly to your inbox.' },
  { icon: 'Truck', title: 'Fulfil Orders', text: 'Quote, confirm and deliver — all managed from your dashboard.' },
]

const plans = [
  { name: 'Starter', price: '₹0', period: '/month', popular: false, features: ['Up to 10 product listings', 'Basic supplier profile', '10 enquiries / month', 'Email support'] },
  { name: 'Growth', price: '₹2,499', period: '/month', popular: true, features: ['Up to 100 product listings', 'GST verified badge', 'Unlimited enquiries', 'Priority listing placement', 'Supplier dashboard analytics', 'Dedicated account manager'] },
  { name: 'Enterprise', price: '₹6,999', period: '/month', popular: false, features: ['Unlimited listings', 'Top placement & featured tags', 'Dedicated landing page', 'Lead export & API access', 'Premium 24/7 support', 'Brand store customisation'] },
]

export default function BecomeSupplierPage() {
  const [form, setForm] = useState({
    company: '',
    contact: '',
    email: '',
    phone: '',
    gst: '',
    category: '',
    location: '',
    products: '',
  })
  const [errors, setErrors] = useState({})
  const [done, setDone] = useState(false)

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setErrors((er) => ({ ...er, [k]: undefined }))
  }

  const submit = (e) => {
    e.preventDefault()
    const er = {}
    if (!form.company.trim()) er.company = 'Company name is required'
    if (!form.contact.trim()) er.contact = 'Contact person is required'
    if (!form.email.trim()) er.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) er.email = 'Enter a valid email'
    if (!form.phone.trim()) er.phone = 'Phone is required'
    else if (!/^[0-9+\-\s]{8,15}$/.test(form.phone)) er.phone = 'Enter a valid phone'
    if (!form.category) er.category = 'Select a primary category'
    if (!form.location.trim()) er.location = 'Location is required'
    setErrors(er)
    if (Object.keys(er).length) return
    setDone(true)
    setForm({ company: '', contact: '', email: '', phone: '', gst: '', category: '', location: '', products: '' })
    setTimeout(() => setDone(false), 6000)
  }

  return (
    <main className="become-supplier">
      {/* Hero */}
      <section className="bs-hero">
        <div className="bs-hero-bg" />
        <div className="container bs-hero-inner">
          <div className="bsh-text fade-up">
            <span className="badge badge-blue bsh-badge"><Icon name="Store" size={12} /> For Suppliers & Manufacturers</span>
            <h1>Grow Your Business with <span className="bsh-accent">India's Largest</span> B2B Network</h1>
            <p>List your industrial products and start receiving verified buyer enquiries from across India and 190+ countries.</p>
            <div className="bsh-cta">
              <a href="#register" className="btn btn-amber btn-lg"><Icon name="UserPlus" size={18} /> Register Now — It's Free</a>
              <a href="#plans" className="btn btn-light btn-lg">View Plans</a>
            </div>
          </div>
          <div className="bsh-visual fade-up" style={{ animationDelay: '0.15s' }}>
            <div className="bsh-stats">
              <div><strong>580K+</strong><span>Active Suppliers</span></div>
              <div><strong>2.4M+</strong><span>B2B Buyers</span></div>
              <div><strong>1.2M+</strong><span>Orders / Month</span></div>
              <div><strong>190+</strong><span>Countries</span></div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Become a Supplier' }]} />

        {/* Benefits */}
        <section className="section">
          <div className="section-head">
            <span className="eyebrow">Why Join</span>
            <h2>Why Sell on IndusMart?</h2>
            <p>Everything you need to reach more B2B buyers and grow revenue</p>
          </div>
          <div className="bs-benefits">
            {benefits.map((b) => (
              <div key={b.title} className="bsb-item card card-hover">
                <span className="bsb-ic"><Icon name={b.icon} size={24} /></span>
                <h3>{b.title}</h3>
                <p>{b.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Steps */}
      <section className="section section-grey">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Process</span>
            <h2>Start Selling in 4 Steps</h2>
            <p>Onboard your business in minutes, not weeks</p>
          </div>
          <div className="bs-steps">
            {steps.map((s, i) => (
              <div key={s.title} className="bs-step">
                <span className="bss-num">{i + 1}</span>
                <span className="bss-ic"><Icon name={s.icon} size={26} /></span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="section" id="plans">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Pricing</span>
            <h2>Choose Your Supplier Plan</h2>
            <p>Start free, upgrade anytime as you grow. No commission on orders.</p>
          </div>
          <div className="bs-plans">
            {plans.map((p) => (
              <div key={p.name} className={`bsp-card card ${p.popular ? 'popular' : ''}`}>
                {p.popular && <span className="bsp-popular">Most Popular</span>}
                <h3>{p.name}</h3>
                <div className="bsp-price">
                  <span className="bsp-amount">{p.price}</span>
                  <span className="bsp-period">{p.period}</span>
                </div>
                <ul className="bsp-features">
                  {p.features.map((f) => (
                    <li key={f}><Icon name="Check" size={15} /> {f}</li>
                  ))}
                </ul>
                <a href="#register" className={`btn btn-block ${p.popular ? 'btn-primary' : 'btn-outline'}`}>
                  {p.price === '₹0' ? 'Get Started Free' : 'Choose Plan'}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration form */}
      <section className="section section-grey" id="register">
        <div className="container bs-register-wrap">
          <div className="bs-register card">
            <div className="bsr-head">
              <span className="badge badge-blue"><Icon name="Store" size={13} /> Supplier Registration</span>
              <h2>Register Your Business</h2>
              <p>Fill in your details and our team will verify and activate your supplier account within 24 hours.</p>
            </div>

            {done ? (
              <div className="bsr-success">
                <span className="bsr-success-ic"><Icon name="CheckCircle2" size={48} /></span>
                <h3>Registration Received!</h3>
                <p>Thank you for joining IndusMart. Our verification team will review your application and contact you within 24 hours at the email you provided.</p>
                <button className="btn btn-primary" onClick={() => setDone(false)}>Register Another</button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <div className="form-grid">
                  <div className="field">
                    <label>Company Name <span className="req">*</span></label>
                    <input className={`input ${errors.company ? 'field-error' : ''}`} value={form.company} onChange={set('company')} placeholder="Your company name" />
                    {errors.company && <span className="error-text"><Icon name="AlertCircle" size={13} /> {errors.company}</span>}
                  </div>
                  <div className="field">
                    <label>Contact Person <span className="req">*</span></label>
                    <input className={`input ${errors.contact ? 'field-error' : ''}`} value={form.contact} onChange={set('contact')} placeholder="Full name" />
                    {errors.contact && <span className="error-text"><Icon name="AlertCircle" size={13} /> {errors.contact}</span>}
                  </div>
                  <div className="field">
                    <label>Email <span className="req">*</span></label>
                    <input className={`input ${errors.email ? 'field-error' : ''}`} type="email" value={form.email} onChange={set('email')} placeholder="sales@company.in" />
                    {errors.email && <span className="error-text"><Icon name="AlertCircle" size={13} /> {errors.email}</span>}
                  </div>
                  <div className="field">
                    <label>Phone <span className="req">*</span></label>
                    <input className={`input ${errors.phone ? 'field-error' : ''}`} value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" />
                    {errors.phone && <span className="error-text"><Icon name="AlertCircle" size={13} /> {errors.phone}</span>}
                  </div>
                  <div className="field">
                    <label>Primary Category <span className="req">*</span></label>
                    <select className={`select ${errors.category ? 'field-error' : ''}`} value={form.category} onChange={set('category')}>
                      <option value="">Select category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    {errors.category && <span className="error-text"><Icon name="AlertCircle" size={13} /> {errors.category}</span>}
                  </div>
                  <div className="field">
                    <label>Location <span className="req">*</span></label>
                    <input className={`input ${errors.location ? 'field-error' : ''}`} value={form.location} onChange={set('location')} placeholder="City, State" />
                    {errors.location && <span className="error-text"><Icon name="AlertCircle" size={13} /> {errors.location}</span>}
                  </div>
                  <div className="field">
                    <label>GST Number</label>
                    <input className="input" value={form.gst} onChange={set('gst')} placeholder="15-digit GSTIN" />
                  </div>
                  <div className="field">
                    <label>Products / Specialties</label>
                    <input className="input" value={form.products} onChange={set('products')} placeholder="e.g. CNC Machines, Pumps" />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-lg btn-block">
                  <Icon name="UserPlus" size={18} /> Submit Registration
                </button>
                <p className="bsr-note">
                  <Icon name="ShieldCheck" size={15} /> Your information is secure and used only for verification.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
