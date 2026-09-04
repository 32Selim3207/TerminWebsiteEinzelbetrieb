import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
});

/**
 * Request interceptor: her istekte localStorage'daki token'ı otomatik ekler.
 * Werkstatt (admin) login sonrası token orada saklanıyor.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('werkstatt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Response interceptor: 401 gelirse token geçersiz demektir,
 * localStorage'ı temizle ve login sayfasına yönlendir.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('werkstatt_token');
      localStorage.removeItem('werkstatt_data');
      // Sadece admin sayfalarındayken yönlendir - public sayfada 401 pek olmaz zaten
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Sık kullanılacak sabitler
export const WERKSTATT_ID = import.meta.env.VITE_WERKSTATT_ID;