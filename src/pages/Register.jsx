import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

// ============================================================
// PAGE REGISTER — VERSION MOCKÉE (sans backend)
//
// 🔧 FONCTIONNEMENT ACTUEL (mock) :
//   - Stockage local via localStorage (clé "assigame_users")
//   - Deux modes : inscription classique (USER) ou accès Admin direct
//
// 📌 POUR LE BACKEND (quand l'API sera prête) :
//   Remplacer les blocs "// --- MOCK ---" par les appels API :
//
//   Inscription USER  → POST /api/auth/register  { ...userData, role: 'USER' }
//   Accès Admin       → POST /api/auth/login      { Email, Motdepasse }
//                       (avec un compte admin pré-existant en BDD)
//
//   Réponse OK        : { token, user: { id, Login, role, ... } }
//   Stocker le token  : localStorage.setItem('assigame_token', token)
//   Redirection       : user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'
//
// ⚠️  ATTENTION BACKEND : champ "Login" limité à 10 caractères (varchar(10))
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
  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
  fontFamily: 'inherit',
}

const inputWithIcon = {
  ...inputBase,
  paddingLeft: '2.8rem',
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

// ─── Icônes SVG ─────────────────────────────────────────────
const IconMail = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)
const IconUser = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
)
const IconLock = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)
const IconPhone = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.21 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)
const IconShield = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

