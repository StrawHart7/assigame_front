// PAGE : Commandes
// RESPONSABLE : Strawhart
// ENDPOINT : GET /api/commande/utilisateur/{idUtilisateur}

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const STATUT_CONFIG = {
  EN_ATTENTE:  { label: 'En attente',  bg: '#fef9c3', color: '#854d0e' },
  CONFIRMEE:   { label: 'Confirmée',   bg: '#dcfce7', color: '#166534' },
  EXPEDIEE:    { label: 'Expédiée',    bg: '#dbeafe', color: '#1e40af' },
  LIVREE:      { label: 'Livrée',      bg: '#f0fdf4', color: '#15803d' },
  ANNULEE:     { label: 'Annulée',     bg: '#fee2e2', color: '#991b1b' },
}

export default function Commandes() {
  const { user } = useAuth()
  const [commandes, setCommandes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) return
    api.get(`/commande/utilisateur/${user.id_utilisateur}`)
      .then(res => setCommandes(res.data))
      .catch(() => setError('Impossible de charger vos commandes.'))
      .finally(() => setLoading(false))
  }, [user])

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem', color: '#6b7280' }}>
      Chargement de vos commandes...
    </div>
  )

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 2rem' }}>
      <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
        Mes commandes
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '2rem', fontSize: '0.95rem' }}>
        {commandes.length === 0 ? 'Aucune commande pour l\'instant' : `${commandes.length} commande(s)`}
      </p>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', color: '#dc2626' }}>
          {error}
        </div>
      )}

      {commandes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📦</div>
          <h2 style={{ fontWeight: 700, color: '#1a1a1a' }}>Aucune commande</h2>
          <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>Vos commandes apparaîtront ici.</p>
          <Link to="/catalogue" style={{
            display: 'inline-block', marginTop: '1.5rem',
            background: '#F5A623', color: '#fff',
            padding: '0.75rem 1.75rem', borderRadius: '10px',
            textDecoration: 'none', fontWeight: 600
          }}>
            Voir le catalogue
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {commandes.map(commande => (
            <CarteCommande key={commande.id_commande} commande={commande} />
          ))}
        </div>
      )}
    </div>
  )
}

function CarteCommande({ commande }) {
  const [open, setOpen] = useState(false)
  const statut = STATUT_CONFIG[commande.statut] || { label: commande.statut, bg: '#f3f4f6', color: '#4b5563' }
  const lignes = commande.lignesCommande || []

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'long', year: 'numeric'
    })
  }

  return (
    <div style={{
      background: '#fff', borderRadius: '16px',
      border: '1px solid #e5e7eb', overflow: 'hidden',
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
    }}>
      {/* Header commande */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          padding: '1.25rem 1.5rem', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div>
            <p style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a1a1a' }}>
              Commande #{commande.id_commande}
            </p>
            <p style={{ fontSize: '0.82rem', color: '#9ca3af', marginTop: '0.15rem' }}>
              {formatDate(commande.date_commande)}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Badge statut */}
          <span style={{
            padding: '0.3rem 0.75rem', borderRadius: '20px',
            fontSize: '0.78rem', fontWeight: 600,
            background: statut.bg, color: statut.color
          }}>
            {statut.label}
          </span>
          <span style={{ fontWeight: 800, color: '#F5A623', fontSize: '1rem' }}>
            {commande.montant_total?.toFixed(2)} FCFA
          </span>
          <span style={{ color: '#9ca3af', fontSize: '1.2rem', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}>
            ↓
          </span>
        </div>
      </div>

      {/* Détail déroulant */}
      {open && (
        <div style={{ borderTop: '1px solid #f3f4f6', padding: '1.25rem 1.5rem', background: '#fafafa' }}>
          {lignes.length === 0 ? (
            <p style={{ color: '#9ca3af', fontSize: '0.88rem' }}>Aucun article à afficher.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {lignes.map(l => (
                <div key={l.id_lignecommande} style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', fontSize: '0.88rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '8px',
                      background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.2rem', flexShrink: 0
                    }}>
                      📦
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, color: '#1a1a1a' }}>
                        {l.produit?.nom_produit || `Produit #${l.id_produit}`}
                      </p>
                      <p style={{ color: '#6b7280' }}>
                        {l.prix_unitaire?.toFixed(2)} FCFA × {l.quantite}
                      </p>
                    </div>
                  </div>
                  <span style={{ fontWeight: 700, color: '#1a1a1a' }}>
                    {(l.prix_unitaire * l.quantite).toFixed(2)} FCFA
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}