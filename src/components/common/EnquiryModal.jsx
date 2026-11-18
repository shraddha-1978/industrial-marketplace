import { useEffect } from 'react'
import Icon from './Icon'
import EnquiryForm from './EnquiryForm'
import { useApp } from '../../context/AppContext'
import './Modal.css'

export default function EnquiryModal() {
  const { enquiryTarget, closeEnquiry } = useApp()

  useEffect(() => {
    if (!enquiryTarget) return
    const onKey = (e) => e.key === 'Escape' && closeEnquiry()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [enquiryTarget, closeEnquiry])

  if (!enquiryTarget) return null

  const isSupplier = enquiryTarget.kind === 'supplier'
  const heading = isSupplier
    ? `Send Enquiry to Supplier`
    : `Get Best Price`

  return (
    <div className="modal-overlay" onMouseDown={closeEnquiry}>
      <div
        className="modal enquiry-modal scale-in"
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-head">
          <div>
            <h3>{heading}</h3>
            <p className="modal-sub">
              {isSupplier ? 'Share your requirement and the supplier will respond with a quote.' : 'Submit your requirement and receive competitive quotations from verified suppliers.'}
            </p>
          </div>
          <button className="modal-close" onClick={closeEnquiry} aria-label="Close">
            <Icon name="X" size={20} />
          </button>
        </div>

        {!isSupplier && enquiryTarget.price != null && (
          <div className="em-product">
            <span className="em-product-name">{enquiryTarget.name}</span>
            <span className="em-product-price">
              ₹{enquiryTarget.price.toLocaleString('en-IN')} {enquiryTarget.unit}
            </span>
          </div>
        )}
        {isSupplier && (
          <div className="em-product">
            <span className="em-product-name">{enquiryTarget.name}</span>
            <span className="badge badge-blue">Supplier Enquiry</span>
          </div>
        )}

        <EnquiryForm
          key={`${enquiryTarget.kind}-${enquiryTarget.id}`}
          defaultProduct={enquiryTarget.name || ''}
          defaultSupplier={isSupplier ? enquiryTarget.name : ''}
          onSuccess={() => setTimeout(closeEnquiry, 1800)}
        />
      </div>
    </div>
  )
}