// ─── Champ de formulaire ─────────────────────────────────────
function Field({ label, hint, icon, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      <label style={{ fontSize: '0.82rem', fontWeight: '600', color: '#374151', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
        {label}
        {hint && <span style={{ color: '#9ca3af', fontWeight: '400' }}>{hint}</span>}
      </label>
      <div style={{ position: 'relative' }}>
        {icon && <span style={iconWrap}>{icon}</span>}
        {children}
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════
export default function Register() {
  const navigate = useNavigate()

  // Mode : 'user' | 'admin'
  const [mode, setMode] = useState('user')

  // Champs inscription
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [email, setEmail] = useState('')
  const [userPseudo, setUserPseudo] = useState('')
  const [motdepasse, setMotdepasse] = useState('')
  const [telephone, setTelephone] = useState('')

  // Champs connexion admin
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPassword, setAdminPassword] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  // ── Inscription utilisateur ──────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    if (userPseudo.length > 10) {
      toast.error("Le pseudo ne doit pas dépasser 10 caractères.")
      setIsLoading(false)
      return
    }

    try {
      // --- MOCK ---
      await new Promise(r => setTimeout(r, 400))

      const users = JSON.parse(localStorage.getItem('assigame_users') || '[]')

      if (users.find(u => u.Email === email)) {
        toast.error('Un compte existe déjà avec cet email.')
        setIsLoading(false)
        return
      }
      if (users.find(u => u.Login === userPseudo)) {
        toast.error("Ce pseudo est déjà pris.")
        setIsLoading(false)
        return
      }

      const newUser = {
        id_utilisateur: Date.now(),
        Nom: nom,
        Prenom: prenom,
        Email: email,
        Login: userPseudo,
        Motdepasse: motdepasse,       // ⚠️ BACKEND : BCrypt
        telephone: telephone || null,
        statut: 'ACTIF',
        role: 'USER',
      }

      users.push(newUser)
      localStorage.setItem('assigame_users', JSON.stringify(users))
      // --- FIN MOCK ---

      toast.success('Compte créé ! Connectez-vous.')
      navigate('/login')
    } catch (err) {
      toast.error("Erreur : " + err.message)
    } finally {
      setNom(''); setPrenom(''); setEmail('')
      setUserPseudo(''); setMotdepasse(''); setTelephone('')
      setIsLoading(false)
    }
  }

  // ── Connexion admin ──────────────────────────────────────
  const handleAdminLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // --- MOCK ---
      // 📌 BACKEND : POST /api/auth/login { Email: adminEmail, Motdepasse: adminPassword }
      // Remplacer par : const { data } = await axios.post('/api/auth/login', {...})
      //                 if (data.user.role !== 'ADMIN') throw new Error('Accès refusé')
      //                 localStorage.setItem('assigame_token', data.token)
      //                 navigate('/admin/dashboard')

      await new Promise(r => setTimeout(r, 400))

      const users = JSON.parse(localStorage.getItem('assigame_users') || '[]')
      const found = users.find(
        u => u.Email === adminEmail && u.Motdepasse === adminPassword
      )

      if (!found) {
        toast.error('Email ou mot de passe incorrect.')
        setIsLoading(false)
        return
      }

      if (found.role !== 'ADMIN') {
        toast.error("Ce compte n'a pas les droits administrateur.")
        setIsLoading(false)
        return
      }

      localStorage.setItem('assigame_current_user', JSON.stringify(found))
      // --- FIN MOCK ---

      toast.success(`Bienvenue, Admin ${found.Login} !`)
      navigate('/adminDashboard')
    } catch (err) {
      toast.error("Erreur : " + err.message)
    } finally {
      setAdminEmail('')
      setAdminPassword('')
      setIsLoading(false)
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
        maxWidth: '480px',
        padding: '2.5rem 2.2rem',
        boxShadow: '0 8px 40px rgba(245, 166, 35, 0.08)',
        boxSizing: 'border-box',
      }}>

        {/* ── En-tête ── */}
        <div style={{ marginBottom: '1.8rem' }}>
          <h1 style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: '1.9rem',
            fontWeight: '800',
            color: '#1a1a1a',
            margin: '0 0 0.3rem 0',
          }}>
            {mode === 'user'
              ? <>Créer un <span style={{ color: '#F5A623' }}>compte</span></>
              : <>Accès <span style={{ color: '#F5A623' }}>Administrateur</span></>
            }
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.88rem', margin: 0 }}>
            {mode === 'user'
              ? 'Rejoignez la communauté Assigame dès aujourd\'hui.'
              : 'Connectez-vous avec vos identifiants administrateur.'}
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
              onClick={() => setMode(key)}
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

        {/* ══════════════════════════════════════════════════ */}
        {/* FORMULAIRE UTILISATEUR                            */}
        {/* ══════════════════════════════════════════════════ */}
        {mode === 'user' && (
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

            {/* Prénom + Nom */}
            <div style={{ display: 'flex', gap: '0.9rem' }}>
              <Field label="Prénom">
                <input
                  type="text" placeholder="Jean"
                  value={prenom} onChange={e => setPrenom(e.target.value)}
                  required style={inputBase}
                />
              </Field>
              <Field label="Nom">
                <input
                  type="text" placeholder="Dupont"
                  value={nom} onChange={e => setNom(e.target.value)}
                  required style={inputBase}
                />
              </Field>
            </div>

            <Field label="Email" icon={<IconMail />}>
              <input
                type="email" placeholder="votre@email.com"
                value={email} onChange={e => setEmail(e.target.value)}
                required style={inputWithIcon}
              />
            </Field>

            <Field label="Pseudo" hint="(max 10 caractères)" icon={<IconUser />}>
              <input
                type="text" placeholder="pseudo"
                value={userPseudo} onChange={e => setUserPseudo(e.target.value)}
                maxLength={10} required style={inputWithIcon}
              />
            </Field>

            <Field label="Mot de passe" icon={<IconLock />}>
              <input
                type="password" placeholder="••••••••"
                value={motdepasse} onChange={e => setMotdepasse(e.target.value)}
                required style={inputWithIcon}
              />
            </Field>

            <Field label="Téléphone" hint="(Optionnel)" icon={<IconPhone />}>
              <input
                type="tel" placeholder="+228 90 00 00 00"
                value={telephone} onChange={e => setTelephone(e.target.value)}
                style={inputWithIcon}
              />
            </Field>

            <button type="submit" disabled={isLoading} style={btnStyle(isLoading)}>
              {isLoading ? 'Inscription...' : "S'inscrire"}
            </button>
          </form>
        )}

        {/* ══════════════════════════════════════════════════ */}
        {/* FORMULAIRE ADMIN                                  */}
        {/* ══════════════════════════════════════════════════ */}
        {mode === 'admin' && (
          <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

            {/* Bandeau info */}
            <div style={{
              background: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: '10px',
              padding: '0.75rem 1rem',
              display: 'flex',
              gap: '0.6rem',
              alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: '1rem', flexShrink: 0 }}>ℹ️</span>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#92400e', lineHeight: '1.4' }}>
                Espace réservé aux administrateurs Assigame.
                Utilisez vos identifiants admin pour accéder au tableau de bord.
              </p>
            </div>

            <Field label="Email admin" icon={<IconMail />}>
              <input
                type="email" placeholder="admin@assigame.com"
                value={adminEmail} onChange={e => setAdminEmail(e.target.value)}
                required style={inputWithIcon}
              />
            </Field>

            <Field label="Mot de passe" icon={<IconShield />}>
              <input
                type="password" placeholder="••••••••"
                value={adminPassword} onChange={e => setAdminPassword(e.target.value)}
                required style={inputWithIcon}
              />
            </Field>

            <button
              onClick={handleFakeAdminLogin}
              type="submit" disabled={isLoading} style={btnStyle(isLoading, true)}>
              {isLoading ? 'Connexion...' : 'Accéder au panneau admin'}
            </button>
          </form>
        )}

        {/* ── Lien bas de page ── */}
        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#4b5563', marginTop: '1.6rem', marginBottom: 0 }}>
          {mode === 'user'
            ? <>Déjà un compte ? <Link to="/login" style={linkStyle}>Connexion</Link></>
            : <>Pas un admin ? <button onClick={() => setMode('user')} style={{ background: 'none', border: 'none', color: '#F5A623', fontWeight: '600', cursor: 'pointer', fontSize: '0.85rem', padding: 0, fontFamily: 'inherit' }}>Créer un compte</button></>
          }
        </p>
      </div>

      {/* Footer */}
      <p style={{ fontSize: '0.73rem', color: '#9ca3af', fontStyle: 'italic', marginTop: '1.2rem', textAlign: 'center', maxWidth: '420px', lineHeight: '1.5' }}>
        En vous inscrivant, vous acceptez nos Conditions Générales d'Utilisation.
      </p>
    </div>
  )
}

// ─── Helpers styles ─────────────────────────────────────────
const btnStyle = (isLoading, isAdmin = false) => ({
  background: isAdmin
    ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
    : '#F5A623',
  color: '#ffffff',
  border: 'none',
  padding: '0.9rem 1.5rem',
  borderRadius: '10px',
  fontWeight: '700',
  fontSize: '0.97rem',
  cursor: isLoading ? 'not-allowed' : 'pointer',
  marginTop: '0.4rem',
  boxShadow: isAdmin
    ? '0 4px 14px rgba(26,26,46,0.25)'
    : '0 4px 14px rgba(245,166,35,0.25)',
  transition: 'opacity 0.2s ease',
  opacity: isLoading ? 0.7 : 1,
  fontFamily: 'inherit',
  letterSpacing: '0.01em',
})

const linkStyle = {
  color: '#F5A623',
  fontWeight: '600',
  textDecoration: 'none',
}