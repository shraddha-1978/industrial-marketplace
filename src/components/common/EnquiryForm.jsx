import { useState } from 'react'
import Icon from './Icon'
import { useApp } from '../../context/AppContext'
import './EnquiryForm.css'

const initial = {
  name: '',
  email: '',
  phone: '',
  product: '',
  quantity: '',
  location: '',
  message: '',
}

export default function EnquiryForm({
  defaultProduct = '',
  defaultSupplier = '',
  defaultQuantity = '',
  onSuccess,
  submitLabel = 'Submit Enquiry',
}) {
  const { authUser, addEnquiry } = useApp()
  const [form, setForm] = useState({
    ...initial,
    name: authUser?.name || '',
    email: authUser?.email || '',
    phone: authUser?.phone || '',
    location: authUser?.location || '',
    product: defaultProduct,
    quantity: defaultQuantity,
  })
  const [errors, setErrors] = useState({})
  const [done, setDone] = useState(false)

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    setErrors((er) => ({ ...er, [key]: undefined }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Please enter your name'
    if (!form.email.trim()) e.email = 'Please enter your email'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.phone.trim()) e.phone = 'Please enter your phone number'
    else if (!/^[0-9+\-\s]{8,15}$/.test(form.phone.trim())) e.phone = 'Enter a valid phone number'
    if (!form.product.trim()) e.product = 'Please enter the product required'
    if (!form.quantity.trim()) e.quantity = 'Please enter the quantity'
    if (!form.location.trim()) e.location = 'Please enter your location'
    return e
  }

  const submit = (ev) => {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) {
      setErrors(e)
      return
    }
    addEnquiry({
      ...form,
      product: form.product.trim(),
      supplier: defaultSupplier || '',
      quantity: form.quantity.trim(),
      location: form.location.trim(),
    })
    setDone(true)
    setForm({ ...initial, product: defaultProduct, quantity: defaultQuantity })
    onSuccess?.()
    setTimeout(() => setDone(false), 5000)
  }

  return (
    <form className="enquiry-form" onSubmit={submit} noValidate>
      {done && (
        <div className="alert alert-success ef-success">
          <Icon name="CheckCircle2" size={18} />
          <div>
            <strong>Enquiry submitted!</strong> Verified suppliers will contact you with their best price shortly.
          </div>
        </div>
      )}

      <div className="form-grid">
        <div className="field">
          <label>
            Customer Name <span className="req">*</span>
          </label>
          <input
            className={`input ${errors.name ? 'field-error' : ''}`}
            value={form.name}
            onChange={set('name')}
            placeholder="Your full name"
          />
          {errors.name && <span className="error-text"><Icon name="AlertCircle" size={13} /> {errors.name}</span>}
        </div>

        <div className="field">
          <label>
            Email Address <span className="req">*</span>
          </label>
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
          <label>
            Phone Number <span className="req">*</span>
          </label>
          <input
            className={`input ${errors.phone ? 'field-error' : ''}`}
            value={form.phone}
            onChange={set('phone')}
            placeholder="+91 98765 43210"
          />
          {errors.phone && <span className="error-text"><Icon name="AlertCircle" size={13} /> {errors.phone}</span>}
        </div>

        <div className="field">
          <label>
            Quantity Required <span className="req">*</span>
          </label>
          <input
            className={`input ${errors.quantity ? 'field-error' : ''}`}
            value={form.quantity}
            onChange={set('quantity')}
            placeholder="e.g. 50 Units"
          />
          {errors.quantity && <span className="error-text"><Icon name="AlertCircle" size={13} /> {errors.quantity}</span>}
        </div>

        <div className="field">
          <label>
            Product Required <span className="req">*</span>
          </label>
          <input
            className={`input ${errors.product ? 'field-error' : ''}`}
            value={form.product}
            onChange={set('product')}
            placeholder="Product name or specification"
          />
          {errors.product && <span className="error-text"><Icon name="AlertCircle" size={13} /> {errors.product}</span>}
        </div>

        <div className="field">
          <label>
            Location / City <span className="req">*</span>
          </label>
          <input
            className={`input ${errors.location ? 'field-error' : ''}`}
            value={form.location}
            onChange={set('location')}
            placeholder="City, State"
          />
          {errors.location && <span className="error-text"><Icon name="AlertCircle" size={13} /> {errors.location}</span>}
        </div>

        <div className="field full">
          <label>Message / Requirements</label>
          <textarea
            className="textarea"
            value={form.message}
            onChange={set('message')}
            placeholder="Describe your requirements, specifications, delivery timeline, etc."
          />
        </div>
      </div>

      <div className="ef-footer">
        <p className="ef-note">
          <Icon name="ShieldCheck" size={15} /> Your details are shared only with verified suppliers.
        </p>
        <button type="submit" className="btn btn-primary btn-lg">
          <Icon name="Send" size={17} /> {submitLabel}
        </button>
      </div>
    </form>
  )
}
