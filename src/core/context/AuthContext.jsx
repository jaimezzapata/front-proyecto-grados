import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('evalia_token') || null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('evalia_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Escuchar expiración o token inválido emitido por el httpClient
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('evalia:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('evalia:unauthorized', handleUnauthorized);
  }, []);

  const saveAuthSession = (authToken, authUser) => {
    setToken(authToken);
    setUser(authUser);
    localStorage.setItem('evalia_token', authToken);
    localStorage.setItem('evalia_user', JSON.stringify(authUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('evalia_token');
    localStorage.removeItem('evalia_user');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: Boolean(token && user),
        loading,
        setLoading,
        saveAuthSession,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
