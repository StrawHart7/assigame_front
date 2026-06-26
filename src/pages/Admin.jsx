// PAGE : Admin
// ENDPOINTS RÉELS UTILISÉS :
//   GET    /api/produit/list
//   POST   /api/produit/add
//   PUT    /api/produit/update/{id}
//   DELETE /api/produit/delete/{id}
//   GET    /api/utilisateur/list
//   PUT    /api/utilisateur/update/{id}  ← pour bloquer/débloquer

import { useState, useEffect, useRef } from 'react'
import api from '../api/axios'

// ─── Helpers ────────────────────────────────────────────────

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload  = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

const formatPrix = (prix) =>
  prix != null ? Number(prix).toLocaleString('fr-FR') + ' FCFA' : '—'

// ─── Palette ────────────────────────────────────────────────
const C = {
  orange: '#F5A623', orangeLight: '#FFF7E6',
  dark: '#0F0F14', darkCard: '#1A1A24', darkBorder: '#2A2A38',
  white: '#FFFFFF', muted: '#8B8BA0',
  success: '#22C55E', danger: '#EF4444', info: '#6366F1', warn: '#F59E0B',
}

const card = {
  background: C.darkCard, border: `1px solid ${C.darkBorder}`,
  borderRadius: '14px', padding: '1.4rem',
}

const labelStyle = {
  display: 'block', fontSize: '0.78rem', fontWeight: 700,
  color: C.muted, marginBottom: '0.4rem',
  textTransform: 'uppercase', letterSpacing: '0.06em',
}

const inputStyle = {
  width: '100%', padding: '0.7rem 0.9rem',
  background: '#0F0F14', border: `1px solid ${C.darkBorder}`,
  borderRadius: '8px', fontSize: '0.9rem', color: C.white,
  outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
}

// ─── Badges ─────────────────────────────────────────────────

function StatusBadge({ statut }) {
  const s = statut?.toLowerCase()
  const cfg = s === 'actif'
    ? { bg: '#14532d', color: C.success, label: 'Actif' }
    : s === 'inactif' || s === 'bloqué' || s === 'bloque'
    ? { bg: '#450a0a', color: C.danger, label: 'Bloqué' }
    : { bg: '#1e1b4b', color: C.info, label: statut }
  return (
    <span style={{ display: 'inline-block', padding: '0.2rem 0.65rem', borderRadius: '20px', fontSize: '0.74rem', fontWeight: 700, background: cfg.bg, color: cfg.color }}>
      {cfg.label}
    </span>
  )
}

// ─── Sidebar ─────────────────────────────────────────────────

