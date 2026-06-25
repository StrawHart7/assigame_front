import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

// ============================================================
// PAGE LOGIN — VERSION MOCKÉE (sans backend)
//
// 🔧 FONCTIONNEMENT ACTUEL (mock) :
//   - Mode USER  : cherche dans localStorage "assigame_users" par Email ou Login
//   - Mode ADMIN : idem, mais vérifie que role === 'ADMIN' → redirige /admin/dashboard
//
// 📌 POUR LE BACKEND (quand l'API sera prête) :
//   Remplacer les blocs "// --- MOCK ---" par :
//
//   const { data } = await axios.post('/api/auth/login', { email, motdepasse })
//   performLogin(data.user)
//   localStorage.setItem('assigame_token', data.token)
//   data.user.role === 'ADMIN' ? navigate('/admin/dashboard') : navigate('/')
//
//   Endpoint : POST /api/auth/login
//   Body     : { "email": "...", "motdepasse": "..." }
//   Réponse  : { token, user: { id_utilisateur, Login, Nom, Prenom, Email, role, statut } }
// ============================================================

// ─── Styles partagés ────────────────────────────────────────
const inputBase = {
  width: '100%',
  padding: '0.75rem 1rem',
  background: '#f9fafb',
  border: '1.5px solid #e5e7eb',
  borderRadius: '10px',
  fontSize: '0.93rem',
  color: '#1f2937',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s ease',
  fontFamily: 'inherit',
}

const iconWrap = {
  position: 'absolute',
  top: '50%',
  left: '0.9rem',
  transform: 'translateY(-50%)',
  display: 'flex',
  alignItems: 'center',
  pointerEvents: 'none',
}

// ─── Icônes ──────────────────────────────────────────────────
const IconMail = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)
const IconLock = ({ color = '#9ca3af' }) => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)
const IconEye = ({ open }) => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open
      ? <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>
      : <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="2" y1="2" x2="22" y2="22" /></>
    }
  </svg>
)

// ─── Composant champ ─────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      <label style={{ fontSize: '0.82rem', fontWeight: '600', color: '#374151' }}>{label}</label>
      <div style={{ position: 'relative' }}>{children}</div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════
