// PAGE : Panier
// Source de données : localStorage uniquement (clé : 'assigame_panier')
// Pas d'endpoint backend panier — tout est local
// Structure d'un item : { id_produit, nom_produit, prix, image, statut, quantite }

import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// ── Helpers localStorage ───────────────────────────────────────────

const getPanier = () => {
  try { return JSON.parse(localStorage.getItem('assigame_panier') || '[]') }
  catch { return [] }
}

const savePanier = (items) =>
  localStorage.setItem('assigame_panier', JSON.stringify(items))

const formatPrix = (prix) =>
  prix != null ? Number(prix).toLocaleString('fr-FR') + ' FCFA' : '—'

// ── Page principale ────────────────────────────────────────────────

export default function Panier() {
  const { setCartCount } = useAuth()
  const [items, setItems] = useState([])
  const [toast, setToast] = useState(null)
  const [commandeEnvoyee, setCommandeEnvoyee] = useState(false)
  const toastTimer = useRef(null)

  useEffect(() => { setItems(getPanier()) }, [])

  const sync = (newItems) => {
    setItems(newItems)
    savePanier(newItems)
    setCartCount(newItems.reduce((acc, i) => acc + i.quantite, 0))
  }

  const showToast = (message, type = 'success') => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast({ message, type })
    toastTimer.current = setTimeout(() => setToast(null), 3000)
  }

  const changerQuantite = (id, delta) => {
    const updated = items
      .map(i => i.id_produit === id ? { ...i, quantite: i.quantite + delta } : i)
      .filter(i => i.quantite > 0)
    sync(updated)
  }

  const supprimer = (id) => {
    const item = items.find(i => i.id_produit === id)
    sync(items.filter(i => i.id_produit !== id))
    showToast(`"${item?.nom_produit}" retiré du panier.`, 'info')
  }

  const viderPanier = () => {
    sync([])
    showToast('Panier vidé.', 'info')
  }

  const total = items.reduce((acc, i) => acc + (i.prix || 0) * i.quantite, 0)
  const nbArticles = items.reduce((acc, i) => acc + i.quantite, 0)

  // Commande via WhatsApp — construit un message récapitulatif
  const commanderWhatsApp = () => {
    const lignes = items.map(
      i => `• ${i.nom_produit} x${i.quantite} — ${formatPrix(i.prix * i.quantite)}`
    ).join('\n')
    const msg = `Bonjour, je souhaite commander :\n\n${lignes}\n\n*Total : ${formatPrix(total)}*`
    const url = `https://wa.me/22890000000?text=${encodeURIComponent(msg)}`
    window.open(url, '_blank')
    setCommandeEnvoyee(true)
  }

  if (commandeEnvoyee) return <Confirmation onRetour={() => { viderPanier(); setCommandeEnvoyee(false) }} />

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 2rem' }}>

      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800, color: '#1a1a1a' }}>
            Mon <span style={{ color: '#F5A623' }}>panier</span>
          </h1>
          <p style={{ color: '#6b7280', marginTop: '0.3rem', fontSize: '0.9rem' }}>
            {nbArticles} article{nbArticles > 1 ? 's' : ''} sélectionné{nbArticles > 1 ? 's' : ''}
          </p>
        </div>
        {items.length > 0 && (
          <button onClick={viderPanier} style={btnViderStyle}>
            🗑 Vider le panier
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <PanierVide />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'start' }}>

          {/* Liste articles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {items.map(item => (
              <ItemPanier
                key={item.id_produit}
                item={item}
                onIncrement={() => changerQuantite(item.id_produit, 1)}
                onDecrement={() => changerQuantite(item.id_produit, -1)}
                onSupprimer={() => supprimer(item.id_produit)}
              />
            ))}
          </div>

          {/* Récapitulatif */}
          <Recapitulatif
            total={total}
            nbArticles={nbArticles}
            onCommander={commanderWhatsApp}
          />

        </div>
      )}
    </div>
  )
}

// ── Item panier ────────────────────────────────────────────────────

function ItemPanier({ item, onIncrement, onDecrement, onSupprimer }) {
  const [imgError, setImgError] = useState(false)
  const sousTotal = (item.prix || 0) * item.quantite

  return (
    <div style={{
      display: 'flex', gap: '1rem', background: '#fff',
      borderRadius: '14px', border: '1px solid #e5e7eb',
      padding: '1rem', alignItems: 'center',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    }}>

      {/* Image */}
      <div style={{ width: '80px', height: '80px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {item.image && !imgError ? (
          <img src={item.image} alt={item.nom_produit} onError={() => setImgError(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: '2rem' }}>📦</span>
        )}
      </div>

      {/* Infos */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {item.nom_produit}
        </p>
        <p style={{ fontSize: '0.82rem', color: '#9ca3af', marginTop: '0.2rem' }}>
          {formatPrix(item.prix)} / unité
        </p>
      </div>

      {/* Quantité */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
        <button onClick={onDecrement} style={btnQteStyle}>−</button>
        <span style={{ fontWeight: 700, minWidth: '24px', textAlign: 'center', fontSize: '0.95rem' }}>
          {item.quantite}
        </span>
        <button onClick={onIncrement} style={btnQteStyle}>+</button>
      </div>

      {/* Sous-total */}
      <p style={{ fontWeight: 800, fontSize: '0.97rem', color: '#1a1a1a', minWidth: '110px', textAlign: 'right', flexShrink: 0 }}>
        {formatPrix(sousTotal)}
      </p>

      {/* Supprimer */}
      <button onClick={onSupprimer} title="Retirer" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '1.2rem', padding: '0.3rem', flexShrink: 0 }}>
        ×
      </button>

    </div>
  )
}

