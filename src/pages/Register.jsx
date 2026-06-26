import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
const inputWithIcon = { ...inputBase, paddingLeft: '2.8rem' }

const IconMail = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
)
const IconUser = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)
const IconLock = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)
const IconPhone = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.21 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
)

function Field({ label, hint, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
        {label}
        {hint && <span style={{ color: '#9ca3af', fontWeight: 400 }}>{hint}</span>}
      </label>
      <div style={{ position: 'relative' }}>{children}</div>
    </div>
  )
}

export default function Register() {
  const navigate = useNavigate()

  const [nom, setNom]               = useState('')
  const [prenom, setPrenom]         = useState('')
  const [email, setEmail]           = useState('')
  const [login, setLogin]           = useState('')
  const [motdepasse, setMotdepasse] = useState('')
  const [telephone, setTelephone]   = useState('')
  const [erreur, setErreur]         = useState(null)
  const [succes, setSucces]         = useState(false)
  const [loading, setLoading]       = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()
    setErreur(null)

    if (login.length > 10) {
      setErreur('Le login ne doit pas dépasser 10 caractères.')
      return
    }

    setLoading(true)
    try {
      // POST /api/auth/register — champs en majuscule comme l'entité Java
      const payload = {
        Nom:        nom.trim(),
        Prenom:     prenom.trim(),
        Email:      email.trim(),
        Login:      login.trim(),
        Motdepasse: motdepasse,
        telephone:  telephone.trim() || null,
        statut:     'actif',
      }

      await api.post('/auth/register', payload)

      setSucces(true)
      setTimeout(() => navigate('/login'), 1800)
    } catch (err) {
      const msg = err.response?.data?.erreur || "Erreur lors de l'inscription. L'email ou le login existe peut-être déjà."
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
        borderRadius: '20px', width: '100%', maxWidth: '480px',
        padding: '2.5rem 2.2rem',
        boxShadow: '0 8px 40px rgba(245,166,35,0.08)',
        boxSizing: 'border-box',
      }}>
        <div style={{ marginBottom: '1.8rem' }}>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.9rem', fontWeight: 800, color: '#1a1a1a', margin: '0 0 0.3rem' }}>
            Créer un <span style={{ color: '#F5A623' }}>compte</span>
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.88rem', margin: 0 }}>
            Rejoignez la communauté Assigame dès aujourd'hui.
          </p>
        </div>

        {erreur && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1.2rem', color: '#dc2626', fontSize: '0.83rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span>⚠️</span> {erreur}
          </div>
        )}

        {succes && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1.2rem', color: '#166534', fontSize: '0.83rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span>✓</span> Compte créé ! Redirection vers la connexion...
          </div>
        )}

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div style={{ display: 'flex', gap: '0.9rem' }}>
            <Field label="Prénom">
              <input type="text" placeholder="Jean" value={prenom}
                onChange={e => setPrenom(e.target.value)} required style={inputBase} />
            </Field>
            <Field label="Nom">
              <input type="text" placeholder="Dupont" value={nom}
                onChange={e => setNom(e.target.value)} required style={inputBase} />
            </Field>
          </div>

          <Field label="Email">
            <span style={iconWrap}><IconMail /></span>
            <input type="email" placeholder="votre@email.com" value={email}
              onChange={e => setEmail(e.target.value)} required style={inputWithIcon} />
          </Field>

          <Field label="Login" hint="(max 10 caractères)">
            <span style={iconWrap}><IconUser /></span>
            <input type="text" placeholder="pseudo" value={login}
              onChange={e => setLogin(e.target.value)}
              maxLength={10} required style={inputWithIcon} />
          </Field>

          <Field label="Mot de passe">
            <span style={iconWrap}><IconLock /></span>
            <input type="password" placeholder="••••••••" value={motdepasse}
              onChange={e => setMotdepasse(e.target.value)} required style={inputWithIcon} />
          </Field>

          <Field label="Téléphone" hint="(optionnel)">
            <span style={iconWrap}><IconPhone /></span>
            <input type="tel" placeholder="+228 90 00 00 00" value={telephone}
              onChange={e => setTelephone(e.target.value)} style={inputWithIcon} />
          </Field>

          <button type="submit" disabled={loading || succes} style={{
            background: '#F5A623', color: '#fff', border: 'none',
            padding: '0.9rem 1.5rem', borderRadius: '10px',
            fontWeight: 700, fontSize: '0.97rem',
            cursor: (loading || succes) ? 'not-allowed' : 'pointer',
            marginTop: '0.4rem', opacity: (loading || succes) ? 0.7 : 1,
            boxShadow: '0 4px 14px rgba(245,166,35,0.25)',
            fontFamily: 'inherit',
          }}>
            {loading ? 'Inscription...' : "S'inscrire"}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#4b5563', marginTop: '1.6rem', marginBottom: 0 }}>
          Déjà un compte ?{' '}
          <Link to="/login" style={{ color: '#F5A623', fontWeight: 700, textDecoration: 'none' }}>Connexion</Link>
        </p>
      </div>

      <p style={{ fontSize: '0.73rem', color: '#9ca3af', fontStyle: 'italic', marginTop: '1.2rem', textAlign: 'center', maxWidth: '420px', lineHeight: 1.5 }}>
        En vous inscrivant, vous acceptez nos Conditions Générales d'Utilisation.
      </p>
    </div>
  )
}