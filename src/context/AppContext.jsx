import { createContext, useContext, useEffect, useMemo, useState } from 'react'

/**
 * AppContext keeps lightweight client-side state that multiple pages share:
 *  - authUser: a mock signed-in buyer (persisted to localStorage)
 *  - compare:  the product comparison tray (max 4, persisted to localStorage)
 *  - favourite ids and enquiry history are also stored here for the dashboard.
 */

const STORAGE_KEYS = {
  user: 'indusmart_user',
  compare: 'indusmart_compare',
  favourites: 'indusmart_favourites',
  enquiries: 'indusmart_enquiries',
}

const readJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [authUser, setAuthUser] = useState(() => readJSON(STORAGE_KEYS.user, null))
  const [compareIds, setCompareIds] = useState(() => readJSON(STORAGE_KEYS.compare, []))
  const [favouriteIds, setFavouriteIds] = useState(() =>
    readJSON(STORAGE_KEYS.favourites, []),
  )
  const [enquiries, setEnquiries] = useState(() => readJSON(STORAGE_KEYS.enquiries, []))
  const [enquiryTarget, setEnquiryTarget] = useState(null) // { kind, id, name, price, unit }

  // Persist whenever values change.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(authUser))
  }, [authUser])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.compare, JSON.stringify(compareIds))
  }, [compareIds])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.favourites, JSON.stringify(favouriteIds))
  }, [favouriteIds])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.enquiries, JSON.stringify(enquiries))
  }, [enquiries])

  /* ---------------- Auth ---------------- */
  const login = (user) => {
    const safe = {
      id: user.id || Date.now(),
      name: user.name,
      email: user.email,
      company: user.company || '',
      phone: user.phone || '',
      location: user.location || '',
      avatarColor: user.avatarColor || '#1a5dc9',
      initials: (user.name || 'U')
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      joinedAt: user.joinedAt || new Date().toISOString(),
    }
    setAuthUser(safe)
    return safe
  }

  const logout = () => setAuthUser(null)

  const updateUser = (patch) =>
    setAuthUser((prev) => (prev ? { ...prev, ...patch } : prev))

  /* ---------------- Compare ---------------- */
  const toggleCompare = (productId) => {
    setCompareIds((prev) => {
      if (prev.includes(productId)) return prev.filter((id) => id !== productId)
      if (prev.length >= 4) return prev // max four products
      return [...prev, productId]
    })
  }

  const removeFromCompare = (productId) =>
    setCompareIds((prev) => prev.filter((id) => id !== productId))

  const clearCompare = () => setCompareIds([])

  /* ---------------- Favourites ---------------- */
  const toggleFavourite = (productId) => {
    setFavouriteIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    )
  }

  /* ---------------- Enquiry Modal ---------------- */
  const openEnquiry = (target) =>
    setEnquiryTarget({
      kind: target.kind || 'product',
      id: target.id,
      name: target.name,
      price: target.price,
      unit: target.unit,
    })
  const closeEnquiry = () => setEnquiryTarget(null)

  /* ---------------- Enquiries ---------------- */
  const addEnquiry = (enquiry) => {
    setEnquiries((prev) => [
      {
        id: Date.now(),
        status: 'Submitted',
        createdAt: new Date().toISOString(),
        ...enquiry,
      },
      ...prev,
    ])
  }

  const value = useMemo(
    () => ({
      authUser,
      isAuthenticated: !!authUser,
      login,
      logout,
      updateUser,
      compareIds,
      compareCount: compareIds.length,
      toggleCompare,
      removeFromCompare,
      clearCompare,
      isComparing: (id) => compareIds.includes(id),
      favouriteIds,
      favouriteCount: favouriteIds.length,
      toggleFavourite,
      isFavourite: (id) => favouriteIds.includes(id),
      enquiries,
      addEnquiry,
      enquiryTarget,
      openEnquiry,
      closeEnquiry,
    }),
    [authUser, compareIds, favouriteIds, enquiries, enquiryTarget],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within an AppProvider')
  return ctx
}
