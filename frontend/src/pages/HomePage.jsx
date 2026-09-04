import { useNavigate } from 'react-router-dom';

const SERVICES = [
  {
    id: 'wartung',
    icon: 'icon-wrench',
    title: 'Allgemeine Wartung',
    desc: 'Inspektion, Ölwechsel und regelmäßige Wartungsarbeiten.',
  },
  {
    id: 'reifen',
    icon: 'icon-tire',
    title: 'Reifenwechsel',
    desc: 'Saisonwechsel oder Ersatz einzelner Reifen.',
  },
  {
    id: 'unbekannt',
    icon: 'icon-search',
    title: 'Unbekanntes Problem',
    desc: 'Etwas stimmt nicht, Sie wissen aber nicht was? Wir finden die Ursache.',
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  // Servis kartına tıklayınca doğrudan booking'e o servisle git
  const goToBooking = (serviceId) => {
    navigate('/book', { state: { preselectedService: serviceId } });
  };

  return (
    <section className="view active">
      {/* ---------- HERO ---------- */}
      <div className="hero">
        <div className="container hero-inner">
          <div>
            <p className="eyebrow">KFZ-WERKSTATT IN IHRER NÄHE</p>
            <h1>Termin buchen, Problem beschreiben, fertig.</h1>
            <p className="hero-sub">
              Murat Garajı kümmert sich um Wartung, Reifenwechsel und alles,
              was sonst noch anliegt – online gebucht in wenigen Minuten,
              ganz ohne Anruf.
            </p>
            <div className="hero-actions">
              <button className="btn btn-accent" onClick={() => navigate('/book')}>
                <svg className="icon"><use href="#icon-calendar" /></svg>
                Termin buchen
              </button>
              <button className="btn btn-ghost" onClick={() => navigate('/manage')}>
                Termin verwalten
              </button>
            </div>
          </div>

          <div className="hours-plaque">
            <h4>Öffnungszeiten</h4>
            <div className="hours-row"><span>Montag – Freitag</span><span>07:00 – 17:00</span></div>
            <div className="hours-row"><span>Samstag</span><span>07:00 – 12:00</span></div>
            <div className="hours-row"><span>Sonntag</span><span>Geschlossen</span></div>
          </div>
        </div>
      </div>

      {/* ---------- SERVICES ---------- */}
      <section className="services">
        <div className="container">
          <p className="eyebrow eyebrow-dark">LEISTUNGEN</p>
          <h2>Was dürfen wir für Sie tun?</h2>
          <p className="section-sub">
            Wählen Sie direkt eine Leistung – Sie gelangen damit direkt zur Terminbuchung.
          </p>
          <div className="service-grid">
            {SERVICES.map((s) => (
              <button
                key={s.id}
                className="service-card"
                onClick={() => goToBooking(s.id)}
              >
                <span className="service-icon">
                  <svg><use href={`#${s.icon}`} /></svg>
                </span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- KONTAKT ---------- */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-box">
            <div>
              <p className="eyebrow eyebrow-dark">KONTAKT</p>
              <h2>Anfahrt &amp; Kontakt</h2>
              <div className="contact-list">
                <div className="contact-item">
                  <svg><use href="#icon-pin" /></svg> Musterstraße 12, 80331 München
                </div>
                <div className="contact-item">
                  <svg><use href="#icon-phone" /></svg> 089 12345678
                </div>
                <div className="contact-item">
                  <svg><use href="#icon-mail" /></svg> info@murat-garaji.de
                </div>
              </div>
            </div>
            <div className="contact-hours-mini">
              <h4 style={{
                fontFamily: 'var(--font-mono)', fontSize: 12,
                letterSpacing: '1.2px', textTransform: 'uppercase',
                color: 'var(--muted)', marginBottom: 12,
              }}>
                Öffnungszeiten
              </h4>
              <div className="hours-row"><span>Mo – Fr</span><span>07:00 – 17:00</span></div>
              <div className="hours-row"><span>Sa</span><span>07:00 – 12:00</span></div>
              <div className="hours-row"><span>So</span><span>Geschlossen</span></div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}