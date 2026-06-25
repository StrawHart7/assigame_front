import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
 
export default function Navbar() {
  const { user, logout, cartCount } = useAuth()
  const navigate = useNavigate()
 
  const handleLogout = () => {
    logout()
    navigate('/login')
  }
 
  return (
    <nav style={{
      background: '#fff',
      borderBottom: '1px solid #e5e7eb',
      padding: '0 2rem',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
    }}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none' }}>
        <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.4rem', fontWeight: 800, color: '#1a1a1a' }}>
          ASSI<span style={{ color: '#F5A623' }}>GAME</span>
        </span>
      </Link>
 
      {/* Nav links */}
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Link to="/" style={linkStyle}>Accueil</Link>
        <Link to="/catalogue" style={linkStyle}>Catalogue</Link>
      </div>
 
      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
        {/* Cart icon */}
        <Link to="/panier" style={{ position: 'relative', textDecoration: 'none', color: '#1a1a1a' }}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          {cartCount > 0 && (
            <span style={{
              position: 'absolute', top: '-8px', right: '-8px',
              background: '#F5A623', color: '#fff', borderRadius: '50%',
              width: '18px', height: '18px', fontSize: '11px', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {cartCount}
            </span>
          )}
        </Link>
 
        {user ? (
          <>
            <Link to="/commandes" style={linkStyle}>Mes commandes</Link>
            <button onClick={handleLogout} style={btnOutlineStyle}>Déconnexion</button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>Connexion</Link>
            <Link to="/register" style={btnStyle}>S'inscrire</Link>
          </>
        )}
      </div>
    </nav>
  )
}
 
const linkStyle = {
  textDecoration: 'none',
  color: '#4b5563',
  fontSize: '0.95rem',
  fontWeight: 500,
  transition: 'color 0.2s',
}
 
const btnStyle = {
  textDecoration: 'none',
  background: '#F5A623',
  color: '#fff',
  padding: '0.45rem 1.1rem',
  borderRadius: '8px',
  fontSize: '0.9rem',
  fontWeight: 600,
}
 
const btnOutlineStyle = {
  background: 'transparent',
  border: '1px solid #e5e7eb',
  color: '#4b5563',
  padding: '0.45rem 1.1rem',
  borderRadius: '8px',
  fontSize: '0.9rem',
  fontWeight: 500,
  cursor: 'pointer',
}
 