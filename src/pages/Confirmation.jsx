// PAGE : Confirmation
// RESPONSABLE : Strawhart
// Affichée après POST /api/commande/valider/{idUtilisateur} réussi

import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Confirmation() {
  const { user } = useAuth()

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '4rem 2rem', textAlign: 'center' }}>

      {/* Icône succès */}
      <div style={{
        width: '80px', height: '80px', borderRadius: '50%',
        background: '#f0fdf4', border: '3px solid #16a34a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 1.5rem',
        fontSize: '2.5rem'
      }}>
        ✓
      </div>

      <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800, color: '#1a1a1a' }}>
        Commande confirmée !
      </h1>
      <p style={{ color: '#6b7280', marginTop: '0.75rem', fontSize: '1rem', lineHeight: 1.6 }}>
        Merci {user?.Prenom}, votre commande a bien été enregistrée.
        Vous serez contacté(e) pour les détails de livraison.
      </p>

      {/* Infos commande */}
      <div style={{
        margin: '2rem 0', padding: '1.5rem',
        background: '#fff', borderRadius: '16px',
        border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        textAlign: 'left'
      }}>
        <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
          Prochaines étapes
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Step numero="1" texte="Votre commande est en cours de traitement" />
          <Step numero="2" texte="Vous recevrez une confirmation de l'expédition" />
          <Step numero="3" texte="Livraison à l'adresse indiquée" />
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link
          to="/commandes"
          style={{
            background: '#F5A623', color: '#fff',
            textDecoration: 'none', padding: '0.75rem 1.5rem',
            borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem'
          }}
        >
          Voir mes commandes
        </Link>
        <Link
          to="/catalogue"
          style={{
            background: '#fff', color: '#4b5563',
            textDecoration: 'none', padding: '0.75rem 1.5rem',
            borderRadius: '10px', fontWeight: 600, fontSize: '0.95rem',
            border: '1px solid #e5e7eb'
          }}
        >
          Continuer mes achats
        </Link>
      </div>
    </div>
  )
}

function Step({ numero, texte }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={{
        width: '28px', height: '28px', borderRadius: '50%',
        background: '#F5A623', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.8rem', fontWeight: 700, flexShrink: 0
      }}>
        {numero}
      </div>
      <span style={{ fontSize: '0.9rem', color: '#4b5563' }}>{texte}</span>
    </div>
  )
}