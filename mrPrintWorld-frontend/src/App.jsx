import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import RouteFallback from './components/layout/RouteFallback'
import { CustomerAuthProvider } from './lib/customerAuth'
import { CartProvider } from './lib/cart'

/**
 * Route-level code splitting.
 *
 * Home stays eagerly imported — it is the landing page and must paint without
 * waiting on a second request. Everything else loads on demand.
 *
 * This matters most for the admin subtree: without lazy loading, every visitor
 * to the homepage would download the entire admin panel (tables, forms, image
 * handling) as part of the main bundle.
 */
const Services = lazy(() => import('./pages/Services'))
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'))
const Products = lazy(() => import('./pages/Products'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const CategoryBrowse = lazy(() => import('./pages/CategoryBrowse'))
const Portfolio = lazy(() => import('./pages/Portfolio'))
const About = lazy(() => import('./pages/About'))
const Achievements = lazy(() => import('./pages/Achievements'))
const Contact = lazy(() => import('./pages/Contact'))
const Faq = lazy(() => import('./pages/Faq'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const Terms = lazy(() => import('./pages/Terms'))
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'))
const ShippingPolicy = lazy(() => import('./pages/ShippingPolicy'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Account = lazy(() => import('./pages/Account'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const OrderList = lazy(() => import('./pages/Orders').then((m) => ({ default: m.OrderList })))
const OrderDetail = lazy(() => import('./pages/Orders').then((m) => ({ default: m.OrderDetail })))
const Reseller = lazy(() => import('./pages/Reseller'))

// The whole admin panel behind a single lazy boundary — one chunk, fetched
// only when an admin actually navigates to /admin.
const AdminApp = lazy(() => import('./pages/admin/AdminApp'))

export default function App() {
  return (
    // reducedMotion="user" → every Framer Motion animation respects the OS setting
    <MotionConfig reducedMotion="user">
      <CustomerAuthProvider>
      <CartProvider>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          {/* Admin is outside the public Layout — no marketing nav or footer. */}
          <Route path="/admin/*" element={<AdminApp />} />

          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />

            <Route path="/products" element={<Products />} />
            {/* Category browsing is nested; the PRODUCT page stays flat at
                /products/:slug so its indexed URL never changes. The /c/
                segment keeps a category slug from ever colliding with a
                product slug. */}
            <Route path="/products/c/:category" element={<CategoryBrowse />} />
            <Route path="/products/c/:category/:subcategory" element={<CategoryBrowse />} />
            <Route path="/products/:slug" element={<ProductDetail />} />

            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/about" element={<About />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/contact" element={<Contact />} />
            {/* Retired. This URL is indexed by Google, so it redirects rather
                than 404s — a dead indexed page is worse than a moved one. */}
            <Route path="/request-quote" element={<Navigate to="/contact" replace />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />

            {/* Customer accounts — all noindex; they have nothing for search. */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/account" element={<Account />} />
            <Route path="/account/orders" element={<OrderList />} />
            <Route path="/account/orders/:id" element={<OrderDetail />} />
            <Route path="/account/reseller" element={<Reseller />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
      </CartProvider>
      </CustomerAuthProvider>
    </MotionConfig>
  )
}
