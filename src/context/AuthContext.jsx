import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = sessionStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback((userData) => {
    sessionStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('bookmarks');
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUser) => {
    sessionStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  }, []);

  // Memoize context value — prevents all consumers re-rendering when unrelated state changes
  const value = useMemo(() => ({ user, login, logout, updateUser }), [user, login, logout, updateUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}