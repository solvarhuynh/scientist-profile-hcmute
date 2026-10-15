import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : {
      email: 'annv@hcmute.edu.vn',
      full_name: 'GS.TS. Nguyễn Văn An',
      role: 'admin'
    };
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || 'demo-token');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && token !== 'demo-token') {
      api.getMe()
        .then(res => {
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('user', JSON.stringify(res.user));
          }
        })
        .catch(err => {
          console.warn('Session check failed, using cached session:', err);
        });
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.login(email, password);
      if (res.success) {
        setUser(res.user);
        setToken(res.token);
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        return { success: true };
      }
      return { success: false, message: res.message };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const switchRole = (newRole) => {
    const updated = { ...user, role: newRole };
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, token, role: user?.role || 'user', login, logout, switchRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

