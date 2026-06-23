import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Register() {
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [email, setEmail] = useState('')
  const [login, setLogin] = useState('')
  const [motdepasse, setMotdepasse] = useState('')
  const [telephone, setTelephone] = useState('')

  const handleRegister = (e) => {
    e.preventDefault()
    // Action d'inscription à lier avec l'API plus tard
  }

  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f9fafb',
      padding: '2rem 1rem',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Form Card Container */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #ebdcd0',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '500px',
        padding: '2.5rem 2rem',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.03)',
        boxSizing: 'border-box'
      }}>
        {/* Title */}
        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: '1.85rem',
          fontWeight: '800',
          color: '#1a1a1a',
          margin: '0 0 0.5rem 0',
          textAlign: 'left'
        }}>
          Créer un <span style={{ color: '#F5A623' }}>compte</span>
        </h1>
        <p style={{
          color: '#6b7280',
          fontSize: '0.9rem',
          margin: '0 0 2rem 0',
          textAlign: 'left'
        }}>
          Rejoignez la communauté Assigame dès aujourd'hui.
        </p>

        {/* Form */}
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Row: Prénom & Nom */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>Prénom</label>
              <input
                type="text"
                placeholder="Ex: Jean"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>Nom</label>
              <input
                type="text"
                placeholder="Ex: Dupont"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Email */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>Email</label>
            <div style={{ position: 'relative' }}>
              <span style={iconWrapperStyle}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#9ca3af' }}>
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </span>
              <input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputWithIconStyle}
              />
            </div>
          </div>

          {/* Login */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>Login</label>
            <div style={{ position: 'relative' }}>
              <span style={iconWrapperStyle}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#9ca3af' }}>
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Nom d'utilisateur"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                style={inputWithIconStyle}
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>Mot de passe</label>
            <div style={{ position: 'relative' }}>
              <span style={iconWrapperStyle}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#9ca3af' }}>
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={motdepasse}
                onChange={(e) => setMotdepasse(e.target.value)}
                style={inputWithIconStyle}
              />
            </div>
          </div>

          {/* Téléphone */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>
              Téléphone <span style={{ color: '#6b7280', fontWeight: '400' }}>(Optionnel)</span>
            </label>
            <div style={{ position: 'relative' }}>
              <span style={iconWrapperStyle}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#9ca3af' }}>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </span>
              <input
                type="tel"
                placeholder="+33 6 00 00 00 00"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                style={inputWithIconStyle}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              background: '#F5A623',
              color: '#ffffff',
              border: 'none',
              padding: '0.9rem 1.5rem',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '1rem',
              cursor: 'pointer',
              marginTop: '0.5rem',
              boxShadow: '0 4px 12px rgba(245, 166, 35, 0.2)',
              transition: 'background 0.2s ease-in-out'
            }}
          >
            S'inscrire
          </button>
        </form>

        {/* Login Link */}
        <p style={{
          textAlign: 'center',
          fontSize: '0.88rem',
          color: '#4b5563',
          marginTop: '1.5rem',
          marginBottom: '0'
        }}>
          Vous avez déjà un compte ?{' '}
          <Link to="/login" style={{ color: '#F5A623', fontWeight: '600', textDecoration: 'none' }}>
            Connexion
          </Link>
        </p>
      </div>

      {/* Footer Text */}
      <p style={{
        fontSize: '0.75rem',
        color: '#9ca3af',
        fontStyle: 'italic',
        marginTop: '1.5rem',
        textAlign: 'center',
        maxWidth: '450px',
        lineHeight: '1.4'
      }}>
        En vous inscrivant, vous acceptez nos Conditions Générales d'Utilisation.
      </p>
    </div>
  )
}

// Reusable Styles
const inputStyle = {
  width: '100%',
  padding: '0.75rem 1rem',
  background: '#f3f4f6',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  fontSize: '0.95rem',
  color: '#1f2937',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s ease'
}

const inputWithIconStyle = {
  ...inputStyle,
  paddingLeft: '2.75rem'
}

const iconWrapperStyle = {
  position: 'absolute',
  top: '50%',
  left: '1rem',
  transform: 'translateY(-50%)',
  display: 'flex',
  alignItems: 'center',
  pointerEvents: 'none'
}