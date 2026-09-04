import { NavLink, Link } from 'react-router-dom';

export default function Header() {
  // NavLink otomatik olarak active className ekler
  const navClass = ({ isActive }) =>
    isActive ? 'nav-link is-active' : 'nav-link';

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand" style={{ textDecoration: 'none' }}>
          <span className="brand-badge">
            <svg><use href="#icon-wrench" /></svg>
          </span>
          <span className="brand-name">Murat Garajı</span>
        </Link>

        <nav className="main-nav">
          <NavLink to="/" end className={navClass}>Start</NavLink>
          <NavLink to="/book" className={navClass}>Termin buchen</NavLink>
          <NavLink to="/manage" className={navClass}>Termin verwalten</NavLink>
        </nav>

        <Link to="/admin/login" className="staff-link" style={{ textDecoration: 'none' }}>
          Mitarbeiterzugang
        </Link>
      </div>
    </header>
  );
}