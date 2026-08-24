import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context';

/**
 * ProtectedRoute
 *
 * Wraps any route that requires authentication.
 * - While auth is being verified (loading=true): shows a spinner.
 * - If unauthenticated: redirects to /login, preserving the
 *   attempted URL in location.state so Login can redirect back.
 * - If authenticated: renders children normally.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" aria-label="Loading" />
        <p>Loading FitForge…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
