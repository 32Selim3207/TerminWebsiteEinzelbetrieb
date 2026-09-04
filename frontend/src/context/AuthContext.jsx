import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

/**
 * Sadece Werkstatt (admin) oturumu için kullanılıyor.
 * Kunde tarafı zaten misafir olarak randevu alıyor.
 */
export function AuthProvider({ children }) {
  const [werkstatt, setWerkstatt] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sayfa açılışında localStorage'daki oturumu yükle
  useEffect(() => {
    const token = localStorage.getItem('werkstatt_token');
    const data = localStorage.getItem('werkstatt_data');
    if (token && data) {
      try {
        setWerkstatt(JSON.parse(data));
      } catch {
        localStorage.removeItem('werkstatt_token');
        localStorage.removeItem('werkstatt_data');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/werkstatt/login', { email, password });
    localStorage.setItem('werkstatt_token', data.token);
    localStorage.setItem('werkstatt_data', JSON.stringify(data.werkstatt));
    setWerkstatt(data.werkstatt);
    return data.werkstatt;
  };

  const logout = () => {
    localStorage.removeItem('werkstatt_token');
    localStorage.removeItem('werkstatt_data');
    setWerkstatt(null);
  };

  return (
    <AuthContext.Provider value={{ werkstatt, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth AuthProvider içinde kullanılmalı.');
  return ctx;
}