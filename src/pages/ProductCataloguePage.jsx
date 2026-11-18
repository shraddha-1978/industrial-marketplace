import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Icon from '../components/common/Icon'
import ProductCard from '../components/ProductCard'
import ProductImage from '../components/common/ProductImage'
import Stars from '../components/common/Stars'
import Breadcrumb from '../components/common/Breadcrumb'
import { products, brands } from '../data/products'
import { categories, getCategoryById } from '../data/categories'
import { getSupplierById } from '../data/suppliers'
import { useApp } from '../context/AppContext'
import './ProductCataloguePage.css'

const SORTS = [
  { id: 'featured', label: 'Featured First' },
  { id: 'price-asc', label: 'Price: Low → High' },
  { id: 'price-desc', label: 'Price: High → Low' },
  { id: 'rating', label: 'Top Rated' },
  { id: 'name', label: 'Name: A → Z' },
]
const PER_PAGE = 12

export default function ProductCataloguePage() {
  const [params, setParams] = useSearchParams()
  const { openEnquiry } = useApp()
  const [view, setView] = useState('grid')
  const [mobileFilters, setMobileFilters] = useState(false)
  const [page, setPage] = useState(1)

  // Derive filter state from URL params (single source of truth).
  const search        = params.get('search')   || ''
  const activeCategory = params.get('category') || ''
  const brandParam    = params.get('brand')    || ''
  const selectedBrands = brandParam ? brandParam.split(',').filter(Boolean) : []
  const minPrice      = params.get('minPrice') !== null ? params.get('minPrice') : ''
  const maxPrice      = params.get('maxPrice') !== null ? params.get('maxPrice') : ''
  const inStockOnly   = params.get('inStock')  === '1'
  const verifiedOnly  = params.get('verified') === '1'
  const sort          = params.get('sort')     || 'featured'

  // Reset to page 1 whenever any filter changes.
  useEffect(() => {
    setPage(1)
  }, [search, activeCategory, brandParam, minPrice, maxPrice, inStockOnly, verifiedOnly, sort])

  // Close mobile filter drawer on resize to desktop.
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 1024) setMobileFilters(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Lock body scroll when mobile filter drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobileFilters ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileFilters])

  const update = (patch) => {
    const next = new URLSearchParams(params)
    Object.entries(patch).forEach(([k, v]) => {
      if (v === '' || v == null || v === false) next.delete(k)
      else next.set(k, String(v))
    })
    setParams(next, { replace: true })
  }

  const toggleBrand = (brand) => {
    const next = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand]
    update({ brand: next.length ? next.join(',') : '' })
  }

  const clearAll = () => {
    setParams({}, { replace: true })
    setMobileFilters(false)
  }

  // ── Filtering & sorting ──
  const filtered = useMemo(() => {
    let list = [...products]
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter((p) => {
        const cat = getCategoryById(p.categoryId)
        return (
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.shortDesc.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          (cat && cat.name.toLowerCase().includes(q)) ||
          cat?.keywords?.some((kw) => kw.toLowerCase().includes(q))
        )
      })
    }
    if (activeCategory) list = list.filter((p) => p.categoryId === activeCategory)
    if (selectedBrands.length) list = list.filter((p) => selectedBrands.includes(p.brand))
    if (minPrice !== '') list = list.filter((p) => p.price >= Number(minPrice))
    if (maxPrice !== '') list = list.filter((p) => p.price <= Number(maxPrice))
    if (inStockOnly)   list = list.filter((p) => p.inStock)
    if (verifiedOnly)  list = list.filter((p) => p.verified)

    switch (sort) {
      case 'price-asc':  list.sort((a, b) => a.price - b.price); break
      case 'price-desc': list.sort((a, b) => b.price - a.price); break
      case 'rating':     list.sort((a, b) => b.rating - a.rating); break
      case 'name':       list.sort((a, b) => a.name.localeCompare(b.name)); break
      default:           list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }
    return list
  }, [search, activeCategory, selectedBrands, minPrice, maxPrice, inStockOnly, verifiedOnly, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const current    = Math.min(page, totalPages)
  const shown      = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE)
  const activeCat  = getCategoryById(activeCategory)

  const title = search
    ? `Results for "${search}"`
    : activeCat ? activeCat.name : 'All Products'

  const hasActiveFilters =
    activeCategory || selectedBrands.length || minPrice !== '' ||
    maxPrice !== '' || inStockOnly || verifiedOnly

  const crumbs = [{ label: 'Home', path: '/' }, { label: 'Products', path: '/products' }]
  if (activeCat) crumbs.push({ label: activeCat.name })

  // ── Sidebar (shared by desktop & mobile) ──
  const SidebarContent = () => (
    <>
      <div className="cs-head">
        <h3><Icon name="SlidersHorizontal" size={16} /> Filters</h3>
        <div className="cs-head-right">
          {hasActiveFilters && (
            <button className="cs-clear" onClick={clearAll}>Clear All</button>
          )}
          <button
            className="cs-close"
            onClick={() => setMobileFilters(false)}
            aria-label="Close filters"
          >
            <Icon name="X" size={18} />
          </button>
        </div>
      </div>

      {/* Category */}
      <div className="filter-block">
        <h4>Category</h4>
        <label className={`filter-opt ${!activeCategory ? 'checked' : ''}`}>
          <input
            type="radio"
            name="cat"
            checked={!activeCategory}
            onChange={() => update({ category: '' })}
          />
          <span>All Categories</span>
          <span className="fo-count">{products.length}</span>
        </label>
        {categories.map((c) => (
          <label
            key={c.id}
            className={`filter-opt ${activeCategory === c.id ? 'checked' : ''}`}
          >
            <input
              type="radio"
              name="cat"
              checked={activeCategory === c.id}
              onChange={() => update({ category: c.id })}
            />
            <span className="fo-ic" style={{ color: c.accent }}>
              <Icon name={c.icon} size={14} />
            </span>
            <span>{c.name}</span>
            <span className="fo-count">{c.productCount.toLocaleString('en-IN')}+</span>
          </label>
        ))}
      </div>

      {/* Price */}
      <div className="filter-block">
        <h4>Price Range (₹)</h4>
        <div className="price-inputs">
          <input
            type="number"
            placeholder="Min"
            className="input price-input"
            value={minPrice}
            onChange={(e) => update({ minPrice: e.target.value })}
            min="0"
          />
          <span className="pi-sep">—</span>
          <input
            type="number"
            placeholder="Max"
            className="input price-input"
            value={maxPrice}
            onChange={(e) => update({ maxPrice: e.target.value })}
            min="0"
          />
        </div>
        <div className="price-presets">
          {[
            { l: 'Under ₹5K',   max: 5000 },
            { l: '₹5K–50K',  min: 5000,  max: 50000 },
            { l: '₹50K–2L', min: 50000, max: 200000 },
            { l: 'Above ₹2L', min: 200000 },
          ].map((p) => (
            <button
              key={p.l}
              className={`price-preset ${
                String(minPrice) === String(p.min || '') &&
                String(maxPrice) === String(p.max || '')
                  ? 'active'
                  : ''
              }`}
              onClick={() => update({ minPrice: p.min || '', maxPrice: p.max || '' })}
            >
              {p.l}
            </button>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div className="filter-block">
        <h4>Brand</h4>
        {brands.map((b) => (
          <label key={b} className="filter-opt">
            <input
              type="checkbox"
              checked={selectedBrands.includes(b)}
              onChange={() => toggleBrand(b)}
            />
            <span>{b}</span>
          </label>
        ))}
      </div>

      {/* Availability */}
      <div className="filter-block">
        <h4>Availability</h4>
        <label className={`filter-opt ${inStockOnly ? 'checked' : ''}`}>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => update({ inStock: e.target.checked ? '1' : '' })}
          />
          <span>In Stock Only</span>
        </label>
        <label className={`filter-opt ${verifiedOnly ? 'checked' : ''}`}>
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => update({ verified: e.target.checked ? '1' : '' })}
          />
          <span>Verified Products</span>
        </label>
      </div>

      {/* Mobile apply button */}
      <div className="cs-apply">
        <button
          className="btn btn-primary btn-block"
          onClick={() => setMobileFilters(false)}
        >
          <Icon name="Check" size={16} />
          Show {filtered.length} Product{filtered.length !== 1 ? 's' : ''}
        </button>
      </div>
    </>
  )

  return (
    <main className="catalogue">
      <div className="container">
        <Breadcrumb items={crumbs} />

        {/* ── Header row ── */}
        <div className="cat-header">
          <div>
            <h1 className="cat-title">{title}</h1>
            <p className="cat-count">
              Showing <strong>{shown.length}</strong> of{' '}
              <strong>{filtered.length}</strong> products
              {activeCat && (
                <span className="cat-acc" style={{ color: activeCat.accent }}>
                  {' '}· {activeCat.productCount.toLocaleString('en-IN')}+ in category
                </span>
              )}
            </p>
          </div>
          <div className="cat-controls">
            <button
              className="cc-filter-toggle"
              onClick={() => setMobileFilters(true)}
            >
              <Icon name="SlidersHorizontal" size={16} />
              Filters
              {hasActiveFilters && <span className="cft-dot" />}
            </button>
            <div className="cat-sort">
              <Icon name="ArrowUpDown" size={15} />
              <select
                className="cat-sort-select"
                value={sort}
                onChange={(e) => update({ sort: e.target.value })}
              >
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>
            <div className="cat-view">
              <button
                className={view === 'grid' ? 'active' : ''}
                onClick={() => setView('grid')}
                aria-label="Grid view"
                title="Grid view"
              >
                <Icon name="Grid3x3" size={17} />
              </button>
              <button
                className={view === 'list' ? 'active' : ''}
                onClick={() => setView('list')}
                aria-label="List view"
                title="List view"
              >
                <Icon name="List" size={17} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Active filter chips ── */}
        {hasActiveFilters && (
          <div className="active-chips">
            {activeCat && (
              <span className="achip">
                {activeCat.name}
                <button
                  onClick={() => update({ category: '' })}
                  aria-label="Remove category filter"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            {selectedBrands.map((b) => (
              <span key={b} className="achip">
                {b}
                <button onClick={() => toggleBrand(b)} aria-label={`Remove ${b}`}>
                  <Icon name="X" size={12} />
                </button>
              </span>
            ))}
            {minPrice !== '' && (
              <span className="achip">
                Min ₹{Number(minPrice).toLocaleString('en-IN')}
                <button onClick={() => update({ minPrice: '' })}><Icon name="X" size={12} /></button>
              </span>
            )}
            {maxPrice !== '' && (
              <span className="achip">
                Max ₹{Number(maxPrice).toLocaleString('en-IN')}
                <button onClick={() => update({ maxPrice: '' })}><Icon name="X" size={12} /></button>
              </span>
            )}
            {inStockOnly && (
              <span className="achip">
                In Stock
                <button onClick={() => update({ inStock: '' })}><Icon name="X" size={12} /></button>
              </span>
            )}
            {verifiedOnly && (
              <span className="achip">
                Verified
                <button onClick={() => update({ verified: '' })}><Icon name="X" size={12} /></button>
              </span>
            )}
            <button className="achip-clear" onClick={clearAll}>
              <Icon name="Trash2" size={13} /> Clear All
            </button>
          </div>
        )}

        <div className="cat-layout">
          {/* ── Desktop sidebar ── */}
          <aside className="cat-sidebar">
            <SidebarContent />
          </aside>

          {/* ── Mobile filter drawer ── */}
          {mobileFilters && (
            <>
              <div
                className="cs-backdrop"
                onClick={() => setMobileFilters(false)}
                aria-hidden="true"
              />
              <aside className="cat-sidebar cat-sidebar-mobile scale-in">
                <SidebarContent />
              </aside>
            </>
          )}

          {/* ── Results area ── */}
          <div className="cat-results">
            {shown.length === 0 ? (
              <div className="empty-state">
                <Icon name="SearchX" />
                <h3>No products found</h3>
                <p>
                  {search
                    ? `We couldn't find anything for "${search}". Try a different keyword.`
                    : 'Try adjusting your filters.'}
                </p>
                <button className="btn btn-primary" onClick={clearAll}>
                  Clear Filters
                </button>
              </div>
            ) : view === 'grid' ? (
              <div className="products-grid">
                {shown.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="plist">
                {shown.map((p) => {
                  const supplier = getSupplierById(p.supplierId)
                  const cat      = getCategoryById(p.categoryId)
                  const discount =
                    p.mrp && p.mrp > p.price
                      ? Math.round(((p.mrp - p.price) / p.mrp) * 100)
                      : 0
                  return (
                    <article key={p.id} className="pl-row card card-hover">
                      <Link to={`/products/${p.id}`} className="pl-thumb">
                        <ProductImage product={p} size="sm" />
                      </Link>
                      <div className="pl-info">
                        <div className="pl-top">
                          <span className="pl-cat" style={{ color: cat?.accent }}>
                            {cat?.name}
                          </span>
                          {p.verified && (
                            <span className="badge badge-green">
                              <Icon name="BadgeCheck" size={11} /> Verified
                            </span>
                          )}
                          {!p.inStock && (
                            <span className="badge badge-red">Out of Stock</span>
                          )}
                        </div>
                        <Link to={`/products/${p.id}`} className="pl-name">
                          {p.name}
                        </Link>
                        <p className="pl-desc ellipsis-2">{p.description}</p>
                        <div className="pl-meta">
                          <Stars value={p.rating} count={p.reviewCount} />
                          <span className="pl-supplier">by {supplier?.name}</span>
                        </div>
                        <div className="pl-specs">
                          {p.specs.slice(0, 3).map((s) => (
                            <span key={s.label} className="pl-spec">
                              <strong>{s.label}:</strong> {s.value}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="pl-buy">
                        {discount > 0 && (
                          <span className="pl-discount">{discount}% OFF</span>
                        )}
                        <div className="pl-price">
                          <span className="pp-now">
                            ₹{p.price.toLocaleString('en-IN')}
                          </span>
                          <span className="pp-unit">{p.priceUnit}</span>
                          {discount > 0 && (
                            <span className="pp-mrp">
                              ₹{p.mrp.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                        <span className="pl-moq">
                          MOQ: {p.minOrder}{' '}
                          {p.priceUnit.replace('/', '').trim()}
                        </span>
                        <div className="pl-actions">
                          <Link
                            to={`/products/${p.id}`}
                            className="btn btn-outline btn-sm"
                          >
                            Details
                          </Link>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() =>
                              openEnquiry({
                                kind: 'product',
                                id: p.id,
                                name: p.name,
                                price: p.price,
                                unit: p.priceUnit,
                              })
                            }
                          >
                            Get Best Price
                          </button>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pg-btn"
                  disabled={current === 1}
                  onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                >
                  <Icon name="ChevronLeft" size={16} /> Prev
                </button>

                {Array.from({ length: totalPages }).map((_, i) => {
                  // Show first, last, current ±1, and ellipses.
                  const pg = i + 1
                  const show =
                    pg === 1 || pg === totalPages ||
                    (pg >= current - 1 && pg <= current + 1)
                  const showEllipsisBefore = pg === current - 2 && current > 3
                  const showEllipsisAfter  = pg === current + 2 && current < totalPages - 2

                  if (showEllipsisBefore || showEllipsisAfter) {
                    return <span key={pg} className="pg-ellipsis">…</span>
                  }
                  if (!show) return null
                  return (
                    <button
                      key={pg}
                      className={`pg-btn ${current === pg ? 'active' : ''}`}
                      onClick={() => { setPage(pg); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                    >
                      {pg}
                    </button>
                  )
                })}

                <button
                  className="pg-btn"
                  disabled={current === totalPages}
                  onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                >
                  Next <Icon name="ChevronRight" size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
