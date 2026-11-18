import { Link } from 'react-router-dom'
import Icon from '../components/common/Icon'
import Stars from '../components/common/Stars'
import ProductImage from '../components/common/ProductImage'
import Breadcrumb from '../components/common/Breadcrumb'
import { useApp } from '../context/AppContext'
import { getProductById } from '../data/products'
import { getCategoryById } from '../data/categories'
import { getSupplierById } from '../data/suppliers'
import './ComparePage.css'

export default function ComparePage() {
  const { compareIds, removeFromCompare, clearCompare, openEnquiry } = useApp()
  const products = compareIds.map(getProductById).filter(Boolean)

  if (products.length === 0) {
    return (
      <main className="container compare-empty">
        <div className="empty-state">
          <Icon name="GitCompare" />
          <h3>Your comparison list is empty</h3>
          <p>Add up to 4 products using the compare icon on any product card to see them side by side.</p>
          <Link to="/products" className="btn btn-primary btn-lg">
            <Icon name="Search" size={18} /> Browse Products
          </Link>
        </div>
      </main>
    )
  }

  // Build the union of spec labels across compared products.
  const specLabels = [...new Set(products.flatMap((p) => p.specs.map((s) => s.label)))]
  const getSpec = (p, label) => p.specs.find((s) => s.label === label)?.value || '—'

  const crumbs = [{ label: 'Home', path: '/' }, { label: 'Compare' }]

  return (
    <main className="compare-page">
      <div className="container">
        <Breadcrumb items={crumbs} />

        <div className="cp-head">
          <div>
            <h1>Compare Products</h1>
            <p>Side-by-side comparison of {products.length} product{products.length > 1 ? 's' : ''}</p>
          </div>
          <div className="cp-head-actions">
            <Link to="/products" className="btn btn-outline btn-sm"><Icon name="Plus" size={15} /> Add More</Link>
            <button className="btn btn-ghost btn-sm" onClick={clearCompare}><Icon name="Trash2" size={15} /> Clear All</button>
          </div>
        </div>

        <div className="compare-table-wrap card">
          <div className="compare-table-scroll">
            <table className="compare-table">
              <tbody>
                {/* Product header */}
                <tr className="ct-header-row">
                  <td className="ct-label-col">Product</td>
                  {products.map((p) => {
                    const cat = getCategoryById(p.categoryId)
                    return (
                      <td key={p.id} className="ct-product-col">
                        <div className="ct-prod-top">
                          <button className="ct-remove" onClick={() => removeFromCompare(p.id)} aria-label="Remove from compare">
                            <Icon name="X" size={14} />
                          </button>
                          <span className="ct-cat" style={{ color: cat?.accent }}>{cat?.name}</span>
                        </div>
                        <Link to={`/products/${p.id}`} className="ct-thumb">
                          <ProductImage product={p} size="sm" />
                        </Link>
                        <Link to={`/products/${p.id}`} className="ct-name">{p.name}</Link>
                      </td>
                    )
                  })}
                </tr>

                {/* Price */}
                <tr>
                  <td className="ct-label-col"><span className="ct-attr"><Icon name="BadgeIndianRupee" size={14} /> Price</span></td>
                  {products.map((p) => (
                    <td key={p.id} className="ct-product-col">
                      <span className="ct-price">₹{p.price.toLocaleString('en-IN')}</span>
                      <span className="ct-unit">{p.priceUnit}</span>
                    </td>
                  ))}
                </tr>

                {/* Rating */}
                <tr>
                  <td className="ct-label-col"><span className="ct-attr"><Icon name="Star" size={14} /> Rating</span></td>
                  {products.map((p) => (
                    <td key={p.id} className="ct-product-col">
                      <Stars value={p.rating} count={p.reviewCount} />
                    </td>
                  ))}
                </tr>

                {/* Brand */}
                <tr>
                  <td className="ct-label-col"><span className="ct-attr"><Icon name="Tag" size={14} /> Brand</span></td>
                  {products.map((p) => (
                    <td key={p.id} className="ct-product-col">{p.brand}</td>
                  ))}
                </tr>

                {/* Supplier */}
                <tr>
                  <td className="ct-label-col"><span className="ct-attr"><Icon name="Building2" size={14} /> Supplier</span></td>
                  {products.map((p) => {
                    const s = getSupplierById(p.supplierId)
                    return (
                      <td key={p.id} className="ct-product-col">
                        <Link to={`/suppliers/${s?.id}`} className="ct-supplier">{s?.name}</Link>
                      </td>
                    )
                  })}
                </tr>

                {/* MOQ */}
                <tr>
                  <td className="ct-label-col"><span className="ct-attr"><Icon name="Package" size={14} /> Min. Order</span></td>
                  {products.map((p) => (
                    <td key={p.id} className="ct-product-col">{p.minOrder} {p.priceUnit.replace('/', '').trim()}</td>
                  ))}
                </tr>

                {/* Stock */}
                <tr>
                  <td className="ct-label-col"><span className="ct-attr"><Icon name="Boxes" size={14} /> Stock</span></td>
                  {products.map((p) => (
                    <td key={p.id} className="ct-product-col">
                      {p.inStock ? (
                        <span className="badge badge-green"><Icon name="CheckCircle2" size={11} /> In Stock</span>
                      ) : (
                        <span className="badge badge-red">Out of Stock</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Verified */}
                <tr>
                  <td className="ct-label-col"><span className="ct-attr"><Icon name="BadgeCheck" size={14} /> Verified</span></td>
                  {products.map((p) => (
                    <td key={p.id} className="ct-product-col">
                      {p.verified ? (
                        <span className="badge badge-green"><Icon name="BadgeCheck" size={11} /> Yes</span>
                      ) : (
                        <span className="badge badge-grey">No</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Spec rows */}
                {specLabels.map((label) => (
                  <tr key={label}>
                    <td className="ct-label-col"><span className="ct-attr">{label}</span></td>
                    {products.map((p) => (
                      <td key={p.id} className="ct-product-col">{getSpec(p, label)}</td>
                    ))}
                  </tr>
                ))}

                {/* Description */}
                <tr>
                  <td className="ct-label-col"><span className="ct-attr"><Icon name="FileText" size={14} /> Description</span></td>
                  {products.map((p) => (
                    <td key={p.id} className="ct-product-col">
                      <p className="ct-desc">{p.shortDesc}</p>
                    </td>
                  ))}
                </tr>

                {/* Action */}
                <tr className="ct-action-row">
                  <td className="ct-label-col" />
                  {products.map((p) => (
                    <td key={p.id} className="ct-product-col">
                      <div className="ct-actions">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => openEnquiry({ kind: 'product', id: p.id, name: p.name, price: p.price, unit: p.priceUnit })}
                        >
                          <Icon name="BadgeIndianRupee" size={14} /> Get Best Price
                        </button>
                        <Link to={`/products/${p.id}`} className="btn btn-outline btn-sm">Details</Link>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}
