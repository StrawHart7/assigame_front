// PAGE : Panier
// RESPONSABLE : Strawhart
// ENDPOINTS :
//   GET  /api/panier/{idUtilisateur}/lignes
//   PUT  /api/panier/ligne/{idLigne}?quantite=X
//   DELETE /api/panier/ligne/{idLigne}
//   DELETE /api/panier/{idUtilisateur}/vider

import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Panier() {
  const { user, setCartCount } = useAuth()
  const navigate = useNavigate()
  const [lignes, setLignes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)

  const fetchLignes = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/panier/${user.id_utilisateur}/lignes`)
      setLignes(res.data)
      const total = res.data.reduce((acc, l) => acc + l.quantite, 0)
      setCartCount(total)
    } catch (e) {
      setError('Impossible de charger le panier.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) fetchLignes()
  }, [user])

  const updateQuantite = async (idLigne, nouvelleQte) => {
    if (nouvelleQte < 1) return
    setActionLoading(idLigne)
    try {
      await api.put(`/panier/ligne/${idLigne}?quantite=${nouvelleQte}`)
      await fetchLignes()
    } catch {
      alert('Erreur lors de la modification.')
    } finally {
      setActionLoading(null)
    }
  }

  const supprimerLigne = async (idLigne) => {
    setActionLoading(idLigne)
    try {
      await api.delete(`/panier/ligne/${idLigne}`)
      await fetchLignes()
    } catch {
      alert('Erreur lors de la suppression.')
    } finally {
      setActionLoading(null)
    }
  }

  const viderPanier = async () => {
    if (!window.confirm('Vider tout le panier ?')) return
    try {
      await api.delete(`/panier/${user.id_utilisateur}/vider`)
      setLignes([])
    } catch {
      alert('Erreur lors du vidage du panier.')
    }
  }

  const subtotal = lignes.reduce((acc, l) => acc + (Number(l.prix_unitaire) * l.quantite), 0)
  const tax = subtotal * 0.08
  const total = subtotal + tax
  const formatPrix = (val) => Number(val).toLocaleString('fr-FR') + ' FCFA'

  if (loading) return <PageLoader />

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800, color: '#1a1a1a' }}>
            Panier
          </h1>
          <p style={{ color: '#6b7280', marginTop: '0.25rem', fontSize: '0.95rem' }}>
            {lignes.length === 0
              ? 'Votre panier est vide'
              : `${lignes.reduce((a, l) => a + l.quantite, 0)} article(s) dans votre panier`}
          </p>
        </div>
        <Link to="/catalogue" style={{
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          color: '#4b5563', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500
        }}>
          ← Continuer mes achats
        </Link>
      </div>

      {error && <ErrorBanner message={error} />}

      {lignes.length === 0 ? (
        <EmptyCart />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '1.5rem', alignItems: 'start' }}>
          {/* Cart Items */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Articles</h2>
              <button onClick={viderPanier} style={clearBtnStyle}>
                <TrashIcon size={15} /> Vider le panier
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {lignes.map((ligne, index) => (
                <div key={ligne.id_lignepanier}>
                  <LignePanier
                    ligne={ligne}
                    loading={actionLoading === ligne.id_lignepanier}
                    onUpdateQte={(q) => updateQuantite(ligne.id_lignepanier, q)}
                    onSupprimer={() => supprimerLigne(ligne.id_lignepanier)}
                  />
                  {index < lignes.length - 1 && <Divider />}
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div style={{ ...cardStyle, position: 'sticky', top: '80px' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.5rem' }}>
              Récapitulatif
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <SummaryRow
                label={`Sous-total (${lignes.reduce((a, l) => a + l.quantite, 0)} articles)`}
                value={formatPrix(subtotal)}
              />
              <SummaryRow label="Livraison" value={<span style={{ color: '#16a34a', fontWeight: 600 }}>Gratuite</span>} />
              <SummaryRow label="Taxes (8%)" value={formatPrix(tax)} />
            </div>

            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>Total</span>
                <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#F5A623' }}>
                  {formatPrix(total)}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              style={checkoutBtnStyle}
            >
              Passer la commande →
            </button>

            {/* Badges de confiance */}
            <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <TrustBadge icon="🔒" text="Paiement sécurisé SSL" />
              <TrustBadge icon="🔄" text="Retours gratuits sous 30 jours" />
              <TrustBadge icon="💬" text="Support client 24/7" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Sous-composants ──────────────────────────────────────────────

function LignePanier({ ligne, loading, onUpdateQte, onSupprimer }) {
  const produit = ligne.produit || {}
  const [imgError, setImgError] = useState(false)

  // prix_unitaire est le prix capturé au moment de l'ajout — source unique de vérité
  const prixUnitaire = Number(ligne.prix_unitaire) || 0
  const sousTotal = prixUnitaire * ligne.quantite

  const formatPrix = (val) => val.toLocaleString('fr-FR') + ' FCFA'

  return (
    <div style={{ display: 'flex', gap: '1rem', padding: '1.25rem 0', opacity: loading ? 0.5 : 1 }}>
      {/* Image */}
      <div style={{
        width: '80px', height: '80px', borderRadius: '10px',
        background: '#f3f4f6', flexShrink: 0, overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {produit.image && !imgError
          ? <img
              src={produit.image}
              alt={produit.nom_produit}
              onError={() => setImgError(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          : <span style={{ fontSize: '2rem' }}>📦</span>
        }
      </div>

      {/* Infos */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.95rem', color: '#1a1a1a' }}>
              {produit.nom_produit || 'Produit'}
            </p>
            <p style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '0.2rem' }}>
              {formatPrix(prixUnitaire)} / unité
            </p>
          </div>
          <button onClick={onSupprimer} disabled={loading} style={deleteBtnStyle}>
            <TrashIcon size={16} />
          </button>
        </div>

        {/* Quantité + sous-total recalculé */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
            <button
              onClick={() => onUpdateQte(ligne.quantite - 1)}
              disabled={loading || ligne.quantite <= 1}
              style={qtyBtnStyle}
            >−</button>
            <span style={{ padding: '0.4rem 1rem', fontSize: '0.95rem', fontWeight: 600, minWidth: '40px', textAlign: 'center' }}>
              {ligne.quantite}
            </span>
            <button
              onClick={() => onUpdateQte(ligne.quantite + 1)}
              disabled={loading}
              style={qtyBtnStyle}
            >+</button>
          </div>
          <span style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a1a' }}>
            {formatPrix(sousTotal)}
          </span>
        </div>
      </div>
    </div>
  )
}

function SummaryRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
      <span style={{ color: '#6b7280' }}>{label}</span>
      <span style={{ fontWeight: 500 }}>{value}</span>
    </div>
  )
}

function TrustBadge({ icon, text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#6b7280' }}>
      <span>{icon}</span>
      <span>{text}</span>
    </div>
  )
}

function EmptyCart() {
  return (
    <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
      <h2 style={{ fontWeight: 700, fontSize: '1.3rem', color: '#1a1a1a' }}>Votre panier est vide</h2>
      <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>Découvrez nos produits et ajoutez-en à votre panier.</p>
      <Link to="/catalogue" style={{
        display: 'inline-block', marginTop: '1.5rem',
        background: '#F5A623', color: '#fff',
        padding: '0.75rem 1.75rem', borderRadius: '10px',
        textDecoration: 'none', fontWeight: 600
      }}>
        Voir le catalogue
      </Link>
    </div>
  )
}

function PageLoader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center', color: '#6b7280' }}>Chargement du panier...</div>
    </div>
  )
}

function ErrorBanner({ message }) {
  return (
    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', color: '#dc2626' }}>
      {message}
    </div>
  )
}

function Divider() {
  return <div style={{ height: '1px', background: '#f3f4f6' }} />
}

function TrashIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="3,6 5,6 21,6"/><path d="M19,6l-1,14H6L5,6"/><path d="M10,11v6M14,11v6"/><path d="M9,6V4h6v2"/>
    </svg>
  )
}

// ── Styles ───────────────────────────────────────────────────────

const cardStyle = {
  background: '#fff',
  borderRadius: '16px',
  padding: '1.5rem',
  border: '1px solid #e5e7eb',
  boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
}

const checkoutBtnStyle = {
  width: '100%', background: '#F5A623', color: '#fff',
  border: 'none', borderRadius: '10px', padding: '0.9rem',
  fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
  transition: 'background 0.2s'
}

const clearBtnStyle = {
  display: 'flex', alignItems: 'center', gap: '0.4rem',
  background: 'transparent', border: '1px solid #e5e7eb',
  color: '#6b7280', padding: '0.4rem 0.8rem',
  borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem'
}

const deleteBtnStyle = {
  background: 'transparent', border: 'none',
  color: '#9ca3af', cursor: 'pointer', padding: '0.25rem',
  borderRadius: '6px', display: 'flex', alignItems: 'center'
}

const qtyBtnStyle = {
  background: 'transparent', border: 'none',
  width: '36px', height: '36px', cursor: 'pointer',
  fontSize: '1.1rem', color: '#4b5563',
  display: 'flex', alignItems: 'center', justifyContent: 'center'
}