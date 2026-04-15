import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user in localStorage
    const storedUser = localStorage.getItem('user');
    console.log('AuthContext: storedUser from localStorage:', storedUser);
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      console.log('AuthContext: parsed user data:', userData);
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    // Clear any existing user data first
    localStorage.removeItem('user');
    // Set new user data
    console.log('AuthContext.login: setting user data:', userData);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    console.log('AuthContext.login: stored to localStorage:', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