// ── Récapitulatif ──────────────────────────────────────────────────

function Recapitulatif({ total, nbArticles, onCommander }) {
  return (
    <div style={{
      background: '#fff', borderRadius: '16px',
      border: '1px solid #e5e7eb', padding: '1.5rem',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      position: 'sticky', top: '80px',
    }}>
      <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.1rem', marginBottom: '1.25rem' }}>
        Récapitulatif
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
        <LigneRecap label="Articles" valeur={`${nbArticles} article${nbArticles > 1 ? 's' : ''}`} />
        <LigneRecap label="Livraison" valeur="À convenir" />
      </div>

      <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 700, fontSize: '1rem' }}>Total</span>
          <span style={{ fontWeight: 800, fontSize: '1.3rem', color: '#F5A623' }}>
            {formatPrix(total)}
          </span>
        </div>
      </div>

      {/* Bouton commande WhatsApp */}
      <button onClick={onCommander} style={btnCommanderStyle}>
        <WhatsAppIcon /> Commander via WhatsApp
      </button>

      <Link
        to="/catalogue"
        style={{ display: 'block', textAlign: 'center', marginTop: '0.85rem', fontSize: '0.85rem', color: '#6b7280', textDecoration: 'none' }}
      >
        ← Continuer mes achats
      </Link>
    </div>
  )
}

function LigneRecap({ label, valeur }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#6b7280' }}>
      <span>{label}</span>
      <span>{valeur}</span>
    </div>
  )
}

// ── Confirmation post-commande ──────────────────────────────────────

function Confirmation({ onRetour }) {
  return (
    <div style={{ maxWidth: '480px', margin: '6rem auto', textAlign: 'center', padding: '0 2rem' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
      <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.6rem', color: '#1a1a1a' }}>
        Commande envoyée !
      </h2>
      <p style={{ color: '#6b7280', marginTop: '0.75rem', lineHeight: 1.6, fontSize: '0.95rem' }}>
        Votre message WhatsApp a été préparé. Le vendeur vous recontactera pour confirmer la livraison.
      </p>
      <button
        onClick={onRetour}
        style={{ marginTop: '2rem', background: '#F5A623', color: '#fff', border: 'none', padding: '0.8rem 2rem', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}
      >
        Retour au catalogue
      </button>
    </div>
  )
}

// ── Panier vide ────────────────────────────────────────────────────

function PanierVide() {
  return (
    <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
      <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🛒</div>
      <h2 style={{ fontWeight: 700, color: '#1a1a1a', fontSize: '1.3rem' }}>Votre panier est vide</h2>
      <p style={{ color: '#6b7280', marginTop: '0.5rem', fontSize: '0.92rem' }}>
        Ajoutez des produits depuis le catalogue pour commencer.
      </p>
      <Link
        to="/catalogue"
        style={{ display: 'inline-block', marginTop: '1.5rem', background: '#F5A623', color: '#fff', padding: '0.7rem 1.5rem', borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}
      >
        Voir le catalogue
      </Link>
    </div>
  )
}

// ── Toast ──────────────────────────────────────────────────────────

function Toast({ message, type }) {
  const isInfo = type === 'info'
  return (
    <div style={{
      position: 'fixed', top: '80px', right: '2rem', zIndex: 9999,
      padding: '0.85rem 1.25rem', borderRadius: '10px', fontWeight: 600,
      fontSize: '0.88rem', boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
      background: isInfo ? '#f0f9ff' : '#f0fdf4',
      color: isInfo ? '#0369a1' : '#166534',
      border: `1px solid ${isInfo ? '#bae6fd' : '#bbf7d0'}`,
      maxWidth: '320px',
    }}>
      {message}
    </div>
  )
}

// ── Icône WhatsApp ─────────────────────────────────────────────────

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
    </svg>
  )
}

// ── Styles ─────────────────────────────────────────────────────────

const btnQteStyle = {
  width: '30px', height: '30px', borderRadius: '8px',
  border: '1px solid #e5e7eb', background: '#f9fafb',
  fontSize: '1.1rem', cursor: 'pointer', fontWeight: 700,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: '#4b5563',
}

const btnCommanderStyle = {
  width: '100%', background: '#25D366', color: '#fff',
  border: 'none', borderRadius: '12px', padding: '0.9rem',
  fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
}

const btnViderStyle = {
  background: 'none', border: '1px solid #fca5a5',
  color: '#dc2626', padding: '0.5rem 1rem', borderRadius: '8px',
  fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
}