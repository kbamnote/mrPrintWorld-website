import { useCallback, useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import * as api from './adminApi'
import { AuthContext } from './authContext'
import AdminLayout from './AdminLayout'
import Login from './Login'
import Dashboard from './Dashboard'
import ProductList from './products/ProductList'
import ProductForm from './products/ProductForm'
import CategoryTree from './categories/CategoryTree'
import OptionGroupList from './options/OptionGroupList'
import CustomerList from './customers/CustomerList'
import OrganizationList from './organizations/OrganizationList'
import OrganizationDetail from './organizations/OrganizationDetail'

/**
 * The admin panel. Loaded as a single lazy chunk from App.jsx, so none of this
 * code — nor its dependencies — ships to ordinary visitors.
 */
export default function AdminApp() {
  const [user, setUser] = useState(null)
  const [booting, setBooting] = useState(true)

  const signOut = useCallback(async () => {
    await api.logout()
    setUser(null)
  }, [])

  useEffect(() => {
    // The access token lives in memory, so a page refresh always starts
    // logged-out until the httpOnly refresh cookie is exchanged.
    api.setUnauthenticatedHandler(() => setUser(null))
    api
      .restoreSession()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setBooting(false))
  }, [])

  if (booting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <span className="h-7 w-7 animate-spin rounded-full border-2 border-line border-t-primary motion-reduce:animate-none" />
      </div>
    )
  }

  if (!user) {
    return (
      <AuthContext.Provider value={{ user, setUser, signOut }}>
        <Login onSignedIn={setUser} />
      </AuthContext.Provider>
    )
  }

  return (
    <AuthContext.Provider value={{ user, setUser, signOut }}>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/:id" element={<ProductForm />} />
          <Route path="categories" element={<CategoryTree />} />
          <Route path="options" element={<OptionGroupList />} />
          <Route path="customers" element={<CustomerList />} />
          <Route path="organizations" element={<OrganizationList />} />
          <Route path="organizations/:id" element={<OrganizationDetail />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </AuthContext.Provider>
  )
}
