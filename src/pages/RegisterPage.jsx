import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../components/common/Icon'
import AuthLayout from '../components/AuthLayout'
import { useApp } from '../context/AppContext'
import './AuthPage.css'

const ACCENT_COLORS = ['#1a5dc9', '#d97706', '#0d9488', '#7c3aed', '#dc2626', '#0891b2']

export default function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useApp()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    location: '',
    password: '',
    confirm: '',
    terms: false,
    role: 'buyer',
  })
  const [errors, setErrors] = useState({})
  const [showPass, setShowPass] = useState(false)

  const set = (k) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((er) => ({ ...er, [k]: undefined }))
  }

  const submit = (e) => {
    e.preventDefault()
    const er = {}
    if (!form.name.trim()) er.name = 'Full name is required'
    if (!form.email.trim()) er.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) er.email = 'Enter a valid email'
    if (!form.phone.trim()) er.phone = 'Phone number is required'
    else if (!/^[0-9+\-\s]{8,15}$/.test(form.phone)) er.phone = 'Enter a valid phone'
    if (!form.location.trim()) er.location = 'City / location is required'
    if (!form.password) er.password = 'Password is required'
    else if (form.password.length < 6) er.password = 'Use at least 6 characters'
    if (form.confirm !== form.password) er.confirm = 'Passwords do not match'
    if (!form.terms) er.terms = 'Please accept the terms to continue'
    setErrors(er)
    if (Object.keys(er).length) return

    login({
      name: form.name,
      email: form.email,
      phone: form.phone,
      company: form.company || '—',
      location: form.location,
      avatarColor: ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)],
    })
    navigate('/dashboard')
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join 2.4M+ businesses sourcing on IndusMart."
      footer={
        <p className="auth-foot">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      }
    >
      {/* Role tabs */}
      <div className="reg-roles">
        <button
          className={`rr-tab ${form.role === 'buyer' ? 'active' : ''}`}
          onClick={() => set('role')({ target: { type: 'text', value: 'buyer' } })}
        >
          <Icon name="User" size={16} /> Buyer / Importer
        </button>
        <button
          className={`rr-tab ${form.role === 'supplier' ? 'active' : ''}`}
          onClick={() => set('role')({ target: { type: 'text', value: 'supplier' } })}
        >
          <Icon name="Store" size={16} /> Supplier / Seller
        </button>
      </div>

      <form onSubmit={submit} noValidate>
        <div className="form-grid">
          <div className="field">
            <label>Full Name <span className="req">*</span></label>
            <input
              className={`input ${errors.name ? 'field-error' : ''}`}
              value={form.name}
              onChange={set('name')}
              placeholder="Your full name"
            />
            {errors.name && <span className="error-text"><Icon name="AlertCircle" size={13} /> {errors.name}</span>}
          </div>

          <div className="field">
            <label>Email Address <span className="req">*</span></label>
            <input
              className={`input ${errors.email ? 'field-error' : ''}`}
              type="email"
              value={form.email}
              onChange={set('email')}
              placeholder="you@company.com"
            />
            {errors.email && <span className="error-text"><Icon name="AlertCircle" size={13} /> {errors.email}</span>}
          </div>

          <div className="field">
            <label>Phone Number <span className="req">*</span></label>
            <input
              className={`input ${errors.phone ? 'field-error' : ''}`}
              value={form.phone}
              onChange={set('phone')}
              placeholder="+91 98765 43210"
            />
            {errors.phone && <span className="error-text"><Icon name="AlertCircle" size={13} /> {errors.phone}</span>}
          </div>

          <div className="field">
            <label>City / Location <span className="req">*</span></label>
            <input
              className={`input ${errors.location ? 'field-error' : ''}`}
              value={form.location}
              onChange={set('location')}
              placeholder="Mumbai, Maharashtra"
            />
            {errors.location && <span className="error-text"><Icon name="AlertCircle" size={13} /> {errors.location}</span>}
          </div>

          <div className="field full">
            <label>Company Name <span className="opt">(optional)</span></label>
            <input
              className="input"
              value={form.company}
              onChange={set('company')}
              placeholder="Your business name"
            />
          </div>

          <div className="field">
            <label>Password <span className="req">*</span></label>
            <div className="pass-wrap">
              <input
                className={`input ${errors.password ? 'field-error' : ''}`}
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={set('password')}
                placeholder="Min. 6 characters"
              />
              <button type="button" className="pass-toggle" onClick={() => setShowPass((v) => !v)}>
                <Icon name={showPass ? 'XCircle' : 'Eye'} size={18} />
              </button>
            </div>
            {errors.password && <span className="error-text"><Icon name="AlertCircle" size={13} /> {errors.password}</span>}
          </div>

          <div className="field">
            <label>Confirm Password <span className="req">*</span></label>
            <input
              className={`input ${errors.confirm ? 'field-error' : ''}`}
              type={showPass ? 'text' : 'password'}
              value={form.confirm}
              onChange={set('confirm')}
              placeholder="Re-enter password"
            />
            {errors.confirm && <span className="error-text"><Icon name="AlertCircle" size={13} /> {errors.confirm}</span>}
          </div>
        </div>

        <label className="reg-terms">
          <input type="checkbox" checked={form.terms} onChange={set('terms')} />
          <span>
            I agree to IndusMart's <Link to="/register" onClick={(e) => e.preventDefault()}>Terms of Use</Link> and{' '}
            <Link to="/register" onClick={(e) => e.preventDefault()}>Privacy Policy</Link>.
          </span>
        </label>
        {errors.terms && <span className="error-text"><Icon name="AlertCircle" size={13} /> {errors.terms}</span>}

        <button type="submit" className="btn btn-primary btn-block btn-lg" style={{ marginTop: 18 }}>
          <Icon name="UserPlus" size={18} /> Create Free Account
        </button>
      </form>
    </AuthLayout>
  )
}
