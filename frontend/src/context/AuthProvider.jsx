import { useState, useEffect, useCallback } from 'react';
import AuthContext from './AuthContext';
import { authService } from '../services';

const TOKEN_KEY = 'fitforge_token';

/**
 * AuthProvider — manages JWT token lifecycle.
 *
 * On mount:   reads stored token from localStorage and validates
 *             it against GET /api/auth/profile.
 * login():    calls POST /api/auth/login, stores token.
 * register(): calls POST /api/auth/register, stores token.
 * logout():   clears token from storage and resets state.
 *
 * Exposes via context:
 *   user, token, loading, isAuthenticated, login, register, logout
 */
export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [token,   setToken]   = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true); // blocks render until initial check done

  // Validate stored token on app mount
  useEffect(() => {
    const validateToken = async () => {
      const stored = localStorage.getItem(TOKEN_KEY);
      if (stored) {
        try {
          const { data } = await authService.profile();
          if (data.success) setUser(data);
        } catch {
          // Token expired or invalid — clear it silently
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
        }
      }
      setLoading(false);
    };
    validateToken();
  }, []);

  const login = useCallback(async (credentials) => {
    const { data } = await authService.login(credentials);
    if (data.success) {
      localStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      setUser(data);
    }
    return data;
  }, []);

  const register = useCallback(async (userData) => {
    const { data } = await authService.register(userData);
    if (data.success) {
      localStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      setUser(data);
    }
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
