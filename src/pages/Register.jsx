// PAGE : Register
// RESPONSABLE : Junior
// TODO : Formulaire inscription, appel POST /api/auth/register
// CHAMPS : Nom, Prenom, Email, Login, Motdepasse, telephone (optionnel)

import { Link } from 'react-router-dom'

export default function Register() {
  return (
    <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
      <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800 }}>
        Inscription
      </h1>
      <p style={{ color: '#6b7280', marginTop: '1rem' }}>
        [Page Register — à développer par Junior]
      </p>
      <p style={{ marginTop: '1rem' }}>
        <Link to="/login" style={{ color: '#F5A623' }}>Déjà un compte ? Se connecter</Link>
      </p>
    </div>
  )
}