function Sidebar({ active, setActive }) {
  const items = [
    { key: 'overview', icon: '▦', label: "Vue d'ensemble" },
    { key: 'produits', icon: '⊞', label: 'Produits' },
    { key: 'users',    icon: '⊙', label: 'Utilisateurs' },
  ]
  return (
    <aside style={{ width: '220px', minHeight: '100vh', background: C.darkCard, borderRight: `1px solid ${C.darkBorder}`, display: 'flex', flexDirection: 'column', padding: '2rem 0', flexShrink: 0 }}>
      <div style={{ padding: '0 1.5rem 2rem' }}>
        <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.3rem', fontWeight: 800, color: C.white }}>
          Assi<span style={{ color: C.orange }}>game</span>
        </span>
        <div style={{ fontSize: '0.7rem', color: C.muted, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.2rem' }}>
          Admin Panel
        </div>
      </div>
      <nav style={{ flex: 1 }}>
        {items.map(item => (
          <button key={item.key} onClick={() => setActive(item.key)} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.8rem 1.5rem', background: active === item.key ? `${C.orange}18` : 'transparent',
            border: 'none', borderLeft: active === item.key ? `3px solid ${C.orange}` : '3px solid transparent',
            color: active === item.key ? C.orange : C.muted,
            fontSize: '0.88rem', fontWeight: active === item.key ? 700 : 500,
            cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'all 0.15s',
          }}>
            <span style={{ fontSize: '1rem' }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <div style={{ padding: '1.5rem', borderTop: `1px solid ${C.darkBorder}` }}>
        <div style={{ fontSize: '0.75rem', color: C.muted }}>Connecté en tant que</div>
        <div style={{ fontSize: '0.85rem', color: C.white, fontWeight: 600, marginTop: '0.2rem' }}>Administrateur</div>
      </div>
    </aside>
  )
}

// ─── Toast ───────────────────────────────────────────────────

function Toast({ message, type }) {
  return (
    <div style={{
      position: 'fixed', top: '80px', right: '2rem', zIndex: 9999,
      padding: '0.85rem 1.25rem', borderRadius: '10px', fontWeight: 600,
      fontSize: '0.88rem', boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
      background: type === 'error' ? '#450a0a' : '#14532d',
      color: type === 'error' ? C.danger : C.success,
      border: `1px solid ${type === 'error' ? C.danger : C.success}40`,
      maxWidth: '300px',
    }}>
      {type === 'error' ? '✕ ' : '✓ '}{message}
    </div>
  )
}

// ─── Modal générique ─────────────────────────────────────────

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, padding: '1rem' }}>
      <div style={{ background: '#1A1A24', border: '1px solid #2A2A38', borderRadius: '18px', padding: '2rem', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 60px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.2rem', color: C.white }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.muted, fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════
export default function Admin() {
  const [section, setSection] = useState('overview')
  const fileInputRef  = useRef(null)
  const editFileRef   = useRef(null)

  // ── State global ─────────────────────────────────────────
  const [produits, setProduits] = useState([])
  const [users, setUsers]       = useState([])
  const [categories, setCategories] = useState([])
  const [loadingProd, setLoadingProd] = useState(true)
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [toast, setToast]       = useState(null)
  const toastTimer = useRef(null)

  // ── State formulaire ajout ────────────────────────────────
  const FORM_VIDE = { nom_produit: '', description: '', prix: '', categorieId: '', image: '' }
  const [showForm, setShowForm]       = useState(false)
  const [form, setForm]               = useState(FORM_VIDE)
  const [imagePreview, setImagePreview] = useState(null)
  const [saving, setSaving]           = useState(false)

  // ── State formulaire édition ──────────────────────────────
  const [editingProduit, setEditingProduit] = useState(null)
  const [editForm, setEditForm]             = useState(null)
  const [editPreview, setEditPreview]       = useState(null)

  // ── State suppression ─────────────────────────────────────
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  // ── State recherche ───────────────────────────────────────
  const [searchProd, setSearchProd]   = useState('')
  const [searchUser, setSearchUser]   = useState('')
  const [filterStatut, setFilterStatut] = useState('TOUS')

  // ── Toast helper ──────────────────────────────────────────
  const showToast = (message, type = 'success') => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast({ message, type })
    toastTimer.current = setTimeout(() => setToast(null), 3500)
  }

  // ════════════════════════════════════════════════════════
  // CHARGEMENT DONNÉES RÉELLES DEPUIS LA BDD
  // ════════════════════════════════════════════════════════

  useEffect(() => {
    chargerProduits()
    chargerUsers()
    chargerCategories()
  }, [])

  const chargerProduits = () => {
    setLoadingProd(true)
    api.get('/produit/list')
      .then(res => setProduits(res.data))
      .catch(() => showToast('Erreur chargement produits.', 'error'))
      .finally(() => setLoadingProd(false))
  }

  const chargerUsers = () => {
    setLoadingUsers(true)
    api.get('/utilisateur/list')
      .then(res => setUsers(res.data))
      .catch(() => showToast('Erreur chargement utilisateurs.', 'error'))
      .finally(() => setLoadingUsers(false))
  }

  const chargerCategories = () => {
    api.get('/categorieproduit/list')
      .then(res => setCategories(res.data))
      .catch(() => {})
  }

  // ════════════════════════════════════════════════════════
  // CRUD PRODUITS — appels API réels
  // ════════════════════════════════════════════════════════

  // Ajout produit → POST /api/produit/add
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.nom_produit || !form.prix || !form.categorieId) {
      showToast('Nom, prix et catégorie sont requis.', 'error')
      return
    }
    setSaving(true)
    try {
      const payload = {
        nom_produit:      form.nom_produit.trim(),
        description:      form.description.trim() || null,
        prix:             Number(form.prix),
        image:            form.image || null,       // base64
        statut:           'disponible',
        categorieProduit: { idcategorie_produit: Number(form.categorieId) },
        utilisateur:      { id_utilisateur: 1 },   // utilisateur admin hardcodé (auth fictive)
      }
      const res = await api.post('/produit/add', payload)
      setProduits(prev => [res.data, ...prev])
      setForm(FORM_VIDE)
      setImagePreview(null)
      setShowForm(false)
      showToast(`"${res.data.nom_produit}" ajouté avec succès.`)
    } catch {
      showToast("Erreur lors de l'ajout.", 'error')
    } finally {
      setSaving(false)
    }
  }

  // Modification produit → PUT /api/produit/update/{id}
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        nom_produit:      editForm.nom_produit.trim(),
        description:      editForm.description.trim() || null,
        prix:             Number(editForm.prix),
        image:            editForm.image || null,
        statut:           editingProduit.statut,
        categorieProduit: editForm.categorieId
          ? { idcategorie_produit: Number(editForm.categorieId) }
          : editingProduit.categorieProduit
            ? { idcategorie_produit: editingProduit.categorieProduit.idcategorie_produit }
            : null,
        utilisateur: { id_utilisateur: 1 },
      }
      const res = await api.put(`/produit/update/${editingProduit.id_produit}`, payload)
      setProduits(prev => prev.map(p =>
        p.id_produit === editingProduit.id_produit ? res.data : p
      ))
      setEditingProduit(null)
      setEditForm(null)
      setEditPreview(null)
      showToast('Produit mis à jour.')
    } catch {
      showToast('Erreur lors de la modification.', 'error')
    } finally {
      setSaving(false)
    }
  }

  // Suppression → DELETE /api/produit/delete/{id}
  const supprimerProduit = async (id) => {
    try {
      await api.delete(`/produit/delete/${id}`)
      setProduits(prev => prev.filter(p => p.id_produit !== id))
      showToast('Produit supprimé.')
    } catch {
      showToast('Erreur lors de la suppression.', 'error')
    } finally {
      setDeleteConfirm(null)
    }
  }

  // Changement statut produit → PUT /api/produit/update/{id}
  const changerStatutProduit = async (produit, nouveauStatut) => {
    try {
      const payload = {
        nom_produit:      produit.nom_produit,
        description:      produit.description,
        prix:             produit.prix,
        image:            produit.image,
        statut:           nouveauStatut,
        categorieProduit: produit.categorieProduit
          ? { idcategorie_produit: produit.categorieProduit.idcategorie_produit }
          : null,
        utilisateur: { id_utilisateur: 1 },
      }
      await api.put(`/produit/update/${produit.id_produit}`, payload)
      setProduits(prev => prev.map(p =>
        p.id_produit === produit.id_produit ? { ...p, statut: nouveauStatut } : p
      ))
      showToast(`Statut : ${nouveauStatut}`)
    } catch {
      showToast('Erreur mise à jour statut.', 'error')
    }
  }

  // ════════════════════════════════════════════════════════
  // CRUD UTILISATEURS — appels API réels
  // ════════════════════════════════════════════════════════

  // Bloquer/débloquer → PUT /api/utilisateur/update/{id}
  // On bascule le champ `statut` entre 'actif' et 'inactif'
  const toggleUserStatut = async (utilisateur) => {
    const nouveauStatut = utilisateur.statut?.toLowerCase() === 'actif' ? 'inactif' : 'actif'
    try {
      const payload = { ...utilisateur, statut: nouveauStatut }
      await api.put(`/utilisateur/update/${utilisateur.id_utilisateur}`, payload)
      setUsers(prev => prev.map(u =>
        u.id_utilisateur === utilisateur.id_utilisateur ? { ...u, statut: nouveauStatut } : u
      ))
      showToast(`Utilisateur ${nouveauStatut === 'actif' ? 'débloqué' : 'bloqué'}.`)
    } catch {
      showToast('Erreur mise à jour utilisateur.', 'error')
    }
  }

  // ── Upload image ──────────────────────────────────────────

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImagePreview(URL.createObjectURL(file))
    try {
      const b64 = await fileToBase64(file)
      setForm(f => ({ ...f, image: b64 }))
    } catch { showToast("Impossible de lire l'image.", 'error') }
  }

  const handleEditImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setEditPreview(URL.createObjectURL(file))
    try {
      const b64 = await fileToBase64(file)
      setEditForm(f => ({ ...f, image: b64 }))
    } catch { showToast("Impossible de lire l'image.", 'error') }
  }

  // ── Stats dérivées (calculées depuis vraie BDD) ───────────

  const stats = {
    totalProduits:  produits.length,
    disponibles:    produits.filter(p => p.statut?.toLowerCase() === 'disponible').length,
    vendus:         produits.filter(p => p.statut?.toLowerCase() === 'vendu').length,
    reserves:       produits.filter(p => ['réservé','reservé'].includes(p.statut?.toLowerCase())).length,
    valeurStock:    produits.filter(p => p.statut?.toLowerCase() === 'disponible').reduce((a, p) => a + (p.prix || 0), 0),
    totalUsers:     users.length,
    usersActifs:    users.filter(u => u.statut?.toLowerCase() === 'actif').length,
    usersInactifs:  users.filter(u => u.statut?.toLowerCase() !== 'actif').length,
  }

  // ── Filtres ───────────────────────────────────────────────

  const filteredProduits = produits.filter(p =>
    p.nom_produit?.toLowerCase().includes(searchProd.toLowerCase()) ||
    p.categorieProduit?.nom_categorieproduit?.toLowerCase().includes(searchProd.toLowerCase())
  )

  const filteredUsers = users.filter(u => {
    const txt = `${u.login || ''} ${u.email || ''} ${u.nom || ''} ${u.prenom || ''}`.toLowerCase()
    const matchSearch = txt.includes(searchUser.toLowerCase())
    const matchStatut =
      filterStatut === 'TOUS' ||
      (filterStatut === 'ACTIF'   && u.statut?.toLowerCase() === 'actif') ||
      (filterStatut === 'INACTIF' && u.statut?.toLowerCase() !== 'actif')
    return matchSearch && matchStatut
  })

  // ════════════════════════════════════════════════════════
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: C.dark, fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif', color: C.white }}>
      <Sidebar active={section} setActive={setSection} />

      {toast && <Toast message={toast.message} type={toast.type} />}

      <main style={{ flex: 1, padding: '2.5rem', overflowY: 'auto', minWidth: 0 }}>

        {/* ════ VUE D'ENSEMBLE ════ */}
        {section === 'overview' && (
          <div>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.7rem', fontWeight: 800, marginBottom: '0.3rem' }}>
              Vue d'ensemble
            </h1>
            <p style={{ color: C.muted, fontSize: '0.88rem', marginBottom: '2rem' }}>
              Données en temps réel depuis la base de données.
            </p>

            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
              {[
                { label: 'Total produits',   value: stats.totalProduits,  icon: '📦', color: C.orange,  sub: `dont ${stats.disponibles} disponibles` },
                { label: 'Vendus',           value: stats.vendus,         icon: '🏷',  color: C.success, sub: `${stats.reserves} réservés` },
                { label: 'Valeur en stock',  value: formatPrix(stats.valeurStock), icon: '💰', color: C.info, sub: 'produits disponibles' },
                { label: 'Utilisateurs',     value: stats.totalUsers,     icon: '👥', color: C.warn,    sub: `${stats.usersActifs} actifs` },
              ].map(s => (
                <div key={s.label} style={{ ...card, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '3.5rem', opacity: 0.06 }}>{s.icon}</div>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{s.icon}</div>
                  <div style={{ fontSize: s.label === 'Valeur en stock' ? '1.1rem' : '2rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ color: C.white, fontWeight: 600, fontSize: '0.88rem', marginTop: '0.2rem' }}>{s.label}</div>
                  <div style={{ color: C.muted, fontSize: '0.75rem', marginTop: '0.15rem' }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Derniers produits ajoutés */}
            <div style={card}>
              <h3 style={{ fontWeight: 700, fontSize: '0.88rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
                Derniers produits ajoutés
              </h3>
              {loadingProd ? (
                <p style={{ color: C.muted, fontSize: '0.85rem' }}>Chargement...</p>
              ) : produits.length === 0 ? (
                <p style={{ color: C.muted, fontSize: '0.85rem' }}>Aucun produit.</p>
              ) : (
                [...produits]
                  .sort((a, b) => (b.id_produit || 0) - (a.id_produit || 0))
                  .slice(0, 5)
                  .map(p => <LigneApercu key={p.id_produit} produit={p} />)
              )}
            </div>
          </div>
        )}

        {/* ════ PRODUITS ════ */}
        {section === 'produits' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.7rem', fontWeight: 800, marginBottom: '0.3rem' }}>Produits</h1>
                <p style={{ color: C.muted, fontSize: '0.88rem' }}>
                  {produits.length} produit{produits.length > 1 ? 's' : ''} en base de données
                </p>
              </div>
              <button onClick={() => setShowForm(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: C.orange, color: C.white, border: 'none', padding: '0.7rem 1.3rem', borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                + Ajouter un produit
              </button>
            </div>

            {/* Recherche */}
            <div style={{ position: 'relative', marginBottom: '1.25rem', maxWidth: '300px' }}>
              <span style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: C.muted }}>🔍</span>
              <input type="text" placeholder="Rechercher..." value={searchProd} onChange={e => setSearchProd(e.target.value)}
                style={{ ...inputStyle, paddingLeft: '2.2rem' }} />
            </div>

            {/* Tableau */}
            <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
              {/* Header */}
              <div style={{ display: 'grid', gridTemplateColumns: '56px 1fr 150px 130px 140px 130px', padding: '0.75rem 1.25rem', background: '#0F0F14', borderBottom: `1px solid ${C.darkBorder}`, fontSize: '0.72rem', fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <span>Image</span><span>Produit</span><span>Catégorie</span><span>Prix</span><span>Statut</span><span style={{ textAlign: 'right' }}>Actions</span>
              </div>

              {loadingProd ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: C.muted }}>Chargement depuis la BDD...</div>
              ) : filteredProduits.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: C.muted }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📭</div>
                  <p>Aucun produit trouvé.</p>
                </div>
              ) : (
                filteredProduits.map((p, i) => (
                  <LigneProduit
                    key={p.id_produit}
                    produit={p}
                    pair={i % 2 === 0}
                    deleteConfirm={deleteConfirm}
                    onDeleteConfirm={() => setDeleteConfirm(p.id_produit)}
                    onDeleteAnnuler={() => setDeleteConfirm(null)}
                    onDeleteConfirmer={() => supprimerProduit(p.id_produit)}
                    onEdit={() => {
                      setEditingProduit(p)
                      setEditForm({
                        nom_produit:  p.nom_produit,
                        description:  p.description || '',
                        prix:         String(p.prix),
                        categorieId:  p.categorieProduit?.idcategorie_produit || '',
                        image:        p.image || '',
                      })
                      setEditPreview(p.image || null)
                    }}
                    onStatut={s => changerStatutProduit(p, s)}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {/* ════ UTILISATEURS ════ */}
        {section === 'users' && (
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.7rem', fontWeight: 800, marginBottom: '0.3rem' }}>Utilisateurs</h1>
              <p style={{ color: C.muted, fontSize: '0.88rem' }}>
                {users.length} compte{users.length > 1 ? 's' : ''} · {stats.usersActifs} actif{stats.usersActifs > 1 ? 's' : ''} · {stats.usersInactifs} inactif{stats.usersInactifs > 1 ? 's' : ''}
              </p>
            </div>

            {/* Filtres */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, maxWidth: '280px' }}>
                <span style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: C.muted }}>🔍</span>
                <input type="text" placeholder="Rechercher un utilisateur..." value={searchUser} onChange={e => setSearchUser(e.target.value)}
                  style={{ ...inputStyle, paddingLeft: '2.2rem' }} />
              </div>
              {['TOUS', 'ACTIF', 'INACTIF'].map(s => (
                <button key={s} onClick={() => setFilterStatut(s)} style={{
                  padding: '0.5rem 1rem', borderRadius: '8px',
                  border: `1px solid ${filterStatut === s ? C.orange : C.darkBorder}`,
                  background: filterStatut === s ? `${C.orange}18` : 'transparent',
                  color: filterStatut === s ? C.orange : C.muted,
                  fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  {s === 'TOUS' ? 'Tous' : s === 'ACTIF' ? 'Actifs' : 'Inactifs'}
                </button>
              ))}
            </div>

            {/* Tableau users */}
            <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 130px 110px 110px', padding: '0.75rem 1.25rem', background: '#0F0F14', borderBottom: `1px solid ${C.darkBorder}`, fontSize: '0.72rem', fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <span>Utilisateur</span><span>Email</span><span>Login</span><span>Statut</span><span style={{ textAlign: 'right' }}>Action</span>
              </div>

              {loadingUsers ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: C.muted }}>Chargement depuis la BDD...</div>
              ) : filteredUsers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: C.muted }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>👤</div>
                  <p>Aucun utilisateur trouvé.</p>
                </div>
              ) : (
                filteredUsers.map((u, i) => (
                  <div key={u.id_utilisateur} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 130px 110px 110px', padding: '0.9rem 1.25rem', alignItems: 'center', borderBottom: i < filteredUsers.length - 1 ? `1px solid ${C.darkBorder}` : 'none', opacity: u.statut?.toLowerCase() !== 'actif' ? 0.65 : 1 }}
                    onMouseEnter={e => e.currentTarget.style.background = '#ffffff08'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Nom */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `${C.orange}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, color: C.orange, flexShrink: 0 }}>
                        {(u.prenom || u.login || '?')[0].toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{u.prenom} {u.nom}</div>
                        {u.telephone && <div style={{ color: C.muted, fontSize: '0.73rem' }}>{u.telephone}</div>}
                      </div>
                    </div>

                    {/* Email */}
                    <span style={{ color: C.muted, fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</span>

                    {/* Login */}
                    <span style={{ display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '20px', background: '#ffffff12', fontSize: '0.75rem', fontWeight: 600, color: C.muted }}>
                      @{u.login}
                    </span>

                    {/* Statut */}
                    <StatusBadge statut={u.statut} />

                    {/* Action */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button onClick={() => toggleUserStatut(u)} style={{
                        padding: '0.35rem 0.75rem', borderRadius: '6px',
                        border: `1px solid ${u.statut?.toLowerCase() !== 'actif' ? C.success : C.danger}`,
                        background: 'transparent',
                        color: u.statut?.toLowerCase() !== 'actif' ? C.success : C.danger,
                        fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                      }}>
                        {u.statut?.toLowerCase() !== 'actif' ? '✓ Débloquer' : '✕ Bloquer'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* ════ MODAL AJOUTER ════ */}
      {showForm && (
        <Modal title="Nouveau produit" onClose={() => { setShowForm(false); setForm(FORM_VIDE); setImagePreview(null) }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Nom *</label>
              <input type="text" placeholder="Ex: PlayStation 5" value={form.nom_produit}
                onChange={e => setForm(f => ({ ...f, nom_produit: e.target.value }))} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Description</label>
              <textarea placeholder="Décrivez le produit..." value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={3} style={{ ...inputStyle, resize: 'vertical', minHeight: '75px' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={labelStyle}>Prix (FCFA) *</label>
                <input type="number" placeholder="25000" value={form.prix} min="0"
                  onChange={e => setForm(f => ({ ...f, prix: e.target.value }))} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Catégorie *</label>
                <select value={form.categorieId} onChange={e => setForm(f => ({ ...f, categorieId: e.target.value }))}
                  required style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="">Choisir...</option>
                  {categories.map(c => (
                    <option key={c.idcategorie_produit} value={c.idcategorie_produit}>
                      {c.nom_categorieproduit}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* Upload image */}
            <div>
              <label style={labelStyle}>Image</label>
              <div onClick={() => fileInputRef.current.click()} style={{ border: `2px dashed ${C.darkBorder}`, borderRadius: '10px', padding: '1.25rem', textAlign: 'center', cursor: 'pointer', background: C.dark }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.orange}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.darkBorder}>
                {imagePreview
                  ? <img src={imagePreview} alt="preview" style={{ maxHeight: '120px', borderRadius: '8px', objectFit: 'cover' }} />
                  : <><div style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>📁</div><p style={{ color: C.muted, fontSize: '0.82rem' }}>Cliquer pour sélectionner</p></>
                }
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
              {imagePreview && (
                <button type="button" onClick={() => { setImagePreview(null); setForm(f => ({ ...f, image: '' })) }}
                  style={{ marginTop: '0.4rem', background: 'none', border: 'none', color: C.danger, cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'inherit' }}>
                  ✕ Supprimer l'image
                </button>
              )}
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

      {/* ════ MODAL MODIFIER ════ */}
      {editingProduit && editForm && (
        <Modal title="Modifier le produit" onClose={() => { setEditingProduit(null); setEditForm(null); setEditPreview(null) }}>
          <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Nom *</label>
              <input type="text" value={editForm.nom_produit}
                onChange={e => setEditForm(f => ({ ...f, nom_produit: e.target.value }))} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Description</label>
              <textarea value={editForm.description}
                onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                rows={3} style={{ ...inputStyle, resize: 'vertical', minHeight: '75px' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={labelStyle}>Prix (FCFA) *</label>
                <input type="number" value={editForm.prix} min="0"
                  onChange={e => setEditForm(f => ({ ...f, prix: e.target.value }))} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Catégorie</label>
                <select value={editForm.categorieId} onChange={e => setEditForm(f => ({ ...f, categorieId: e.target.value }))}
                  style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="">— inchangée —</option>
                  {categories.map(c => (
                    <option key={c.idcategorie_produit} value={c.idcategorie_produit}>
                      {c.nom_categorieproduit}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Image</label>
              <div onClick={() => editFileRef.current.click()} style={{ border: `2px dashed ${C.darkBorder}`, borderRadius: '10px', padding: '1.25rem', textAlign: 'center', cursor: 'pointer', background: C.dark }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.orange}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.darkBorder}>
                {editPreview
                  ? <img src={editPreview} alt="preview" style={{ maxHeight: '120px', borderRadius: '8px', objectFit: 'cover' }} />
                  : <><div style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>📁</div><p style={{ color: C.muted, fontSize: '0.82rem' }}>Changer l'image</p></>
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

// ─── Ligne tableau produits ───────────────────────────────────

function LigneProduit({ produit, pair, deleteConfirm, onDeleteConfirm, onDeleteAnnuler, onDeleteConfirmer, onEdit, onStatut }) {
  const [imgError, setImgError] = useState(false)
  const STATUT_OPTIONS = ['disponible', 'vendu', 'réservé']
  const statutKey = produit.statut?.toLowerCase() || 'disponible'
  const statutColor = statutKey === 'disponible' ? C.success : statutKey === 'vendu' ? C.danger : C.warn
  const isDeleting = deleteConfirm === produit.id_produit

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '56px 1fr 150px 130px 140px 130px', padding: '0.9rem 1.25rem', alignItems: 'center', background: pair ? 'transparent' : '#ffffff04', borderBottom: `1px solid ${C.darkBorder}20` }}
      onMouseEnter={e => e.currentTarget.style.background = '#ffffff08'}
      onMouseLeave={e => e.currentTarget.style.background = pair ? 'transparent' : '#ffffff04'}
    >
      {/* Miniature */}
      <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', background: '#0F0F14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {produit.image && !imgError
          ? <img src={produit.image} alt="" onError={() => setImgError(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={{ fontSize: '1.2rem' }}>📦</span>
        }
      </div>

      {/* Nom + ID */}
      <div style={{ paddingLeft: '0.75rem' }}>
        <p style={{ fontWeight: 600, fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{produit.nom_produit}</p>
        <p style={{ color: C.muted, fontSize: '0.73rem' }}>ID #{produit.id_produit}</p>
      </div>

      {/* Catégorie */}
      <span style={{ display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.74rem', fontWeight: 600, background: '#ffffff12', color: C.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {produit.categorieProduit?.nom_categorieproduit || '—'}
      </span>

      {/* Prix réel BDD */}
      <span style={{ fontWeight: 700, color: C.orange, fontSize: '0.9rem' }}>
        {formatPrix(produit.prix)}
      </span>

      {/* Select statut — modifie directement en BDD via PUT */}
      <select value={produit.statut || 'disponible'} onChange={e => onStatut(e.target.value)}
        style={{ padding: '0.3rem 0.55rem', borderRadius: '20px', border: `1px solid ${statutColor}40`, background: `${statutColor}18`, color: statutColor, fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', outline: 'none', fontFamily: 'inherit' }}>
        {STATUT_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
      </select>

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
        {isDeleting ? (
          <>
            <button onClick={onDeleteConfirmer} style={{ padding: '0.3rem 0.6rem', background: C.danger, color: C.white, border: 'none', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Oui</button>
            <button onClick={onDeleteAnnuler}   style={{ padding: '0.3rem 0.6rem', background: C.darkBorder, color: C.muted, border: 'none', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}>Non</button>
          </>
        ) : (
          <>
            <button onClick={onEdit} title="Modifier" style={{ background: 'transparent', border: `1px solid ${C.darkBorder}`, color: C.info, padding: '0.3rem 0.5rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button onClick={onDeleteConfirm} title="Supprimer" style={{ background: 'transparent', border: `1px solid ${C.darkBorder}`, color: C.danger, padding: '0.3rem 0.5rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3,6 5,6 21,6"/><path d="M19,6l-1,14H6L5,6"/><path d="M10,11v6M14,11v6"/><path d="M9,6V4h6v2"/></svg>
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Ligne aperçu overview ────────────────────────────────────

function LigneApercu({ produit }) {
  const [imgError, setImgError] = useState(false)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', padding: '0.65rem 0', borderBottom: `1px solid ${C.darkBorder}` }}>
      <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#0F0F14', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
        {produit.image && !imgError
          ? <img src={produit.image} alt="" onError={() => setImgError(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span>📦</span>
        }
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: '0.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{produit.nom_produit}</div>
        <div style={{ color: C.muted, fontSize: '0.75rem' }}>{produit.categorieProduit?.nom_categorieproduit || '—'}</div>
      </div>
      <div style={{ color: C.orange, fontWeight: 700, fontSize: '0.88rem', flexShrink: 0 }}>
        {formatPrix(produit.prix)}
      </div>
    </div>
  )
}