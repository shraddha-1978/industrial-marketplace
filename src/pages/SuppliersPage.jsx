import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Icon from '../components/common/Icon'
import SupplierCard from '../components/SupplierCard'
import Breadcrumb from '../components/common/Breadcrumb'
import { suppliers } from '../data/suppliers'
import { categories } from '../data/categories'
import './SuppliersPage.css'

export default function SuppliersPage() {
  const [params, setParams] = useSearchParams()
  const [search, setSearch] = useState(params.get('search') || '')

  const catFilter = params.get('category') || ''
  const sortBy = params.get('sort') || 'rating'

  const update = (patch) => {
    const next = new URLSearchParams(params)
    Object.entries(patch).forEach(([k, v]) => {
      if (!v) next.delete(k)
      else next.set(k, v)
    })
    setParams(next, { replace: true })
  }

  const filtered = useMemo(() => {
    let list = [...suppliers]
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.location.toLowerCase().includes(q) ||
          s.specialties.some((sp) => sp.toLowerCase().includes(q)) ||
          s.description.toLowerCase().includes(q),
      )
    }
    if (catFilter) {
      list = list.filter((s) => s.categories.includes(catFilter))
    }
    if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating)
    else if (sortBy === 'trust') list.sort((a, b) => b.trustScore - a.trustScore)
    else if (sortBy === 'products') list.sort((a, b) => b.productCount - a.productCount)
    return list
  }, [search, catFilter, sortBy])

  const crumbs = [{ label: 'Home', path: '/' }, { label: 'Suppliers' }]

  return (
    <main className="suppliers-page">
      <div className="sp-hero">
        <div className="container sph-inner">
          <div>
            <h1>Find Verified Suppliers</h1>
            <p>Browse 580,000+ verified industrial suppliers across India</p>
          </div>
          <div className="sph-search">
            <div className="sph-search-wrap">
              <Icon name="Search" size={18} className="sph-icon" />
              <input
                type="text"
                placeholder="Search by name, location, product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container sp-body">
        <Breadcrumb items={crumbs} />

        <div className="sp-controls">
          <div className="sp-filters">
            <div className="sf-group">
              <label>Category</label>
              <select
                className="select"
                value={catFilter}
                onChange={(e) => update({ category: e.target.value })}
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="sp-sort-wrap">
            <span className="sp-count">
              Showing <strong>{filtered.length}</strong> suppliers
            </span>
            <div className="cat-sort">
              <Icon name="ArrowUpDown" size={15} />
              <select
                className="cat-sort-select"
                value={sortBy}
                onChange={(e) => update({ sort: e.target.value })}
              >
                <option value="rating">Sort by Rating</option>
                <option value="trust">Sort by Trust Score</option>
                <option value="products">Sort by Products</option>
              </select>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <Icon name="Building2" />
            <h3>No suppliers found</h3>
            <p>Try a different search term or category.</p>
          </div>
        ) : (
          <div className="sp-grid">
            {filtered.map((s) => (
              <SupplierCard key={s.id} supplier={s} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
