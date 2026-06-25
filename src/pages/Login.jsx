import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

// ============================================================
// PAGE LOGIN — VERSION MOCKÉE (sans backend)
//
// 🔧 FONCTIONNEMENT ACTUEL (mock) :
//   1. On lit la liste des comptes depuis localStorage (clé "assigame_users")
//   2. On cherche un compte dont l'Email correspond à l'identifiant saisi
//   3. On vérifie le mot de passe
//   4. On stocke le user connecté via AuthContext → localStorage ("assigame_user")
//
// 📌 POUR LE BACKEND (quand l'API sera prête) :
//   Remplacer le bloc "// --- MOCK ---" ci-dessous par :
//
//   const response = await axios.post('/api/auth/login', {
//     email: identifiant,
//     motdepasse: motdepasse
//   })
//   // Le backend retourne l'objet Utilisateur complet :
//   // { id_utilisateur, Nom, Prenom, Email, Login, telephone, statut }
//   performLogin(response.data)
//   navigate('/')
//
//   Endpoint backend : POST /api/auth/login
//   Body attendu     : { "email": "...", "motdepasse": "..." }
//   Réponse OK       : objet Utilisateur (200)
//   Réponse erreur   : { "erreur": "message" } (401)
// ============================================================

export default function Login() {
  const { login: performLogin } = useAuth()
  const navigate = useNavigate()

  const [identifiant, setIdentifiant] = useState('')
  const [motdepasse, setMotdepasse] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [erreur, setErreur] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErreur(null)
    setLoading(true)

    // --- MOCK : authentification locale via localStorage ---
    // Simule ce que ferait le backend Spring Boot
    await new Promise(r => setTimeout(r, 400)) // petit délai réaliste

    const users = JSON.parse(localStorage.getItem('assigame_users') || '[]')

    // On cherche par Email OU par Login (pseudo)
    const found = users.find(
      u => u.Email === identifiant || u.Login === identifiant
    )

    if (!found) {
      setErreur('Aucun compte trouvé avec cet identifiant.')
      setLoading(false)
      return
    }

    if (found.Motdepasse !== motdepasse) {
      setErreur('Mot de passe incorrect.')
      setLoading(false)
      return
    }

    // Connexion réussie → on stocke via AuthContext (→ localStorage "assigame_user")
    performLogin({
      id_utilisateur: found.id_utilisateur,
      Login: found.Login,
      Nom: found.Nom,
      Prenom: found.Prenom,
      Email: found.Email,
      telephone: found.telephone || '',
      statut: found.statut || 'ACTIF'
    })
    // --- FIN MOCK ---

    setLoading(false)
    navigate('/')
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
        maxWidth: '460px',
        padding: '3rem 2.5rem',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.02)',
        boxSizing: 'border-box'
      }}>
        {/* Title */}
        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: '1.75rem',
          fontWeight: '800',
          color: '#1a1a1a',
          margin: '0 0 0.5rem 0',
          textAlign: 'center'
        }}>
          De retour <span style={{ color: '#F5A623' }}>sur le jeu</span>
        </h1>
        <p style={{
          color: '#6b7280',
          fontSize: '0.85rem',
          margin: '0 0 2rem 0',
          textAlign: 'center',
          lineHeight: '1.4'
        }}>
          Connectez-vous pour accéder à votre catalogue.
        </p>

        {/* Erreur */}
        {erreur && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
            color: '#dc2626',
            fontSize: '0.85rem'
          }}>
            {erreur}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Identifiant ou Email */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#4b5563' }}>
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Identifiant ou Email
            </label>
            <input
              type="text"
              placeholder="votre@email.com"
              value={identifiant}
              onChange={(e) => setIdentifiant(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          {/* Mot de passe */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#4b5563' }}>
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Mot de passe
              </label>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={motdepasse}
                onChange={(e) => setMotdepasse(e.target.value)}
                required
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 0
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#9ca3af' }}>
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
          </div>

          {/* Se souvenir de moi */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{
                width: '16px',
                height: '16px',
                accentColor: '#F5A623',
                cursor: 'pointer'
              }}
            />
            <label htmlFor="remember" style={{ fontSize: '0.82rem', color: '#4b5563', cursor: 'pointer', userSelect: 'none' }}>
              Se souvenir de moi
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: '#F5A623',
              color: '#ffffff',
              border: 'none',
              padding: '0.9rem 1.5rem',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '0.5rem',
              boxShadow: '0 4px 12px rgba(245, 166, 35, 0.2)',
              transition: 'background 0.2s ease-in-out',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Connexion...' : 'Connexion'}
          </button>
        </form>

        {/* Register Link */}
        <p style={{
          textAlign: 'center',
          fontSize: '0.82rem',
          color: '#4b5563',
          marginTop: '2rem',
          marginBottom: '0',
          lineHeight: '1.5'
        }}>
          Nouveau sur Assigame ?{' '}
          <Link to="/register" style={{ color: '#F5A623', fontWeight: '700', textDecoration: 'none' }}>
            S'inscrire gratuitement
          </Link>
        </p>
      </div>
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
  fontSize: '0.9rem',
  color: '#1f2937',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s ease'
}
