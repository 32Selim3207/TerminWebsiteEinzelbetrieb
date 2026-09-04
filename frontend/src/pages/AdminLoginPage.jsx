import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { werkstatt, login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Zaten girişliyse doğrudan dashboard'a
  useEffect(() => {
    if (werkstatt) navigate('/admin', { replace: true });
  }, [werkstatt, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Bitte E-Mail und Passwort eingeben.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await login(email.trim(), password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Anmeldung fehlgeschlagen.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="view active">
      <div className="container narrow" style={{ paddingTop: 60, paddingBottom: 80, maxWidth: 420 }}>
        <p className="eyebrow eyebrow-dark">NUR FÜR MITARBEITER</p>
        <h2>Mitarbeiterzugang</h2>
        <p className="section-sub">
          Bitte melden Sie sich mit Ihrer Werkstatt-E-Mail an, um die Verwaltung zu öffnen.
        </p>

        <form onSubmit={handleSubmit} className="stack-form" noValidate>
          <div className="field">
            <label htmlFor="admin-email">E-Mail</label>
            <input
              type="email"
              id="admin-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="field">
            <label htmlFor="admin-password">Passwort</label>
            <input
              type="password"
              id="admin-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && <div className="field-error">{error}</div>}

          <button
            type="submit"
            className="btn btn-dark btn-block"
            disabled={submitting}
          >
            {submitting ? 'Wird angemeldet...' : 'Anmelden'}
          </button>
        </form>
      </div>
    </section>
  );
}