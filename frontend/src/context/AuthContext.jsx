import { createContext, useContext } from 'react';

const AuthContext = createContext(null);

/**
 * useAuth — consume AuthContext inside any component.
 * Must be used within an AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
