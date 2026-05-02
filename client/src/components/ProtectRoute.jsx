import { useContext } from 'react'
import { Navigate, useLocation } from 'react-router'
import { AuthContext } from '../context/Auth'

/**
 * ProtectedRoute
 * Wrap any route that requires authentication.
 *
 * Usage in App.jsx:
 *   <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
 */
export default function ProtectedRoute({ children }) {
  const { token } = useContext(AuthContext)
  const location  = useLocation()

  if (!token) {
    // Save the attempted URL so we can redirect back after login
    return <Navigate to="/signin" state={{ from: location }} replace />
  }

  return children
}