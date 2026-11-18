import { Routes, Route, Link } from 'react-router-dom'
import Icon from './components/common/Icon'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/common/ScrollToTop'
import CompareBar from './components/CompareBar'
import EnquiryModal from './components/common/EnquiryModal'
import './App.css'

import HomePage from './pages/HomePage'
import ProductCataloguePage from './pages/ProductCataloguePage'
import ProductDetailPage from './pages/ProductDetailPage'
import SuppliersPage from './pages/SuppliersPage'
import SupplierDetailPage from './pages/SupplierDetailPage'
import CategoriesPage from './pages/CategoriesPage'
import ComparePage from './pages/ComparePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import EnquiryPage from './pages/EnquiryPage'
import BecomeSupplierPage from './pages/BecomeSupplierPage'

function NotFound() {
  return (
    <main className="nf-page container">
      <span className="nf-code">404</span>
      <h1 className="nf-title">Page Not Found</h1>
      <p className="nf-sub">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
      <Link to="/" className="btn btn-primary btn-lg">
        <Icon name="ArrowLeft" size={18} /> Back to Home
      </Link>
    </main>
  )
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductCataloguePage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/suppliers" element={<SuppliersPage />} />
          <Route path="/suppliers/:id" element={<SupplierDetailPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/enquiry" element={<EnquiryPage />} />
          <Route path="/become-supplier" element={<BecomeSupplierPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <CompareBar />
      <Footer />
      <EnquiryModal />
    </>
  )
}
