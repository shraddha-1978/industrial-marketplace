import { Link } from 'react-router-dom'
import Icon from './common/Icon'
import Stars from './common/Stars'
import ProductImage from './common/ProductImage'
import { getCategoryById } from '../data/categories'
import { getSupplierById } from '../data/suppliers'
import { useApp } from '../context/AppContext'
import './ProductCard.css'

export default function ProductCard({ product }) {
  const { isComparing, toggleCompare, isFavourite, toggleFavourite, openEnquiry } = useApp()
  const cat = getCategoryById(product.categoryId)
  const supplier = getSupplierById(product.supplierId)
  const comparing = isComparing(product.id)
  const fav = isFavourite(product.id)
  const discount = product.mrp && product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0

  return (
    <article className="pcard card card-hover">
      <div className="pcard-media">
        <Link to={`/products/${product.id}`} aria-label={product.name}>
          <ProductImage product={product} size="sm" />
        </Link>

        <div className="pcard-badges">
          {product.featured && <span className="badge badge-amber"><Icon name="Sparkles" size={11} /> Featured</span>}
          {product.verified && <span className="badge badge-green"><Icon name="BadgeCheck" size={11} /> Verified</span>}
          {!product.inStock && <span className="badge badge-red">Out of Stock</span>}
        </div>

        <div className="pcard-quick">
          <button
            className={`pc-ic ${fav ? 'active' : ''}`}
            onClick={() => toggleFavourite(product.id)}
            title={fav ? 'Remove from favourites' : 'Add to favourites'}
            aria-label="Toggle favourite"
          >
            <Icon name="Heart" size={17} fill={fav ? 'currentColor' : 'none'} />
          </button>
          <button
            className={`pc-ic ${comparing ? 'active' : ''}`}
            onClick={() => toggleCompare(product.id)}
            title={comparing ? 'Remove from compare' : 'Add to compare'}
            aria-label="Toggle compare"
          >
            <Icon name="GitCompare" size={17} />
          </button>
        </div>

        {discount > 0 && <span className="pcard-discount">{discount}% OFF</span>}
      </div>

      <div className="pcard-body">
        <div className="pcard-cat">
          {cat && (
            <Link to={`/products?category=${cat.id}`} className="pcard-cat-link">
              {cat.name}
            </Link>
          )}
          {supplier && <span className="pcard-supplier">by {supplier.name}</span>}
        </div>

        <Link to={`/products/${product.id}`} className="pcard-name">
          {product.name}
        </Link>
        <p className="pcard-desc">{product.shortDesc}</p>

        <div className="pcard-rating">
          <Stars value={product.rating} count={product.reviewCount} />
        </div>

        <div className="pcard-price-row">
          <div className="pcard-price">
            <span className="pp-now">₹{product.price.toLocaleString('en-IN')}</span>
            <span className="pp-unit">{product.priceUnit}</span>
          </div>
          {discount > 0 && (
            <span className="pp-mrp">₹{product.mrp.toLocaleString('en-IN')}</span>
          )}
        </div>

        <div className="pcard-meta">
          <span className="pm-item"><Icon name="Package" size={13} /> MOQ: {product.minOrder} {product.priceUnit.replace('/', '').trim()}</span>
          {product.inStock ? (
            <span className="pm-item pm-instock"><Icon name="CheckCircle2" size={13} /> In Stock</span>
          ) : (
            <span className="pm-item pm-outstock"><Icon name="XCircle" size={13} /> Out of Stock</span>
          )}
        </div>
      </div>

      <div className="pcard-actions">
        <Link to={`/products/${product.id}`} className="btn btn-outline btn-sm pc-btn">
          <Icon name="Eye" size={15} /> Details
        </Link>
        <button
          className="btn btn-primary btn-sm pc-btn"
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
          <Icon name="BadgeIndianRupee" size={15} /> Get Best Price
        </button>
      </div>
    </article>
  )
}
