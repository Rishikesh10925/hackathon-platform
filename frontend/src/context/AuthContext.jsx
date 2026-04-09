import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'aws-amplify/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check local storage on initial load
    const storedUser = localStorage.getItem('hackathonUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (role, email, options = {}) => {
    const shouldRedirect = options.redirect ?? true;
    const userData = { role, email, isAuthenticated: true };
    setUser(userData);
    localStorage.setItem('hackathonUser', JSON.stringify(userData));

    if (shouldRedirect) {
      if (role === 'admin') navigate('/admin');
      else navigate('/judge');
    }
  };

  const logout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.warn('AWS sign out failed, clearing local session anyway:', error);
    }

    setUser(null);
    localStorage.removeItem('hackathonUser');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
