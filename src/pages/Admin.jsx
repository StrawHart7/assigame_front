// PAGE : Admin
// ENDPOINTS RÉELS :
//   GET    /api/produit/list
//   DELETE /api/produit/delete/{id}
//   PUT    /api/produit/update/{id}  ← pour changer le statut
// Pas de protection PrivateRoute pour l'instant (auth fictive)

import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

const formatPrix = (prix) =>
  prix != null ? Number(prix).toLocaleString('fr-FR') + ' FCFA' : '—'

const STATUT_CONFIG = {
  disponible: { label: 'Disponible', color: '#16a34a', bg: '#dcfce7' },
  vendu:      { label: 'Vendu',      color: '#dc2626', bg: '#fee2e2' },
  'réservé':  { label: 'Réservé',    color: '#d97706', bg: '#fef3c7' },
  reservé:    { label: 'Réservé',    color: '#d97706', bg: '#fef3c7' },
}

export default function Admin() {
  const [produits, setProduits]         = useState([])
  const [loading, setLoading]           = useState(true)
  const [recherche, setRecherche]       = useState('')
  const [toast, setToast]               = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null) // id à confirmer
  const [updatingId, setUpdatingId]     = useState(null)   // id en cours de maj statut
  const toastTimer = useRef(null)

  useEffect(() => { charger() }, [])

  const charger = () => {
    setLoading(true)
    api.get('/produit/list')
      .then(res => setProduits(res.data))
      .catch(() => showToast('Erreur de chargement.', 'error'))
      .finally(() => setLoading(false))
  }

  const showToast = (message, type = 'success') => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast({ message, type })
    toastTimer.current = setTimeout(() => setToast(null), 3500)
  }

  // Suppression avec confirmation
  const supprimerProduit = async (id) => {
    try {
      await api.delete(`/produit/delete/${id}`)
      setProduits(prev => prev.filter(p => p.id_produit !== id))
      showToast('Produit supprimé.', 'success')
    } catch {
      showToast('Erreur lors de la suppression.', 'error')
    } finally {
      setConfirmDelete(null)
    }
  }

  // Changement de statut via PUT
  const changerStatut = async (produit, nouveauStatut) => {
    setUpdatingId(produit.id_produit)
    try {
      const payload = {
        ...produit,
        statut: nouveauStatut,
        categorieProduit: produit.categorieProduit
          ? { idcategorie_produit: produit.categorieProduit.idcategorie_produit }
          : null,
        utilisateur: { id_utilisateur: 1 },
      }
      await api.put(`/produit/update/${produit.id_produit}`, payload)
      setProduits(prev =>
        prev.map(p => p.id_produit === produit.id_produit ? { ...p, statut: nouveauStatut } : p)
      )
      showToast(`Statut mis à jour : ${nouveauStatut}`, 'success')
    } catch {
      showToast('Erreur lors de la mise à jour.', 'error')
    } finally {
      setUpdatingId(null)
    }
  }

  // ── Stats dérivées ────────────────────────────────────────────────
  const stats = {
    total:       produits.length,
    disponibles: produits.filter(p => p.statut?.toLowerCase() === 'disponible').length,
    vendus:      produits.filter(p => p.statut?.toLowerCase() === 'vendu').length,
    reserves:    produits.filter(p => ['réservé', 'reservé'].includes(p.statut?.toLowerCase())).length,
    valeurStock: produits
      .filter(p => p.statut?.toLowerCase() === 'disponible')
      .reduce((acc, p) => acc + (p.prix || 0), 0),
  }

  const produitsFiltres = produits.filter(p =>
    p.nom_produit?.toLowerCase().includes(recherche.toLowerCase()) ||
    p.categorieProduit?.nom_categorieproduit?.toLowerCase().includes(recherche.toLowerCase())
  )

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 2rem' }}>

      {toast && <Toast message={toast.message} type={toast.type} />}

      {confirmDelete && (
        <ModalConfirm
          onConfirm={() => supprimerProduit(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800, color: '#1a1a1a' }}>
            Dashboard <span style={{ color: '#F5A623' }}>Admin</span>
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '0.3rem' }}>
            Gestion des produits Assigame
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={charger} style={btnSecondaireStyle}>↻ Actualiser</button>
          <Link to="/catalogue" style={{ ...btnSecondaireStyle, textDecoration: 'none' }}>
            ← Catalogue
          </Link>
        </div>
      </div>

      {/* Cartes stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <CarteStatut label="Total produits"  valeur={stats.total}       couleur='#1a1a1a' icone="📦" />
        <CarteStatut label="Disponibles"     valeur={stats.disponibles} couleur='#16a34a' icone="✅" />
        <CarteStatut label="Vendus"          valeur={stats.vendus}      couleur='#dc2626' icone="🏷" />
        <CarteStatut label="Réservés"        valeur={stats.reserves}    couleur='#d97706' icone="⏳" />
        <CarteStatut label="Valeur en stock" valeur={formatPrix(stats.valeurStock)} couleur='#F5A623' icone="💰" grand />
      </div>

      {/* Barre recherche */}
      <div style={{ position: 'relative', marginBottom: '1.25rem', maxWidth: '360px' }}>
        <span style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>🔍</span>
        <input
          type="text"
          placeholder="Filtrer par nom ou catégorie..."
          value={recherche}
          onChange={e => setRecherche(e.target.value)}
          style={{ width: '100%', padding: '0.65rem 0.9rem 0.65rem 2.5rem', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '0.88rem', outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }}
        />
      </div>

      {/* Tableau produits */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>Chargement...</div>
      ) : produitsFiltres.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>Aucun produit trouvé.</div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>

          {/* En-tête tableau */}
          <div style={ligneHeaderStyle}>
            <span style={{ flex: '3' }}>Produit</span>
            <span style={{ flex: '2' }}>Catégorie</span>
            <span style={{ flex: '2' }}>Prix</span>
            <span style={{ flex: '2' }}>Statut</span>
            <span style={{ flex: '2', textAlign: 'right' }}>Actions</span>
          </div>

          {/* Lignes */}
          {produitsFiltres.map((produit, idx) => (
            <LigneProduit
              key={produit.id_produit}
              produit={produit}
              pair={idx % 2 === 0}
              enMaj={updatingId === produit.id_produit}
              onDelete={() => setConfirmDelete(produit.id_produit)}
              onStatut={(s) => changerStatut(produit, s)}
            />
          ))}

        </div>
      )}
    </div>
  )
}

