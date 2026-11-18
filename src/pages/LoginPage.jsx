import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../components/common/Icon'
import AuthLayout from '../components/AuthLayout'
import { useApp } from '../context/AppContext'
import './AuthPage.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useApp()
  const [form, setForm] = useState({ email: '', password: '', remember: true })
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
    if (!form.email.trim()) er.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) er.email = 'Enter a valid email'
    if (!form.password) er.password = 'Password is required'
    setErrors(er)
    if (Object.keys(er).length) return

    // Derive a friendly name from the email for the mock session.
    const name = form.email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    login({
      name: name || 'IndusMart Buyer',
      email: form.email,
      company: 'IndusMart Buyer Account',
    })
    navigate('/dashboard')
  }

  const fillDemo = () => {
    setForm({ email: 'rahul.sharma@agarwalfab.in', password: 'demo1234', remember: true })
    setErrors({})
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Login to your IndusMart account to manage enquiries and orders."
      footer={
        <p className="auth-foot">
          Don't have an account? <Link to="/register">Create one free</Link>
        </p>
      }
    >
      <div className="auth-social">
        <button type="button" className="auth-social-btn"><Icon name="Globe" size={18} /> Google</button>
        <button type="button" className="auth-social-btn"><Icon name="Building2" size={18} /> Business</button>
      </div>
      <div className="auth-divider">or login with email</div>

      <form onSubmit={submit} noValidate>
        <div className="field">
          <label>Email Address <span className="req">*</span></label>
          <input
            className={`input ${errors.email ? 'field-error' : ''}`}
            type="email"
            value={form.email}
            onChange={set('email')}
            placeholder="you@company.com"
            autoComplete="email"
          />
          {errors.email && <span className="error-text"><Icon name="AlertCircle" size={13} /> {errors.email}</span>}
        </div>

        <div className="field">
          <label>Password <span className="req">*</span></label>
          <div className="pass-wrap">
            <input
              className={`input ${errors.password ? 'field-error' : ''}`}
              type={showPass ? 'text' : 'password'}
              value={form.password}
              onChange={set('password')}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            <button
              type="button"
              className="pass-toggle"
              onClick={() => setShowPass((v) => !v)}
              aria-label="Toggle password visibility"
            >
              <Icon name={showPass ? 'XCircle' : 'Eye'} size={18} />
            </button>
          </div>
          {errors.password && <span className="error-text"><Icon name="AlertCircle" size={13} /> {errors.password}</span>}
        </div>

        <div className="auth-row">
          <label className="auth-remember">
            <input type="checkbox" checked={form.remember} onChange={set('remember')} />
            Remember me
          </label>
          <Link to="/login" className="auth-link" onClick={(e) => e.preventDefault()}>Forgot password?</Link>
        </div>

        <button type="submit" className="btn btn-primary btn-block btn-lg">
          <Icon name="LogIn" size={18} /> Login to IndusMart
        </button>

        <button type="button" className="demo-fill" onClick={fillDemo}>
          <Icon name="Sparkles" size={14} /> Use demo credentials
        </button>
      </form>
    </AuthLayout>
  )
}
