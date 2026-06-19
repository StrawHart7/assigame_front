// PAGE : Checkout
// RESPONSABLE : Strawhart
// ENDPOINTS :
//   GET  /api/panier/{idUtilisateur}/lignes  (pour afficher le récap)
//   POST /api/commande/valider/{idUtilisateur}

import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Checkout() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [lignes, setLignes] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) return
    api.get(`/panier/${user.id_utilisateur}/lignes`)
      .then(res => setLignes(res.data))
      .catch(() => setError('Impossible de charger le panier.'))
      .finally(() => setLoading(false))
  }, [user])

  const subtotal = lignes.reduce((acc, l) => acc + l.prix_unitaire * l.quantite, 0)
  const tax = subtotal * 0.08
  const total = subtotal + tax

  const validerCommande = async () => {
    if (lignes.length === 0) return
    setSubmitting(true)
    setError(null)
    try {
      await api.post(`/commande/valider/${user.id_utilisateur}`)
      navigate('/confirmation')
    } catch (e) {
      setError('Une erreur est survenue lors de la validation. Veuillez réessayer.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <PageLoader />

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/panier" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.9rem' }}>
          ← Retour au panier
        </Link>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800, marginTop: '0.75rem' }}>
          Finaliser la commande
        </h1>
      </div>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', color: '#dc2626' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1.5rem', alignItems: 'start' }}>
        {/* Infos livraison */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Infos client (readonly) */}
          <Section title="Informations client">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <ReadonlyField label="Nom" value={user?.Nom} />
              <ReadonlyField label="Prénom" value={user?.Prenom} />
              <ReadonlyField label="Email" value={user?.Email} />
              <ReadonlyField label="Téléphone" value={user?.telephone || '—'} />
            </div>
          </Section>

          {/* Adresse livraison (champs décoratifs — pas de backend pour ça) */}
          <Section title="Adresse de livraison">
            <p style={{ fontSize: '0.82rem', color: '#9ca3af', marginBottom: '1rem', fontStyle: 'italic' }}>
              Ces informations seront traitées lors de la livraison.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <InputField label="Adresse" placeholder="Rue, quartier..." />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <InputField label="Ville" placeholder="Ex: Lomé" />
                <InputField label="Pays" placeholder="Ex: Togo" defaultValue="Togo" />
              </div>
            </div>
          </Section>

          {/* Mode de paiement (décoratif) */}
          <Section title="Mode de paiement">
            <p style={{ fontSize: '0.82rem', color: '#9ca3af', marginBottom: '1rem', fontStyle: 'italic' }}>
              Le paiement s'effectue à la livraison.
            </p>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '1rem', borderRadius: '10px',
              border: '2px solid #F5A623', background: '#fffbf0'
            }}>
              <span style={{ fontSize: '1.5rem' }}>💵</span>
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Paiement à la livraison</p>
                <p style={{ fontSize: '0.82rem', color: '#6b7280' }}>Payez en espèces lors de la réception</p>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#F5A623', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff' }} />
                </div>
              </div>
            </div>
          </Section>
        </div>

        {/* Récap commande */}
        <div style={{ ...cardStyle, position: 'sticky', top: '80px' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Votre commande
          </h2>

          {/* Liste articles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {lignes.map(l => (
              <div key={l.id_lignepanier} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                <span style={{ color: '#4b5563' }}>
                  {l.produit?.nom_produit || 'Produit'} × {l.quantite}
                </span>
                <span style={{ fontWeight: 600 }}>
                  {(l.prix_unitaire * l.quantite).toFixed(2)} FCFA
                </span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#6b7280' }}>
              <span>Sous-total</span><span>{subtotal.toFixed(2)} FCFA</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#6b7280' }}>
              <span>Livraison</span><span style={{ color: '#16a34a', fontWeight: 600 }}>Gratuite</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#6b7280' }}>
              <span>Taxes (8%)</span><span>{tax.toFixed(2)} FCFA</span>
            </div>
          </div>

          <div style={{ borderTop: '2px solid #e5e7eb', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>Total</span>
            <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#F5A623' }}>
              {total.toFixed(2)} FCFA
            </span>
          </div>

          <button
            onClick={validerCommande}
            disabled={submitting || lignes.length === 0}
            style={{
              ...checkoutBtnStyle,
              opacity: (submitting || lignes.length === 0) ? 0.7 : 1,
              cursor: (submitting || lignes.length === 0) ? 'not-allowed' : 'pointer'
            }}
          >
            {submitting ? 'Validation en cours...' : '✓ Confirmer la commande'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#9ca3af', marginTop: '1rem' }}>
            🔒 Commande sécurisée
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Sous-composants ──────────────────────────────────────────────

function Section({ title, children }) {
  return (
    <div style={cardStyle}>
      <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: '#1a1a1a' }}>{title}</h2>
      {children}
    </div>
  )
}

function ReadonlyField({ label, value }) {
  return (
    <div>
      <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </label>
      <div style={{
        marginTop: '0.35rem', padding: '0.6rem 0.9rem',
        background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb',
        fontSize: '0.9rem', color: '#1a1a1a'
      }}>
        {value || '—'}
      </div>
    </div>
  )
}

function InputField({ label, placeholder, defaultValue }) {
  return (
    <div>
      <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        defaultValue={defaultValue}
        style={{
          width: '100%', marginTop: '0.35rem', padding: '0.6rem 0.9rem',
          border: '1px solid #e5e7eb', borderRadius: '8px',
          fontSize: '0.9rem', outline: 'none', fontFamily: 'Inter, sans-serif'
        }}
      />
    </div>
  )
}

function PageLoader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: '#6b7280' }}>
      Chargement...
    </div>
  )
}

const cardStyle = {
  background: '#fff', borderRadius: '16px', padding: '1.5rem',
  border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
}

const checkoutBtnStyle = {
  width: '100%', background: '#F5A623', color: '#fff', border: 'none',
  borderRadius: '10px', padding: '0.9rem', fontSize: '1rem',
  fontWeight: 700, cursor: 'pointer'
}