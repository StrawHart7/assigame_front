import { useState, useEffect, useRef } from 'react'

// ============================================================
// AdminDashboard — Assigame
//
// Sections :
//   - Vue d'ensemble (stats)
//   - Produits (ajouter, modifier, supprimer, stock)
//   - Utilisateurs (liste, bloquer/débloquer)
//
// 📌 BACKEND : remplacer localStorage par les appels API
// ============================================================

const CATEGORIES = ['Consoles', 'Jeux PC', 'Accessoires', 'Autre']
const FORM_VIDE = { nom: '', description: '', prix: '', categorie: 'Consoles', image: '', stock: '' }

// ─── Palette ────────────────────────────────────────────────
const C = {
  orange: '#F5A623',
  orangeLight: '#FFF7E6',
  dark: '#0F0F14',
  darkCard: '#1A1A24',
  darkBorder: '#2A2A38',
  white: '#FFFFFF',
  muted: '#8B8BA0',
  success: '#22C55E',
  danger: '#EF4444',
  info: '#6366F1',
  warn: '#F59E0B',
}

// ─── Helpers styles ─────────────────────────────────────────
const card = {
  background: C.darkCard,
  border: `1px solid ${C.darkBorder}`,
  borderRadius: '14px',
  padding: '1.4rem',
}

const labelStyle = {
  display: 'block',
  fontSize: '0.78rem',
  fontWeight: 700,
  color: C.muted,
  marginBottom: '0.4rem',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
}

const inputStyle = {
  width: '100%',
  padding: '0.7rem 0.9rem',
  background: '#0F0F14',
  border: `1px solid ${C.darkBorder}`,
  borderRadius: '8px',
  fontSize: '0.9rem',
  color: C.white,
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
}

// ─── Badge statut user ───────────────────────────────────────
function StatusBadge({ statut }) {
  const cfg = {
    ACTIF: { bg: '#14532d', color: C.success, label: 'Actif' },
    BLOQUE: { bg: '#450a0a', color: C.danger, label: 'Bloqué' },
  }[statut] || { bg: '#1e1b4b', color: C.info, label: statut }

  return (
    <span style={{
      display: 'inline-block',
      padding: '0.2rem 0.65rem',
      borderRadius: '20px',
      fontSize: '0.74rem',
      fontWeight: 700,
      background: cfg.bg,
      color: cfg.color,
      letterSpacing: '0.02em',
    }}>
      {cfg.label}
    </span>
  )
}

// ─── Badge stock ─────────────────────────────────────────────
function StockBadge({ stock }) {
  const n = parseInt(stock) || 0
  const cfg = n === 0
    ? { bg: '#450a0a', color: C.danger, label: 'Rupture' }
    : n < 5
      ? { bg: '#451a03', color: C.warn, label: `${n} restant` }
      : { bg: '#14532d', color: C.success, label: `${n} en stock` }

  return (
    <span style={{
      display: 'inline-block',
      padding: '0.2rem 0.65rem',
      borderRadius: '20px',
      fontSize: '0.74rem',
      fontWeight: 700,
      background: cfg.bg,
      color: cfg.color,
    }}>
      {cfg.label}
    </span>
  )
}

