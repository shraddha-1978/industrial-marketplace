import { Link } from 'react-router-dom'
import Icon from '../components/common/Icon'
import CategoryCard from '../components/CategoryCard'
import Breadcrumb from '../components/common/Breadcrumb'
import { categories } from '../data/categories'
import { products } from '../data/products'
import './CategoriesPage.css'

export default function CategoriesPage() {
  const crumbs = [{ label: 'Home', path: '/' }, { label: 'Categories' }]

  return (
    <main className="categories-page">
      <div className="cp-hero">
        <div className="container">
          <h1>Browse All Categories</h1>
          <p>Explore our comprehensive range of industrial product categories</p>
        </div>
      </div>

      <div className="container">
        <Breadcrumb items={crumbs} />

        <div className="cp-grid">
          {categories.map((cat) => {
            const catProducts = products.filter((p) => p.categoryId === cat.id)
            return (
              <div key={cat.id} className="cp-row card">
                <div className="cpr-left" style={{ '--ca': cat.accent, '--cal': cat.accentLight }}>
                  <span className="cpr-icon">
                    <Icon name={cat.icon} size={34} strokeWidth={1.6} />
                  </span>
                  <div className="cpr-info">
                    <h2>{cat.name}</h2>
                    <p>{cat.description}</p>
                    <div className="cpr-meta">
                      <span>
                        <Icon name="Package" size={14} /> {cat.productCount.toLocaleString('en-IN')}+ Products
                      </span>
                      <span>
                        <Icon name="Boxes" size={14} /> {catProducts.length} in catalogue
                      </span>
                    </div>
                  </div>
                </div>

                <div className="cpr-products">
                  {catProducts.slice(0, 3).map((p) => (
                    <Link key={p.id} to={`/products/${p.id}`} className="cpr-product">
                      <span
                        className="cpr-prod-ic"
                        style={{ background: cat.accentLight, color: cat.accent }}
                      >
                        <Icon name={cat.icon} size={18} />
                      </span>
                      <div>
                        <span className="cpr-prod-name ellipsis-1">{p.name}</span>
                        <span className="cpr-prod-price">
                          ₹{p.price.toLocaleString('en-IN')} {p.priceUnit}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="cpr-cta">
                  <Link to={`/products?category=${cat.id}`} className="btn btn-primary">
                    View All Products <Icon name="ArrowRight" size={16} />
                  </Link>
                  <div className="cpr-keywords">
                    {cat.keywords.slice(0, 4).map((k) => (
                      <Link key={k} to={`/products?search=${k}`} className="chip">
                        {k}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick nav grid */}
        <div className="cp-quick">
          <h3>Quick Browse</h3>
          <div className="cp-quick-grid">
            {categories.map((c) => (
              <CategoryCard key={c.id} category={c} variant="compact" />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
