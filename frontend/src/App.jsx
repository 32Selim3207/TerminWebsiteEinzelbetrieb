import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import ManagePage from './pages/ManagePage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import { useAuth } from './context/AuthContext';
import './assets/global.css';

/**
 * Admin sayfalarını korur — girişli değilse /admin/login'e yönlendirir.
 */
function ProtectedAdminRoute({ children }) {
  const { werkstatt, loading } = useAuth();
  if (loading) return null; // AuthContext localStorage'ı okurken kısa bir an
  if (!werkstatt) return <Navigate to="/admin/login" replace />;
  return children;
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <div className="footer-brand">Murat Garajı</div>
          <div>Mo – Fr 07:00 – 17:00 Uhr · Sa 07:00 – 12:00 Uhr</div>
        </div>
        <div className="footer-links">
          <span>© 2026 Murat Garajı</span>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div id="app-main">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/manage" element={<ManagePage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}