import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Icon from '../components/common/Icon'
import Stars from '../components/common/Stars'
import ProductImage from '../components/common/ProductImage'
import ProductCard from '../components/ProductCard'
import ReviewCard from '../components/common/ReviewCard'
import Breadcrumb from '../components/common/Breadcrumb'
import { getProductById, getProductsByCategory } from '../data/products'
import { getCategoryById } from '../data/categories'
import { getSupplierById } from '../data/suppliers'
import { getReviewsForProduct } from '../data/reviews'
import { useApp } from '../context/AppContext'
import './ProductDetailPage.css'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { openEnquiry, isComparing, toggleCompare, isFavourite, toggleFavourite } = useApp()

  const product  = getProductById(id)
  const [qty, setQty]               = useState(product?.minOrder ?? 1)
  const [tab, setTab]               = useState('description')
  const [thumb, setThumb]           = useState(0)
  const [localReviews, setLocalReviews] = useState([])
  const reviewFormRef = useRef(null)

  // Reset state when navigating between products (id changes).
  useEffect(() => {
    setQty(product?.minOrder ?? 1)
    setTab('description')
    setThumb(0)
    setLocalReviews([])
  }, [id, product?.minOrder])

  if (!product) {
    return (
      <main className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="empty-state">
          <Icon name="Package" />
          <h3>Product not found</h3>
          <p>The product you're looking for doesn't exist or was removed.</p>
          <button className="btn btn-primary" onClick={() => navigate('/products')}>
            Browse Products
          </button>
        </div>
      </main>
    )
  }

  const cat      = getCategoryById(product.categoryId)
  const supplier = getSupplierById(product.supplierId)
  const reviews  = [...localReviews, ...getReviewsForProduct(product.id)]
  const related  = getProductsByCategory(product.categoryId)
    .filter((p) => p.id !== product.id)
    .slice(0, 4)
  const comparing = isComparing(product.id)
  const fav       = isFavourite(product.id)
  const discount  =
    product.mrp && product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0

  // Recompute average each time localReviews changes.
  const allReviews = [...localReviews, ...getReviewsForProduct(product.id)]
  const avgRating  =
    allReviews.length
      ? (allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length).toFixed(1)
      : product.rating

  const crumbs = [
    { label: 'Home',     path: '/' },
    { label: 'Products', path: '/products' },
    { label: cat?.name,  path: `/products?category=${cat?.id}` },
    { label: product.name },
  ]

  const handleQtyChange = (e) => {
    const val = Number(e.target.value)
    if (!isNaN(val) && val >= product.minOrder) setQty(val)
  }

  const addReview = (e) => {
    e.preventDefault()
    const form   = e.target
    const name   = form.reviewName.value.trim()
    const text   = form.reviewText.value.trim()
    const rating = Number(form.reviewRating.value)
    if (!name || !text || !rating) return
    setLocalReviews((prev) => [
      {
        id: Date.now(),
        name,
        role: 'Verified Buyer',
        rating,
        date: new Date().toLocaleDateString('en-IN', {
          day: '2-digit', month: 'short', year: 'numeric',
        }),
        text,
      },
      ...prev,
    ])
    form.reset()   // ← properly resets all named fields
  }

  const goToReviews = () => {
    setTab('reviews')
    setTimeout(() => {
      reviewFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  }

  return (
    <main className="pdp">
      <div className="container">
        <Breadcrumb items={crumbs} />

        {/* ── Top grid: gallery | info | supplier card ── */}
        <div className="pdp-top">

          {/* Gallery */}
          <div className="pdp-gallery">
            <div className="pdp-main-img">
              <ProductImage product={product} seedKey={`${product.id}-${thumb}`} />
              <div className="pdp-img-badges">
                {product.verified && (
                  <span className="badge badge-green">
                    <Icon name="BadgeCheck" size={12} /> Verified
                  </span>
                )}
                {product.featured && (
                  <span className="badge badge-amber">
                    <Icon name="Sparkles" size={12} /> Featured
                  </span>
                )}
                {!product.inStock && (
                  <span className="badge badge-red">Out of Stock</span>
                )}
              </div>
              {discount > 0 && (
                <span className="pdp-main-discount">{discount}% OFF</span>
              )}
            </div>

            {/* Thumbnails */}
            <div className="pdp-thumbs">
              {[0, 1, 2, 3].map((i) => (
                <button
                  key={i}
                  className={`pdp-thumb ${thumb === i ? 'active' : ''}`}
                  onClick={() => setThumb(i)}
                  aria-label={`View image ${i + 1}`}
                >
                  <ProductImage
                    product={product}
                    size="sm"
                    seedKey={`${product.id}-${i}`}
                  />
                </button>
              ))}
            </div>

            {/* Action row */}
            <div className="pdp-share-row">
              <button
                className={`pdp-share-btn ${fav ? 'fav-active' : ''}`}
                onClick={() => toggleFavourite(product.id)}
                aria-label={fav ? 'Remove from favourites' : 'Add to favourites'}
              >
                <Icon
                  name="Heart"
                  size={16}
                  fill={fav ? 'currentColor' : 'none'}
                />
                {fav ? 'Saved' : 'Save'}
              </button>
              <button
                className={`pdp-share-btn ${comparing ? 'cmp-active' : ''}`}
                onClick={() => toggleCompare(product.id)}
                aria-label={comparing ? 'Remove from compare' : 'Add to compare'}
              >
                <Icon name="GitCompare" size={16} />
                {comparing ? 'Comparing' : 'Compare'}
              </button>
              <button className="pdp-share-btn" onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: product.name, url: window.location.href })
                } else {
                  navigator.clipboard?.writeText(window.location.href)
                }
              }}>
                <Icon name="Share2" size={16} /> Share
              </button>
            </div>
          </div>

          {/* Product info */}
          <div className="pdp-info">
            <div className="pdp-brand-row">
              <span className="pdp-brand">{product.brand}</span>
              <Link to={`/products?category=${cat?.id}`} className="pdp-cat-link">
                {cat?.name}
              </Link>
            </div>

            <h1 className="pdp-name">{product.name}</h1>

            <div className="pdp-rating-row">
              <Stars value={Number(avgRating)} count={allReviews.length || product.reviewCount} />
              <button className="pdp-reviews-link" onClick={goToReviews}>
                Read Reviews
              </button>
              <span className={`pdp-stock ${product.inStock ? 'instock' : 'outstock'}`}>
                <Icon name={product.inStock ? 'CheckCircle2' : 'XCircle'} size={14} />
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <div className="pdp-price-box">
              <div className="pdp-price-main">
                <span className="pp-now">₹{product.price.toLocaleString('en-IN')}</span>
                <span className="pp-unit">{product.priceUnit}</span>
                {discount > 0 && (
                  <span className="pp-mrp">₹{product.mrp.toLocaleString('en-IN')}</span>
                )}
              </div>
              {discount > 0 && (
                <span className="pdp-discount">Save {discount}%</span>
              )}
            </div>

            <p className="pdp-short">{product.shortDesc}</p>

            {/* Key specs grid */}
            {product.specs.length > 0 && (
              <div className="pdp-keyspecs">
                {product.specs.slice(0, 4).map((s) => (
                  <div key={s.label} className="ks-item">
                    <span className="ks-label">{s.label}</span>
                    <span className="ks-value">{s.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* MOQ + quantity stepper */}
            <div className="pdp-qty-row">
              <div className="pdp-moq">
                <Icon name="Package" size={15} />
                <span>
                  Min. Order:{' '}
                  <strong>
                    {product.minOrder} {product.priceUnit.replace('/', '').trim()}
                  </strong>
                </span>
              </div>
              <div className="qty-control" role="group" aria-label="Quantity">
                <button
                  onClick={() => setQty((q) => Math.max(product.minOrder, q - 1))}
                  aria-label="Decrease quantity"
                >
                  <Icon name="Minus" size={15} />
                </button>
                <input
                  type="number"
                  value={qty}
                  onChange={handleQtyChange}
                  min={product.minOrder}
                  aria-label="Quantity"
                />
                <button
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Increase quantity"
                >
                  <Icon name="Plus" size={15} />
                </button>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="pdp-actions">
              <button
                className="btn btn-amber btn-lg pdp-buy"
                disabled={!product.inStock}
                onClick={() =>
                  openEnquiry({
                    kind: 'product',
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    unit: product.priceUnit,
                  })
                }
              >
                <Icon name="BadgeIndianRupee" size={18} /> Request Best Price
              </button>
              <Link
                to={`/suppliers/${supplier?.id}`}
                className="btn btn-outline btn-lg"
              >
                <Icon name="Building2" size={18} /> View Supplier
              </Link>
            </div>

            <div className="pdp-assurance">
              <span><Icon name="ShieldCheck"      size={15} /> Quality Assured</span>
              <span><Icon name="Truck"            size={15} /> Pan-India Delivery</span>
              <span><Icon name="Headset"          size={15} /> Buyer Support</span>
            </div>
          </div>

          {/* Supplier sidebar card */}
          <aside className="pdp-supplier-card card">
            <div className="psc-head">
              <span className="psc-logo" style={{ background: supplier?.accent }}>
                {supplier?.logoText}
              </span>
              <div>
                <Link to={`/suppliers/${supplier?.id}`} className="psc-name">
                  {supplier?.name}
                </Link>
                <span className="psc-loc">
                  <Icon name="MapPin" size={12} /> {supplier?.location}
                </span>
              </div>
            </div>

            {supplier?.verified && (
              <span className="badge badge-green sc-badge">
                <Icon name="BadgeCheck" size={11} /> GST Verified
              </span>
            )}

            <div className="psc-stats">
              <div>
                <strong>{supplier?.rating}</strong>
                <span>Rating</span>
              </div>
              <div>
                <strong>{supplier?.responseRate}</strong>
                <span>Response</span>
              </div>
              <div>
                <strong>{supplier?.responseTime}</strong>
                <span>Reply</span>
              </div>
            </div>

            <div className="psc-contact">
              <span>
                <Icon name="Phone" size={14} />
                <a href={`tel:${supplier?.phone}`}>{supplier?.phone}</a>
              </span>
              <span>
                <Icon name="Mail" size={14} />
                <span className="psc-email">{supplier?.email}</span>
              </span>
            </div>

            <button
              className="btn btn-primary btn-block"
              onClick={() =>
                openEnquiry({ kind: 'supplier', id: supplier?.id, name: supplier?.name })
              }
            >
              <Icon name="Send" size={16} /> Send Enquiry
            </button>
            <Link
              to={`/suppliers/${supplier?.id}`}
              className="btn btn-outline btn-block"
            >
              View Full Profile
            </Link>
          </aside>
        </div>

        {/* ── Tabs ── */}
        <div className="pdp-tabs-wrap" ref={reviewFormRef}>
          <div className="pdp-tabs" role="tablist">
            {[
              { key: 'description', label: 'Description' },
              { key: 'specs',       label: 'Specifications' },
              { key: 'reviews',     label: `Reviews (${allReviews.length})` },
            ].map(({ key, label }) => (
              <button
                key={key}
                role="tab"
                aria-selected={tab === key}
                className={tab === key ? 'active' : ''}
                onClick={() => setTab(key)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="pdp-tab-content">
            {/* Description */}
            {tab === 'description' && (
              <div className="fade-in">
                <p className="pdp-desc-text">{product.description}</p>
                <ul className="pdp-features">
                  {product.tags.map((t) => (
                    <li key={t}><Icon name="Check" size={15} /> {t}</li>
                  ))}
                  <li><Icon name="Check" size={15} /> Manufactured to industry standards</li>
                  <li><Icon name="Check" size={15} /> GST invoice &amp; test certificate available</li>
                  <li><Icon name="Check" size={15} /> Competitive bulk pricing on enquiry</li>
                </ul>
              </div>
            )}

            {/* Specifications */}
            {tab === 'specs' && (
              <div className="fade-in pdp-specs-table">
                <table>
                  <tbody>
                    {product.specs.map((s) => (
                      <tr key={s.label}>
                        <td className="ps-label">{s.label}</td>
                        <td className="ps-value">{s.value}</td>
                      </tr>
                    ))}
                    <tr>
                      <td className="ps-label">Brand</td>
                      <td className="ps-value">{product.brand}</td>
                    </tr>
                    <tr>
                      <td className="ps-label">Category</td>
                      <td className="ps-value">{cat?.name}</td>
                    </tr>
                    <tr>
                      <td className="ps-label">Min. Order Qty</td>
                      <td className="ps-value">
                        {product.minOrder} {product.priceUnit.replace('/', '').trim()}
                      </td>
                    </tr>
                    <tr>
                      <td className="ps-label">Stock Status</td>
                      <td className="ps-value">
                        {product.inStock ? (
                          <span style={{ color: 'var(--green)', fontWeight: 600 }}>In Stock</span>
                        ) : (
                          <span style={{ color: 'var(--red)', fontWeight: 600 }}>Out of Stock</span>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Reviews */}
            {tab === 'reviews' && (
              <div className="fade-in pdp-reviews">
                <div className="pr-summary">
                  {/* Score card */}
                  <div className="pr-score">
                    <span className="pr-big">{avgRating}</span>
                    <Stars value={Number(avgRating)} showValue={false} size={18} />
                    <span className="pr-count">
                      {allReviews.length} review{allReviews.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Write a review */}
                  <form className="pr-write" onSubmit={addReview} noValidate>
                    <h4>Write a Review</h4>
                    <div className="pr-write-row">
                      <input
                        name="reviewName"
                        placeholder="Your name"
                        className="input"
                        required
                      />
                      <select
                        name="reviewRating"
                        className="select"
                        required
                        defaultValue=""
                      >
                        <option value="" disabled>Rating ★</option>
                        <option value="5">★★★★★ Excellent</option>
                        <option value="4">★★★★☆ Good</option>
                        <option value="3">★★★☆☆ Average</option>
                        <option value="2">★★☆☆☆ Poor</option>
                        <option value="1">★☆☆☆☆ Terrible</option>
                      </select>
                    </div>
                    <textarea
                      name="reviewText"
                      placeholder="Share your experience with this product…"
                      className="textarea"
                      rows={3}
                      required
                    />
                    <button type="submit" className="btn btn-primary btn-sm">
                      <Icon name="Send" size={14} /> Submit Review
                    </button>
                  </form>
                </div>

                <div className="pr-list">
                  {allReviews.length === 0 ? (
                    <div className="empty-state">
                      <Icon name="MessagesSquare" />
                      <h3>No reviews yet</h3>
                      <p>Be the first to review this product.</p>
                    </div>
                  ) : (
                    allReviews.map((r) => (
                      <ReviewCard key={r.id} review={r} />
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Related products ── */}
        {related.length > 0 && (
          <section className="pdp-related">
            <div className="section-bar">
              <h2>Related Products</h2>
              <Link to={`/products?category=${cat?.id}`} className="bar-link">
                View All <Icon name="ChevronRight" size={16} />
              </Link>
            </div>
            <div className="products-grid">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