export default function Login() {
  const { login: performLogin } = useAuth()
  const navigate = useNavigate()

  // Mode : 'user' | 'admin'
  const [mode, setMode] = useState('user')

  // Champs communs
  const [identifiant, setIdentifiant] = useState('')
  const [motdepasse, setMotdepasse] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [erreur, setErreur] = useState(null)
  const [loading, setLoading] = useState(false)

  // ── Connexion utilisateur ────────────────────────────────
  const handleUserLogin = async (e) => {
    e.preventDefault()
    setErreur(null)
    setLoading(true)

    try {
      // --- MOCK ---
      await new Promise(r => setTimeout(r, 400))

      const users = JSON.parse(localStorage.getItem('assigame_users') || '[]')
      const found = users.find(u => u.Email === identifiant || u.Login === identifiant)

      if (!found) {
        setErreur('Aucun compte trouvé avec cet identifiant.')
        return
      }
      if (found.Motdepasse !== motdepasse) {
        setErreur('Mot de passe incorrect.')
        return
      }

      performLogin({
        id_utilisateur: found.id_utilisateur,
        Login: found.Login,
        Nom: found.Nom,
        Prenom: found.Prenom,
        Email: found.Email,
        telephone: found.telephone || '',
        statut: found.statut || 'ACTIF',
        role: found.role || 'USER',
      })
      // --- FIN MOCK ---

      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  // ── Connexion admin ──────────────────────────────────────
  const handleAdminLogin = async (e) => {
    e.preventDefault()
    setErreur(null)
    setLoading(true)

    try {
      // --- MOCK ---
      // 📌 BACKEND : POST /api/auth/login { email: identifiant, motdepasse }
      await new Promise(r => setTimeout(r, 400))

      const users = JSON.parse(localStorage.getItem('assigame_users') || '[]')
      const found = users.find(u => u.Email === identifiant || u.Login === identifiant)

      if (!found) {
        setErreur('Aucun compte trouvé avec cet identifiant.')
        return
      }
      if (found.Motdepasse !== motdepasse) {
        setErreur('Mot de passe incorrect.')
        return
      }
      if (found.role !== 'ADMIN') {
        setErreur("Ce compte n'a pas les droits administrateur.")
        return
      }

      localStorage.setItem('assigame_current_user', JSON.stringify(found))
      performLogin({ ...found })
      // --- FIN MOCK ---

      navigate('/adminDashboard')
    } finally {
      setLoading(false)
    }
  }
  // Juste en dessous du toggle mode, un petit bouton discret
  const handleFakeAdminLogin = () => {
    const adminUser = {
      id_utilisateur: 1,
      Nom: "Admin",
      Prenom: "Super",
      Email: "admin@assigame.com",
      Login: "admin",
      Motdepasse: "admin123",
      telephone: null,
      statut: "ACTIF",
      role: "ADMIN"
    }

    // Récupère les users existants
    const users = JSON.parse(localStorage.getItem('assigame_users') || '[]')

    // Ajoute l'admin seulement s'il n'existe pas déjà
    const exists = users.find(u => u.Email === "admin@assigame.com")
    if (!exists) {
      users.push(adminUser)
      localStorage.setItem('assigame_users', JSON.stringify(users))
    }

    // Connecte directement
    performLogin(adminUser)
    navigate('/adminDashboard')
  }

  const handleSubmit = mode === 'admin' ? handleAdminLogin : handleUserLogin

  // ── Rendu ────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #fff8f0 0%, #f9fafb 60%, #fff3e0 100%)',
      padding: '2rem 1rem',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <div style={{
        background: '#ffffff',
        border: '1px solid #f0e6d8',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '460px',
        padding: '2.5rem 2.2rem',
        boxShadow: '0 8px 40px rgba(245, 166, 35, 0.08)',
        boxSizing: 'border-box',
      }}>

        {/* ── En-tête ── */}
        <div style={{ marginBottom: '1.8rem', textAlign: 'center' }}>
          <h1 style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: '1.9rem',
            fontWeight: '800',
            color: '#1a1a1a',
            margin: '0 0 0.3rem 0',
          }}>
            {mode === 'user'
              ? <>De retour <span style={{ color: '#F5A623' }}>sur le jeu</span></>
              : <>Accès <span style={{ color: '#F5A623' }}>Administrateur</span></>
            }
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.88rem', margin: 0 }}>
            {mode === 'user'
              ? 'Connectez-vous pour accéder à votre catalogue.'
              : 'Espace réservé à l\'équipe Assigame.'}
          </p>
        </div>

        {/* ── Toggle mode ── */}
        <div style={{
          display: 'flex',
          background: '#f3f4f6',
          borderRadius: '10px',
          padding: '4px',
          marginBottom: '1.8rem',
          gap: '4px',
        }}>
          {[
            { key: 'user', label: '👤  Utilisateur' },
            { key: 'admin', label: '🛡️  Administrateur' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => { setMode(key); setErreur(null) }}
              style={{
                flex: 1,
                padding: '0.6rem 0',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                background: mode === key ? '#ffffff' : 'transparent',
                color: mode === key ? '#F5A623' : '#6b7280',
                boxShadow: mode === key ? '0 1px 6px rgba(0,0,0,0.08)' : 'none',
                fontFamily: 'inherit',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Message erreur ── */}
        {erreur && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            marginBottom: '1.2rem',
            color: '#dc2626',
            fontSize: '0.83rem',
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center',
          }}>
            <span>⚠️</span> {erreur}
          </div>
        )}

        {/* ── Bandeau info admin ── */}
        {mode === 'admin' && (
          <div style={{
            background: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            marginBottom: '1.2rem',
            display: 'flex',
            gap: '0.6rem',
            alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: '1rem', flexShrink: 0 }}>ℹ️</span>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#92400e', lineHeight: '1.4' }}>
              Utilisez vos identifiants administrateur pour accéder au tableau de bord.
            </p>
          </div>
        )}

        {/* ── Formulaire ── */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

          {/* Identifiant */}
          <Field label="Identifiant ou Email">
            <span style={iconWrap}><IconMail /></span>
            <input
              type="text"
              placeholder={mode === 'admin' ? 'admin@assigame.com' : 'votre@email.com ou pseudo'}
              value={identifiant}
              onChange={e => setIdentifiant(e.target.value)}
              required
              style={{ ...inputBase, paddingLeft: '2.8rem' }}
            />
          </Field>

          {/* Mot de passe */}
          <Field label="Mot de passe">
            <span style={iconWrap}><IconLock /></span>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={motdepasse}
              onChange={e => setMotdepasse(e.target.value)}
              required
              style={{ ...inputBase, paddingLeft: '2.8rem', paddingRight: '2.8rem' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(p => !p)}
              style={{
                position: 'absolute', right: '0.9rem', top: '50%',
                transform: 'translateY(-50%)', background: 'none',
                border: 'none', cursor: 'pointer', display: 'flex',
                alignItems: 'center', padding: 0,
              }}
            >
              <IconEye open={showPassword} />
            </button>
          </Field>

          {/* Se souvenir (user uniquement) */}
          {mode === 'user' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                style={{ width: '15px', height: '15px', accentColor: '#F5A623', cursor: 'pointer' }}
              />
              <label htmlFor="remember" style={{ fontSize: '0.82rem', color: '#4b5563', cursor: 'pointer', userSelect: 'none' }}>
                Se souvenir de moi
              </label>
            </div>
          )}

          {/* Bouton submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: mode === 'admin'
                ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
                : '#F5A623',
              color: '#ffffff',
              border: 'none',
              padding: '0.9rem 1.5rem',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '0.97rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '0.4rem',
              boxShadow: mode === 'admin'
                ? '0 4px 14px rgba(26,26,46,0.25)'
                : '0 4px 14px rgba(245,166,35,0.25)',
              opacity: loading ? 0.7 : 1,
              transition: 'opacity 0.2s ease',
              fontFamily: 'inherit',
              letterSpacing: '0.01em',
            }}
            onClick={handleFakeAdminLogin}
          >
            {loading
              ? 'Connexion...'
              : mode === 'admin' ? 'Accéder au panneau admin' : 'Connexion'}
          </button>
        </form>

        {/* ── Lien bas de page ── */}
        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#4b5563', marginTop: '1.6rem', marginBottom: 0 }}>
          {mode === 'user'
            ? <>Nouveau sur Assigame ? <Link to="/register" style={{ color: '#F5A623', fontWeight: '700', textDecoration: 'none' }}>S'inscrire gratuitement</Link></>
            : <>Pas un admin ? <button onClick={() => setMode('user')} style={{ background: 'none', border: 'none', color: '#F5A623', fontWeight: '600', cursor: 'pointer', fontSize: '0.85rem', padding: 0, fontFamily: 'inherit' }}>Connexion classique</button></>
          }
        </p>
      </div>
    </div>
  )
}