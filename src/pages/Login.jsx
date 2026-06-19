// PAGE : Login
// RESPONSABLE : Junior
// TODO : Formulaire email + mot de passe, appel POST /api/auth/login
//        En cas de succès → stocker user via useAuth().login(userData) et rediriger

import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  // TODO Junior : implémenter le vrai appel API
  // Exemple de structure user à stocker :
  // { id_utilisateur: 1, Login: "jdoe", Nom: "Doe", Prenom: "John", Email: "..." }

  return (
    <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
      <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800 }}>
        Connexion
      </h1>
      <p style={{ color: '#6b7280', marginTop: '1rem' }}>
        [Page Login — à développer par Junior]
      </p>
      <p style={{ marginTop: '1rem' }}>
        <Link to="/register" style={{ color: '#F5A623' }}>Pas encore de compte ? S'inscrire</Link>
      </p>

      {/* Bouton temporaire pour tester sans auth */}
      <button
        onClick={() => {
          login({ id_utilisateur: 1, Login: 'test', Nom: 'Test', Prenom: 'User', Email: 'test@test.com' })
          navigate('/')
        }}
        style={{
          marginTop: '2rem', background: '#F5A623', color: '#fff',
          border: 'none', padding: '0.7rem 1.5rem', borderRadius: '8px',
          cursor: 'pointer', fontWeight: 600
        }}
      >
        [DEV] Connexion rapide (id=1)
      </button>
    </div>
  )
}