// ── Ligne tableau ─────────────────────────────────────────────────

function LigneProduit({ produit, pair, enMaj, onDelete, onStatut }) {
  const [imgError, setImgError] = useState(false)
  const statutKey = produit.statut?.toLowerCase() || 'disponible'
  const statut = STATUT_CONFIG[statutKey] || { label: produit.statut, color: '#6b7280', bg: '#f3f4f6' }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      padding: '0.85rem 1.25rem',
      background: pair ? '#fff' : '#fafafa',
      borderBottom: '1px solid #f3f4f6',
      opacity: enMaj ? 0.5 : 1, transition: 'opacity 0.2s',
    }}>

      {/* Miniature + nom */}
      <div style={{ flex: '3', display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {produit.image && !imgError ? (
            <img src={produit.image} alt="" onError={() => setImgError(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : <span style={{ fontSize: '1.3rem' }}>📦</span>}
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontWeight: 600, fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#1a1a1a' }}>
            {produit.nom_produit}
          </p>
          <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>ID #{produit.id_produit}</p>
        </div>
      </div>

      {/* Catégorie */}
      <span style={{ flex: '2', fontSize: '0.82rem', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {produit.categorieProduit?.nom_categorieproduit || '—'}
      </span>

      {/* Prix */}
      <span style={{ flex: '2', fontSize: '0.88rem', fontWeight: 700, color: '#1a1a1a' }}>
        {formatPrix(produit.prix)}
      </span>

      {/* Statut — select pour changer directement */}
      <div style={{ flex: '2' }}>
        <select
          value={produit.statut || 'disponible'}
          disabled={enMaj}
          onChange={e => onStatut(e.target.value)}
          style={{
            padding: '0.3rem 0.55rem', borderRadius: '20px',
            border: `1px solid ${statut.color}40`,
            background: statut.bg, color: statut.color,
            fontSize: '0.75rem', fontWeight: 700,
            cursor: 'pointer', outline: 'none',
          }}
        >
          <option value="disponible">Disponible</option>
          <option value="vendu">Vendu</option>
          <option value="réservé">Réservé</option>
        </select>
      </div>

      {/* Actions */}
      <div style={{ flex: '2', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={onDelete}
          disabled={enMaj}
          style={{
            background: '#fee2e2', color: '#dc2626',
            border: 'none', borderRadius: '8px',
            padding: '0.4rem 0.85rem', fontSize: '0.8rem',
            fontWeight: 600, cursor: 'pointer',
          }}
        >
          🗑 Supprimer
        </button>
      </div>

    </div>
  )
}

// ── Modal confirmation suppression ────────────────────────────────

function ModalConfirm({ onConfirm, onCancel }) {
  return (
    <div style={{ position: 'fixed', inset: '0', background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', maxWidth: '380px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🗑</div>
        <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.2rem', color: '#1a1a1a', marginBottom: '0.5rem' }}>
          Confirmer la suppression
        </h3>
        <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Cette action est irréversible. Le produit sera définitivement supprimé de la base.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={onCancel}  style={{ flex: 1, padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '10px', background: '#fff', color: '#4b5563', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Annuler</button>
          <button onClick={onConfirm} style={{ flex: 1, padding: '0.75rem', border: 'none',                  borderRadius: '10px', background: '#dc2626', color: '#fff',     fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>Supprimer</button>
        </div>
      </div>
    </div>
  )
}

// ── Carte statistique ─────────────────────────────────────────────

function CarteStatut({ label, valeur, couleur, icone, grand }) {
  return (
    <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e5e7eb', padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
      <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{icone}</div>
      <p style={{ fontSize: grand ? '1.1rem' : '1.6rem', fontWeight: 800, color: couleur, lineHeight: 1.1 }}>
        {valeur}
      </p>
      <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.3rem' }}>{label}</p>
    </div>
  )
}

// ── Toast ─────────────────────────────────────────────────────────

function Toast({ message, type }) {
  return (
    <div style={{
      position: 'fixed', top: '80px', right: '2rem', zIndex: 9999,
      padding: '0.85rem 1.25rem', borderRadius: '10px', fontWeight: 600,
      fontSize: '0.88rem', boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
      background: type === 'error' ? '#fef2f2' : '#f0fdf4',
      color: type === 'error' ? '#dc2626' : '#166534',
      border: `1px solid ${type === 'error' ? '#fecaca' : '#bbf7d0'}`,
      maxWidth: '300px',
    }}>
      {type === 'error' ? '✕ ' : '✓ '}{message}
    </div>
  )
}

// ── Styles ────────────────────────────────────────────────────────

const ligneHeaderStyle = {
  display: 'flex', alignItems: 'center', gap: '0.75rem',
  padding: '0.75rem 1.25rem', background: '#f9fafb',
  borderBottom: '1px solid #e5e7eb',
  fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af',
  textTransform: 'uppercase', letterSpacing: '0.05em',
}

const btnSecondaireStyle = {
  background: '#fff', border: '1px solid #e5e7eb',
  color: '#4b5563', padding: '0.55rem 1rem',
  borderRadius: '8px', fontSize: '0.85rem',
  fontWeight: 600, cursor: 'pointer',
}