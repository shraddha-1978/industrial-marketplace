import { useSearchParams } from 'react-router-dom'
import Icon from '../components/common/Icon'
import EnquiryForm from '../components/common/EnquiryForm'
import Breadcrumb from '../components/common/Breadcrumb'
import { getProductById } from '../data/products'
import './EnquiryPage.css'

export default function EnquiryPage() {
  const [params] = useSearchParams()
  const productId = params.get('product')
  const product = productId ? getProductById(productId) : null
  const defaultProduct = product?.name || ''

  const benefits = [
    { icon: 'Send', title: 'One Enquiry, Many Quotes', text: 'Reach multiple verified suppliers with a single requirement.' },
    { icon: 'BadgeIndianRupee', title: 'Best Market Prices', text: 'Compare competitive quotations to negotiate the best deal.' },
    { icon: 'ShieldCheck', title: 'Verified Suppliers Only', text: 'Every responding supplier is GST-verified and quality-checked.' },
    { icon: 'Clock', title: 'Fast Responses', text: 'Most suppliers respond within a few hours of enquiry.' },
  ]

  return (
    <main className="enquiry-page">
      <div className="ep-hero">
        <div className="container">
          <span className="badge badge-blue ep-badge"><Icon name="Send" size={12} /> Post Your Requirement</span>
          <h1>Get the Best Price from Verified Suppliers</h1>
          <p>Tell us what you need and receive competitive quotations from trusted industrial suppliers across India.</p>
        </div>
      </div>

      <div className="container">
        <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Post Requirement' }]} />

        <div className="ep-layout">
          {/* Benefits sidebar */}
          <aside className="ep-side">
            <div className="eps-card">
              <h2>Why Post an Enquiry?</h2>
              <div className="eps-list">
                {benefits.map((b) => (
                  <div key={b.title} className="eps-item">
                    <span className="eps-ic"><Icon name={b.icon} size={20} /></span>
                    <div>
                      <strong>{b.title}</strong>
                      <p>{b.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="eps-process">
              <h3>How It Works</h3>
              <ol>
                <li><span>1</span> Fill the requirement form</li>
                <li><span>2</span> Verified suppliers receive your enquiry</li>
                <li><span>3</span> Compare received quotations</li>
                <li><span>4</span> Choose & order directly with supplier</li>
              </ol>
            </div>

            <div className="eps-trust">
              <Icon name="ShieldCheck" size={28} />
              <p>Your contact details are shared only with verified suppliers who respond to your enquiry.</p>
            </div>
          </aside>

          {/* Form */}
          <div className="ep-form-card card">
            {product && (
              <div className="ep-prefilled">
                <span className="ep-pf-label">Enquiring about:</span>
                <div className="ep-pf-product">
                  <Icon name="Package" size={18} />
                  <span>{product.name}</span>
                  <span className="ep-pf-price">₹{product.price.toLocaleString('en-IN')} {product.priceUnit}</span>
                </div>
              </div>
            )}
            <div className="ep-form-head">
              <h2>Requirement Details</h2>
              <p>Fields marked with <span className="req">*</span> are required.</p>
            </div>
            <EnquiryForm
              defaultProduct={defaultProduct}
              defaultQuantity={product ? `${product.minOrder} ${product.priceUnit.replace('/', '').trim()}` : ''}
              submitLabel="Submit Requirement"
            />
          </div>
        </div>
      </div>
    </main>
  )
}