// ─── Nav latérale ────────────────────────────────────────────
function Sidebar({ active, setActive }) {
  const items = [
    { key: 'overview', icon: '▦', label: 'Vue d\'ensemble' },
    { key: 'produits', icon: '⊞', label: 'Produits' },
    { key: 'users', icon: '⊙', label: 'Utilisateurs' },
  ]

  return (
    <aside style={{
      width: '220px',
      minHeight: '100vh',
      background: C.darkCard,
      borderRight: `1px solid ${C.darkBorder}`,
      display: 'flex',
      flexDirection: 'column',
      padding: '2rem 0',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '0 1.5rem 2rem' }}>
        <span style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: '1.3rem',
          fontWeight: 800,
          color: C.white,
        }}>
          Assi<span style={{ color: C.orange }}>game</span>
        </span>
        <div style={{
          fontSize: '0.7rem',
          color: C.muted,
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginTop: '0.2rem',
        }}>
          Admin Panel
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1 }}>
        {items.map(item => (
          <button
            key={item.key}
            onClick={() => setActive(item.key)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.8rem 1.5rem',
              background: active === item.key ? `${C.orange}18` : 'transparent',
              border: 'none',
              borderLeft: active === item.key ? `3px solid ${C.orange}` : '3px solid transparent',
              color: active === item.key ? C.orange : C.muted,
              fontSize: '0.88rem',
              fontWeight: active === item.key ? 700 : 500,
              cursor: 'pointer',
              textAlign: 'left',
              fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}
          >
            <span style={{ fontSize: '1rem' }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Bas de sidebar */}
      <div style={{ padding: '1.5rem', borderTop: `1px solid ${C.darkBorder}` }}>
        <div style={{ fontSize: '0.75rem', color: C.muted }}>Connecté en tant que</div>
        <div style={{ fontSize: '0.85rem', color: C.white, fontWeight: 600, marginTop: '0.2rem' }}>
          Administrateur
        </div>
      </div>
    </aside>
  )
}

// ════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const [section, setSection] = useState('overview')
  const fileInputRef = useRef(null)
  const editFileRef = useRef(null)

  // ── State produits ───────────────────────────────────────
  const [produits, setProduits] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(FORM_VIDE)
  const [imagePreview, setImagePreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [searchProd, setSearchProd] = useState('')

  // ── State edit produit ───────────────────────────────────
  const [editingProduit, setEditingProduit] = useState(null) // produit en cours d'édition
  const [editForm, setEditForm] = useState(null)
  const [editPreview, setEditPreview] = useState(null)

  // ── State users ──────────────────────────────────────────
  const [users, setUsers] = useState([])
  const [searchUser, setSearchUser] = useState('')
  const [filterStatut, setFilterStatut] = useState('TOUS')

  // ── Chargement initial ───────────────────────────────────
  useEffect(() => {
    setProduits(JSON.parse(localStorage.getItem('assigame_produits') || '[]'))
    setUsers(JSON.parse(localStorage.getItem('assigame_users') || '[]'))
  }, [])

  // ── Sauvegarde users dans localStorage ───────────────────
  const saveUsers = (updated) => {
    setUsers(updated)
    localStorage.setItem('assigame_users', JSON.stringify(updated))
  }

  // ── Sauvegarde produits dans localStorage ────────────────
  const saveProduits = (updated) => {
    setProduits(updated)
    localStorage.setItem('assigame_produits', JSON.stringify(updated))
  }

  // ── Image upload (ajout) ─────────────────────────────────
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
      setForm(f => ({ ...f, image: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  // ── Image upload (édition) ───────────────────────────────
  const handleEditImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setEditPreview(reader.result)
      setEditForm(f => ({ ...f, image: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  // ── Ajouter produit ──────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.nom || !form.prix) return
    setSaving(true)
    await new Promise(r => setTimeout(r, 300))
    const nouveau = {
      id: Date.now(),
      nom: form.nom.trim(),
      description: form.description.trim(),
      prix: parseFloat(form.prix),
      categorie: form.categorie,
      image: form.image || '',
      stock: parseInt(form.stock) || 0,
    }
    saveProduits([...produits, nouveau])
    setForm(FORM_VIDE)
    setImagePreview(null)
    setShowForm(false)
    setSaving(false)
  }

  // ── Modifier produit ─────────────────────────────────────
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    await new Promise(r => setTimeout(r, 300))
    const updated = produits.map(p =>
      p.id === editingProduit.id
        ? { ...p, ...editForm, prix: parseFloat(editForm.prix), stock: parseInt(editForm.stock) || 0 }
        : p
    )
    saveProduits(updated)
    setEditingProduit(null)
    setEditForm(null)
    setEditPreview(null)
    setSaving(false)
  }

  // ── Supprimer produit ────────────────────────────────────
  const supprimerProduit = (id) => {
    saveProduits(produits.filter(p => p.id !== id))
    setDeleteConfirm(null)
  }

  // ── Bloquer / Débloquer user ─────────────────────────────
  const toggleUserStatut = (id) => {
    const updated = users.map(u =>
      u.id_utilisateur === id
        ? { ...u, statut: u.statut === 'BLOQUE' ? 'ACTIF' : 'BLOQUE' }
        : u
    )
    saveUsers(updated)
  }

  // ── Filtres ──────────────────────────────────────────────
  const filteredProduits = produits.filter(p =>
    p.nom?.toLowerCase().includes(searchProd.toLowerCase())
  )

  const filteredUsers = users.filter(u => {
    const matchSearch = (u.Login + u.Email + u.Nom + u.Prenom)
      .toLowerCase().includes(searchUser.toLowerCase())
    const matchStatut = filterStatut === 'TOUS' || u.statut === filterStatut
    return matchSearch && matchStatut
  })

  // ── Stats ────────────────────────────────────────────────
  const totalStock = produits.reduce((s, p) => s + (parseInt(p.stock) || 0), 0)
  const ruptures = produits.filter(p => (parseInt(p.stock) || 0) === 0).length
  const usersActifs = users.filter(u => u.statut !== 'BLOQUE').length
  const usersBloqués = users.filter(u => u.statut === 'BLOQUE').length

  // ════════════════════════════════════════════════════════
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: C.dark,
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      color: C.white,
    }}>
      <Sidebar active={section} setActive={setSection} />

      {/* ── Contenu principal ── */}
      <main style={{ flex: 1, padding: '2.5rem 2.5rem', overflowY: 'auto', minWidth: 0 }}>

        {/* ════ VUE D'ENSEMBLE ════ */}
        {section === 'overview' && (
          <div>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.7rem', fontWeight: 800, marginBottom: '0.3rem' }}>
              Vue d'ensemble
            </h1>
            <p style={{ color: C.muted, fontSize: '0.88rem', marginBottom: '2rem' }}>
              Résumé de l'activité de la boutique.
            </p>

            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
              {[
                { label: 'Produits', value: produits.length, icon: '📦', color: C.orange, sub: `${ruptures} en rupture` },
                { label: 'Stock total', value: totalStock, icon: '🗄️', color: C.info, sub: 'unités disponibles' },
                { label: 'Utilisateurs', value: users.length, icon: '👥', color: C.success, sub: `${usersActifs} actifs` },
                { label: 'Comptes bloqués', value: usersBloqués, icon: '🔒', color: C.danger, sub: 'accès suspendu' },
              ].map(s => (
                <div key={s.label} style={{ ...card, position: 'relative', overflow: 'hidden' }}>
                  <div style={{
                    position: 'absolute', top: '-10px', right: '-10px',
                    fontSize: '3.5rem', opacity: 0.06,
                  }}>{s.icon}</div>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{s.icon}</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ color: C.white, fontWeight: 600, fontSize: '0.88rem', marginTop: '0.2rem' }}>{s.label}</div>
                  <div style={{ color: C.muted, fontSize: '0.75rem', marginTop: '0.15rem' }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Alertes */}
            {(ruptures > 0 || usersBloqués > 0) && (
              <div style={{ ...card, marginBottom: '2rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: '0.88rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
                  ⚠️ Alertes
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {ruptures > 0 && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '0.75rem 1rem', background: '#450a0a',
                      borderRadius: '8px', fontSize: '0.85rem',
                    }}>
                      <span>🔴</span>
                      <span><strong>{ruptures} produit{ruptures > 1 ? 's' : ''}</strong> en rupture de stock</span>
                      <button
                        onClick={() => setSection('produits')}
                        style={{ marginLeft: 'auto', background: 'none', border: 'none', color: C.orange, cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', fontFamily: 'inherit' }}
                      >
                        Voir →
                      </button>
                    </div>
                  )}
                  {usersBloqués > 0 && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '0.75rem 1rem', background: '#1e1b4b',
                      borderRadius: '8px', fontSize: '0.85rem',
                    }}>
                      <span>🔒</span>
                      <span><strong>{usersBloqués} compte{usersBloqués > 1 ? 's' : ''}</strong> bloqué{usersBloqués > 1 ? 's' : ''}</span>
                      <button
                        onClick={() => setSection('users')}
                        style={{ marginLeft: 'auto', background: 'none', border: 'none', color: C.orange, cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', fontFamily: 'inherit' }}
                      >
                        Voir →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Aperçu produits récents */}
            <div style={card}>
              <h3 style={{ fontWeight: 700, fontSize: '0.88rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
                Derniers produits ajoutés
              </h3>
              {produits.length === 0 ? (
                <p style={{ color: C.muted, fontSize: '0.85rem' }}>Aucun produit pour l'instant.</p>
              ) : (
                [...produits].reverse().slice(0, 4).map(p => (
                  <div key={p.id} style={{
                    display: 'flex', alignItems: 'center', gap: '0.9rem',
                    padding: '0.65rem 0', borderBottom: `1px solid ${C.darkBorder}`,
                  }}>
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '8px',
                      background: C.dark, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, overflow: 'hidden',
                    }}>
                      {p.image
                        ? <img src={p.image} alt={p.nom} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <span>🎮</span>
                      }
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.nom}</div>
                      <div style={{ color: C.muted, fontSize: '0.75rem' }}>{p.categorie}</div>
                    </div>
                    <StockBadge stock={p.stock} />
                    <div style={{ color: C.orange, fontWeight: 700, fontSize: '0.88rem', flexShrink: 0 }}>
                      {Number(p.prix).toLocaleString('fr-FR')} F
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ════ PRODUITS ════ */}
        {section === 'produits' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.7rem', fontWeight: 800, marginBottom: '0.3rem' }}>
                  Produits
                </h1>
                <p style={{ color: C.muted, fontSize: '0.88rem' }}>
                  {produits.length} produit{produits.length > 1 ? 's' : ''} · {totalStock} unités en stock
                </p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  background: C.orange, color: C.white, border: 'none',
                  padding: '0.7rem 1.3rem', borderRadius: '10px',
                  fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                + Ajouter un produit
              </button>
            </div>

            {/* Barre de recherche */}
            <div style={{ position: 'relative', marginBottom: '1.25rem', maxWidth: '300px' }}>
              <svg style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: C.muted }}
                width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchProd}
                onChange={e => setSearchProd(e.target.value)}
                style={{ ...inputStyle, paddingLeft: '2.2rem' }}
              />
            </div>

            {/* Table produits */}
            <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
              {/* En-têtes */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '56px 1fr 130px 110px 110px 120px',
                padding: '0.75rem 1.25rem',
                background: '#0F0F14',
                borderBottom: `1px solid ${C.darkBorder}`,
                fontSize: '0.72rem', fontWeight: 700,
                color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                <span>Image</span>
                <span>Produit</span>
                <span>Catégorie</span>
                <span>Prix</span>
                <span>Stock</span>
                <span style={{ textAlign: 'right' }}>Actions</span>
              </div>

              {filteredProduits.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: C.muted }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📭</div>
                  <p>Aucun produit.</p>
                </div>
              ) : (
                filteredProduits.map((p, i) => (
                  <div
                    key={p.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '56px 1fr 130px 110px 110px 120px',
                      padding: '0.9rem 1.25rem',
                      alignItems: 'center',
                      borderBottom: i < filteredProduits.length - 1 ? `1px solid ${C.darkBorder}` : 'none',
                      transition: 'background 0.12s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#ffffff08'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Image */}
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '8px',
                      overflow: 'hidden', background: C.dark,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {p.image
                        ? <img src={p.image} alt={p.nom} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <span style={{ fontSize: '1.1rem' }}>🎮</span>
                      }
                    </div>

                    {/* Nom */}
                    <div style={{ paddingLeft: '0.75rem' }}>
                      <p style={{ fontWeight: 600, fontSize: '0.88rem' }}>{p.nom}</p>
                      <p style={{ color: C.muted, fontSize: '0.75rem', marginTop: '0.1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '280px' }}>
                        {p.description || '—'}
                      </p>
                    </div>

                    {/* Catégorie */}
                    <span style={{
                      display: 'inline-block', padding: '0.2rem 0.6rem',
                      borderRadius: '20px', fontSize: '0.74rem', fontWeight: 600,
                      background: '#ffffff12', color: C.muted,
                    }}>
                      {p.categorie}
                    </span>

                    {/* Prix */}
                    <span style={{ fontWeight: 700, color: C.orange, fontSize: '0.9rem' }}>
                      {Number(p.prix).toLocaleString('fr-FR')} F
                    </span>

                    {/* Stock */}
                    <StockBadge stock={p.stock} />

                    {/* Actions */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                      {deleteConfirm === p.id ? (
                        <>
                          <button
                            onClick={() => supprimerProduit(p.id)}
                            style={{ padding: '0.3rem 0.6rem', background: C.danger, color: C.white, border: 'none', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                          >
                            Oui
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            style={{ padding: '0.3rem 0.6rem', background: C.darkBorder, color: C.muted, border: 'none', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}
                          >
                            Non
                          </button>
                        </>
                      ) : (
                        <>
                          {/* Bouton modifier */}
                          <button
                            onClick={() => {
                              setEditingProduit(p)
                              setEditForm({ nom: p.nom, description: p.description || '', prix: String(p.prix), categorie: p.categorie, image: p.image || '', stock: String(p.stock || 0) })
                              setEditPreview(p.image || null)
                            }}
                            title="Modifier"
                            style={{ background: 'transparent', border: `1px solid ${C.darkBorder}`, color: C.info, padding: '0.3rem 0.5rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                          >
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          {/* Bouton supprimer */}
                          <button
                            onClick={() => setDeleteConfirm(p.id)}
                            title="Supprimer"
                            style={{ background: 'transparent', border: `1px solid ${C.darkBorder}`, color: C.danger, padding: '0.3rem 0.5rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                          >
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <polyline points="3,6 5,6 21,6" /><path d="M19,6l-1,14H6L5,6" /><path d="M10,11v6M14,11v6" /><path d="M9,6V4h6v2" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ════ UTILISATEURS ════ */}
        {section === 'users' && (
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.7rem', fontWeight: 800, marginBottom: '0.3rem' }}>
                Utilisateurs
              </h1>
              <p style={{ color: C.muted, fontSize: '0.88rem' }}>
                {users.length} compte{users.length > 1 ? 's' : ''} enregistré{users.length > 1 ? 's' : ''}
                &nbsp;·&nbsp;{usersActifs} actif{usersActifs > 1 ? 's' : ''}
                &nbsp;·&nbsp;{usersBloqués} bloqué{usersBloqués > 1 ? 's' : ''}
              </p>
            </div>

            {/* Filtres */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, maxWidth: '280px' }}>
                <svg style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: C.muted }}
                  width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Rechercher un utilisateur..."
                  value={searchUser}
                  onChange={e => setSearchUser(e.target.value)}
                  style={{ ...inputStyle, paddingLeft: '2.2rem' }}
                />
              </div>
              {['TOUS', 'ACTIF', 'BLOQUE'].map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatut(s)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    border: `1px solid ${filterStatut === s ? C.orange : C.darkBorder}`,
                    background: filterStatut === s ? `${C.orange}18` : 'transparent',
                    color: filterStatut === s ? C.orange : C.muted,
                    fontWeight: 600, fontSize: '0.8rem',
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  {s === 'TOUS' ? 'Tous' : s === 'ACTIF' ? 'Actifs' : 'Bloqués'}
                </button>
              ))}
            </div>

            {/* Table users */}
            <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
              {/* En-têtes */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 120px 120px 100px',
                padding: '0.75rem 1.25rem',
                background: '#0F0F14',
                borderBottom: `1px solid ${C.darkBorder}`,
                fontSize: '0.72rem', fontWeight: 700,
                color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                <span>Utilisateur</span>
                <span>Email</span>
                <span>Pseudo</span>
                <span>Statut</span>
                <span style={{ textAlign: 'right' }}>Action</span>
              </div>

              {filteredUsers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: C.muted }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>👤</div>
                  <p>Aucun utilisateur trouvé.</p>
                </div>
              ) : (
                filteredUsers.map((u, i) => (
                  <div
                    key={u.id_utilisateur}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 120px 120px 100px',
                      padding: '0.9rem 1.25rem',
                      alignItems: 'center',
                      borderBottom: i < filteredUsers.length - 1 ? `1px solid ${C.darkBorder}` : 'none',
                      transition: 'background 0.12s',
                      opacity: u.statut === 'BLOQUE' ? 0.65 : 1,
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#ffffff08'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Nom */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        background: `${C.orange}22`, display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.85rem', fontWeight: 700, color: C.orange, flexShrink: 0,
                      }}>
                        {(u.Prenom || u.Login || '?')[0].toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>
                          {u.Prenom} {u.Nom}
                        </div>
                        {u.telephone && (
                          <div style={{ color: C.muted, fontSize: '0.73rem' }}>{u.telephone}</div>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <span style={{ color: C.muted, fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {u.Email}
                    </span>

                    {/* Pseudo */}
                    <span style={{
                      display: 'inline-block', padding: '0.2rem 0.6rem',
                      borderRadius: '20px', background: '#ffffff12',
                      fontSize: '0.75rem', fontWeight: 600, color: C.muted,
                    }}>
                      @{u.Login}
                    </span>

                    {/* Statut */}
                    <StatusBadge statut={u.statut || 'ACTIF'} />

                    {/* Action bloquer / débloquer */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => toggleUserStatut(u.id_utilisateur)}
                        style={{
                          padding: '0.35rem 0.75rem',
                          borderRadius: '6px',
                          border: `1px solid ${u.statut === 'BLOQUE' ? C.success : C.danger}`,
                          background: 'transparent',
                          color: u.statut === 'BLOQUE' ? C.success : C.danger,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          transition: 'all 0.15s',
                        }}
                      >
                        {u.statut === 'BLOQUE' ? '✓ Débloquer' : '✕ Bloquer'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* ════ MODAL AJOUTER PRODUIT ════ */}
      {showForm && (
        <Modal title="Nouveau produit" onClose={() => { setShowForm(false); setForm(FORM_VIDE); setImagePreview(null) }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Nom *</label>
              <input type="text" placeholder="Ex: PlayStation 5 Pro" value={form.nom}
                onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Description</label>
              <textarea placeholder="Décrivez le produit..." value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={3} style={{ ...inputStyle, resize: 'vertical', minHeight: '75px' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={labelStyle}>Prix (FCFA) *</label>
                <input type="number" placeholder="25000" value={form.prix} min="0"
                  onChange={e => setForm(f => ({ ...f, prix: e.target.value }))} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Stock</label>
                <input type="number" placeholder="0" value={form.stock} min="0"
                  onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Catégorie</label>
                <select value={form.categorie} onChange={e => setForm(f => ({ ...f, categorie: e.target.value }))}
                  style={{ ...inputStyle, cursor: 'pointer' }}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Image</label>
              <div onClick={() => fileInputRef.current.click()} style={{
                border: `2px dashed ${C.darkBorder}`, borderRadius: '10px',
                padding: '1.25rem', textAlign: 'center', cursor: 'pointer',
                background: C.dark, transition: 'border-color 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.orange}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.darkBorder}
              >
                {imagePreview
                  ? <img src={imagePreview} alt="preview" style={{ maxHeight: '120px', borderRadius: '8px', objectFit: 'cover' }} />
                  : <><div style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>📁</div>
                    <p style={{ color: C.muted, fontSize: '0.82rem' }}>Cliquer pour sélectionner</p></>
                }
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
              <button type="button" onClick={() => { setShowForm(false); setForm(FORM_VIDE); setImagePreview(null) }}
                style={{ flex: 1, padding: '0.75rem', background: C.darkBorder, border: 'none', borderRadius: '8px', fontWeight: 600, color: C.muted, cursor: 'pointer', fontFamily: 'inherit' }}>
                Annuler
              </button>
              <button type="submit" disabled={saving}
                style={{ flex: 2, padding: '0.75rem', background: C.orange, border: 'none', borderRadius: '8px', fontWeight: 700, color: C.white, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, fontFamily: 'inherit' }}>
                {saving ? 'Enregistrement...' : '✓ Ajouter'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ════ MODAL MODIFIER PRODUIT ════ */}
      {editingProduit && editForm && (
        <Modal title="Modifier le produit" onClose={() => { setEditingProduit(null); setEditForm(null); setEditPreview(null) }}>
          <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Nom *</label>
              <input type="text" value={editForm.nom}
                onChange={e => setEditForm(f => ({ ...f, nom: e.target.value }))} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Description</label>
              <textarea value={editForm.description}
                onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                rows={3} style={{ ...inputStyle, resize: 'vertical', minHeight: '75px' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={labelStyle}>Prix (FCFA) *</label>
                <input type="number" value={editForm.prix} min="0"
                  onChange={e => setEditForm(f => ({ ...f, prix: e.target.value }))} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Stock</label>
                <input type="number" value={editForm.stock} min="0"
                  onChange={e => setEditForm(f => ({ ...f, stock: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Catégorie</label>
                <select value={editForm.categorie} onChange={e => setEditForm(f => ({ ...f, categorie: e.target.value }))}
                  style={{ ...inputStyle, cursor: 'pointer' }}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Image</label>
              <div onClick={() => editFileRef.current.click()} style={{
                border: `2px dashed ${C.darkBorder}`, borderRadius: '10px',
                padding: '1.25rem', textAlign: 'center', cursor: 'pointer', background: C.dark,
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.orange}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.darkBorder}
              >
                {editPreview
                  ? <img src={editPreview} alt="preview" style={{ maxHeight: '120px', borderRadius: '8px', objectFit: 'cover' }} />
                  : <><div style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>📁</div>
                    <p style={{ color: C.muted, fontSize: '0.82rem' }}>Changer l'image</p></>
                }
              </div>
              <input ref={editFileRef} type="file" accept="image/*" onChange={handleEditImageChange} style={{ display: 'none' }} />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
              <button type="button" onClick={() => { setEditingProduit(null); setEditForm(null); setEditPreview(null) }}
                style={{ flex: 1, padding: '0.75rem', background: C.darkBorder, border: 'none', borderRadius: '8px', fontWeight: 600, color: C.muted, cursor: 'pointer', fontFamily: 'inherit' }}>
                Annuler
              </button>
              <button type="submit" disabled={saving}
                style={{ flex: 2, padding: '0.75rem', background: C.info, border: 'none', borderRadius: '8px', fontWeight: 700, color: C.white, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, fontFamily: 'inherit' }}>
                {saving ? 'Enregistrement...' : '✓ Sauvegarder'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

// ─── Composant Modal réutilisable ─────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.65)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 300, padding: '1rem',
    }}>
      <div style={{
        background: '#1A1A24',
        border: '1px solid #2A2A38',
        borderRadius: '18px',
        padding: '2rem',
        width: '100%', maxWidth: '520px',
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.2rem', color: '#FFFFFF' }}>
            {title}
          </h2>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: '#8B8BA0',
            fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1,
          }}>×</button>
        </div>
        {children}
      </div>
    </div>
  )
}