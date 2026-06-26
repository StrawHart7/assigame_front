import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'

const iconWrap = {
  position: 'absolute', top: '50%', left: '0.9rem',
  transform: 'translateY(-50%)', display: 'flex',
  alignItems: 'center', pointerEvents: 'none',
}

const inputBase = {
  width: '100%', padding: '0.75rem 1rem',
  background: '#f9fafb', border: '1.5px solid #e5e7eb',
  borderRadius: '10px', fontSize: '0.93rem', color: '#1f2937',
  outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
}

const IconMail = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
)
const IconLock = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)
const IconEye = ({ open }) => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open
      ? <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></>
      : <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="2" y1="2" x2="22" y2="22"/></>
    }
  </svg>
)

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151' }}>{label}</label>
      <div style={{ position: 'relative' }}>{children}</div>
    </div>
  )
}

export default function Login() {
  const { login: performLogin } = useAuth()
  const navigate = useNavigate()

  const [identifiant, setIdentifiant]   = useState('')
  const [motdepasse, setMotdepasse]     = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [erreur, setErreur]             = useState(null)
  const [loading, setLoading]           = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErreur(null)
    setLoading(true)
    try {
      // Essaie d'abord par email (AuthService de Junior)
      // Si l'identifiant ressemble à un email → /api/auth/login
      // Sinon → /api/utilisateur/login (login par Login ou Email)
      let u
      if (identifiant.includes('@')) {
        const res = await api.post('/auth/login', { email: identifiant, motdepasse })
        u = res.data
      } else {
        const res = await api.post('/utilisateur/login', { identifiant, motdepasse })
        u = res.data
      }

      // Les champs retournés par l'API ont les majuscules de l'entité
      performLogin({
        id_utilisateur: u.id_utilisateur,
        login:          u.Login,
        nom:            u.Nom,
        prenom:         u.Prenom,
        email:          u.Email,
        telephone:      u.telephone || '',
        statut:         u.statut,
      })

      navigate('/')
    } catch (err) {
      const msg = err.response?.data?.erreur || 'Identifiant ou mot de passe incorrect.'
      setErreur(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center',
      background: 'linear-gradient(135deg, #fff8f0 0%, #f9fafb 60%, #fff3e0 100%)',
      padding: '2rem 1rem',
      fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
    }}>
      <div style={{
        background: '#fff', border: '1px solid #f0e6d8',
        borderRadius: '20px', width: '100%', maxWidth: '440px',
        padding: '2.5rem 2.2rem',
        boxShadow: '0 8px 40px rgba(245,166,35,0.08)',
        boxSizing: 'border-box',
      }}>
        <div style={{ marginBottom: '1.8rem', textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.9rem', fontWeight: 800, color: '#1a1a1a', margin: '0 0 0.3rem' }}>
            De retour <span style={{ color: '#F5A623' }}>sur le jeu</span>
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.88rem', margin: 0 }}>
            Connectez-vous pour accéder à votre catalogue.
          </p>
        </div>

        {erreur && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1.2rem', color: '#dc2626', fontSize: '0.83rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span>⚠️</span> {erreur}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <Field label="Login ou Email">
            <span style={iconWrap}><IconMail /></span>
            <input
              type="text" placeholder="votre login ou email"
              value={identifiant} onChange={e => setIdentifiant(e.target.value)}
              required style={{ ...inputBase, paddingLeft: '2.8rem' }}
            />
          </Field>

          <Field label="Mot de passe">
            <span style={iconWrap}><IconLock /></span>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={motdepasse} onChange={e => setMotdepasse(e.target.value)}
              required style={{ ...inputBase, paddingLeft: '2.8rem', paddingRight: '2.8rem' }}
            />
            <button type="button" onClick={() => setShowPassword(p => !p)}
              style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}>
              <IconEye open={showPassword} />
            </button>
          </Field>

          <button type="submit" disabled={loading} style={{
            background: '#F5A623', color: '#fff', border: 'none',
            padding: '0.9rem 1.5rem', borderRadius: '10px',
            fontWeight: 700, fontSize: '0.97rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginTop: '0.4rem', opacity: loading ? 0.7 : 1,
            boxShadow: '0 4px 14px rgba(245,166,35,0.25)',
            fontFamily: 'inherit',
          }}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        {/* Accès admin direct — pratique pendant le dev */}
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <button onClick={() => navigate('/admin')}
            style={{ background: 'none', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '0.5rem 1rem', color: '#6b7280', fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'inherit' }}>
            🛡 Accès Admin direct
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#4b5563', marginTop: '1.4rem', marginBottom: 0 }}>
          Nouveau sur Assigame ?{' '}
          <Link to="/register" style={{ color: '#F5A623', fontWeight: 700, textDecoration: 'none' }}>
            S'inscrire gratuitement
          </Link>
        </p>
      </div>
    </div>
  )
}