import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// ============================================================
// AdminDashboard — Gestion des produits
//
// Les produits sont stockés dans localStorage (clé "assigame_produits")
// → les mêmes que ceux affichés dans le Catalogue
//
// Fonctionnalités :
//   - Voir la liste de tous les produits
//   - Ajouter un produit (nom, description, prix, catégorie, image depuis PC)
//   - Supprimer un produit
//
// 📌 BACKEND : remplacer le localStorage par les appels API :
//   GET    /api/produit/list            → charger
//   POST   /api/produit/ajouter        → créer
//   DELETE /api/produit/{id}           → supprimer
// ============================================================

const CATEGORIES = ['Consoles', 'Jeux PC', 'Accessoires', 'Autre']

const FORM_VIDE = { nom: '', description: '', prix: '', categorie: 'Consoles', image: '' }

export default function AdminDashboard() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [produits, setProduits] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(FORM_VIDE)
  const [imagePreview, setImagePreview] = useState(null)
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('assigame_produits') || '[]')
    setProduits(stored)
  }, [])

  // Sélection d'une image depuis le PC → conversion en base64
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
      image: form.image || ''
    }

    const updated = [...produits, nouveau]
    setProduits(updated)
    localStorage.setItem('assigame_produits', JSON.stringify(updated))
    setForm(FORM_VIDE)
    setImagePreview(null)
    setShowForm(false)
    setSaving(false)
  }

  const supprimerProduit = (id) => {
    const updated = produits.filter(p => p.id !== id)
    setProduits(updated)
    localStorage.setItem('assigame_produits', JSON.stringify(updated))
    setDeleteConfirm(null)
  }

  const filtered = produits.filter(p =>
    p.nom?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 2rem', fontFamily: 'system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800, color: '#1a1a1a', marginBottom: '0.25rem' }}>
            Tableau de <span style={{ color: '#F5A623' }}>bord</span>
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
            Gérez vos produits et suivez votre catalogue en temps réel.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: '#F5A623', color: '#fff', border: 'none',
            padding: '0.7rem 1.4rem', borderRadius: '10px',
            fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer'
          }}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Ajouter un produit
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total produits', value: produits.length, icon: '📦', color: '#F5A623' },
          { label: 'Consoles', value: produits.filter(p => p.categorie === 'Consoles').length, icon: '🎮', color: '#6366f1' },
          { label: 'Jeux PC', value: produits.filter(p => p.categorie === 'Jeux PC').length, icon: '💿', color: '#22c55e' },
          { label: 'Accessoires', value: produits.filter(p => p.categorie === 'Accessoires').length, icon: '🎧', color: '#f43f5e' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: '#fff', borderRadius: '12px', padding: '1.25rem',
            border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
            <div style={{ fontWeight: 800, fontSize: '1.6rem', color: stat.color }}>{stat.value}</div>
            <div style={{ color: '#6b7280', fontSize: '0.82rem', marginTop: '0.2rem' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recherche */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1a1a1a' }}>
          Liste des produits ({filtered.length})
        </h2>
        <div style={{ position: 'relative' }}>
          <svg style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}
            width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              padding: '0.55rem 1rem 0.55rem 2.25rem', borderRadius: '8px',
              border: '1px solid #e5e7eb', fontSize: '0.88rem', outline: 'none', width: '220px'
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        {/* En-têtes */}
        <div style={{
          display: 'grid', gridTemplateColumns: '60px 1fr 140px 120px 100px',
          padding: '0.75rem 1.25rem', background: '#f9fafb',
          borderBottom: '1px solid #e5e7eb', fontSize: '0.78rem',
          fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em'
        }}>
          <span>Image</span>
          <span>Produit</span>
          <span>Catégorie</span>
          <span>Prix</span>
          <span style={{ textAlign: 'right' }}>Actions</span>
        </div>

        {/* Lignes */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📭</div>
            <p>Aucun produit. Cliquez sur "Ajouter un produit" pour commencer.</p>
          </div>
        ) : (
          filtered.map((p, i) => (
            <div
              key={p.id}
              style={{
                display: 'grid', gridTemplateColumns: '60px 1fr 140px 120px 100px',
                padding: '1rem 1.25rem', alignItems: 'center',
                borderBottom: i < filtered.length - 1 ? '1px solid #f3f4f6' : 'none',
                transition: 'background 0.15s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {/* Image */}
              <div style={{
                width: '44px', height: '44px', borderRadius: '8px',
                overflow: 'hidden', background: '#f3f4f6',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {p.image
                  ? <img src={p.image} alt={p.nom} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: '1.2rem' }}>🎮</span>
                }
              </div>

              {/* Nom + description */}
              <div style={{ paddingLeft: '0.75rem' }}>
                <p style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1a1a1a' }}>{p.nom}</p>
                <p style={{
                  color: '#9ca3af', fontSize: '0.78rem', marginTop: '0.15rem',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '320px'
                }}>
                  {p.description || '—'}
                </p>
              </div>

              {/* Catégorie */}
              <span style={{
                display: 'inline-block', padding: '0.25rem 0.65rem',
                borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600,
                background: '#f3f4f6', color: '#4b5563'
              }}>
                {p.categorie}
              </span>

              {/* Prix */}
              <span style={{ fontWeight: 700, color: '#F5A623', fontSize: '0.95rem' }}>
                {p.prix.toLocaleString('fr-FR')} FCFA
              </span>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                {deleteConfirm === p.id ? (
                  <>
                    <button
                      onClick={() => supprimerProduit(p.id)}
                      style={{ padding: '0.35rem 0.7rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Oui
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      style={{ padding: '0.35rem 0.7rem', background: '#e5e7eb', color: '#4b5563', border: 'none', borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer' }}
                    >
                      Non
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(p.id)}
                    style={{ background: 'transparent', border: '1px solid #e5e7eb', color: '#ef4444', padding: '0.35rem 0.5rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="3,6 5,6 21,6" /><path d="M19,6l-1,14H6L5,6" /><path d="M10,11v6M14,11v6" /><path d="M9,6V4h6v2" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal : Ajouter un produit */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 200, padding: '1rem'
        }}>
          <div style={{
            background: '#fff', borderRadius: '20px', padding: '2rem',
            width: '100%', maxWidth: '520px', maxHeight: '90vh',
            overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.3rem' }}>
                Nouveau produit
              </h2>
              <button
                onClick={() => { setShowForm(false); setForm(FORM_VIDE); setImagePreview(null) }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: '1.4rem' }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

              {/* Nom */}
              <div>
                <label style={labelStyle}>Nom du produit *</label>
                <input
                  type="text"
                  placeholder="Ex: PlayStation 5 Pro"
                  value={form.nom}
                  onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
                  required
                  style={inputStyle}
                />
              </div>

              {/* Description */}
              <div>
                <label style={labelStyle}>Description</label>
                <textarea
                  placeholder="Décrivez votre produit..."
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }}
                />
              </div>

              {/* Prix + Catégorie */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Prix (FCFA) *</label>
                  <input
                    type="number"
                    placeholder="25000"
                    value={form.prix}
                    onChange={e => setForm(f => ({ ...f, prix: e.target.value }))}
                    required
                    min="0"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Catégorie</label>
                  <select
                    value={form.categorie}
                    onChange={e => setForm(f => ({ ...f, categorie: e.target.value }))}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Image depuis le PC */}
              <div>
                <label style={labelStyle}>Image du produit</label>
                <div
                  onClick={() => fileInputRef.current.click()}
                  style={{
                    border: '2px dashed #e5e7eb', borderRadius: '12px',
                    padding: '1.5rem', textAlign: 'center', cursor: 'pointer',
                    background: '#f9fafb', transition: 'border-color 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#F5A623'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e7eb'}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview" style={{ maxHeight: '140px', borderRadius: '8px', objectFit: 'cover' }} />
                  ) : (
                    <>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📁</div>
                      <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>Cliquez pour sélectionner une image</p>
                      <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: '0.25rem' }}>JPG, PNG, WEBP</p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </div>

              {/* Boutons */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setForm(FORM_VIDE); setImagePreview(null) }}
                  style={{
                    flex: 1, padding: '0.8rem', background: '#f3f4f6',
                    border: 'none', borderRadius: '10px', fontWeight: 600,
                    color: '#4b5563', cursor: 'pointer'
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    flex: 2, padding: '0.8rem', background: '#F5A623',
                    border: 'none', borderRadius: '10px', fontWeight: 700,
                    color: '#fff', cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.7 : 1
                  }}
                >
                  {saving ? 'Enregistrement...' : '✓ Ajouter le produit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const labelStyle = {
  display: 'block', fontSize: '0.82rem', fontWeight: 600,
  color: '#374151', marginBottom: '0.4rem'
}

const inputStyle = {
  width: '100%', padding: '0.7rem 0.9rem',
  background: '#f9fafb', border: '1px solid #e5e7eb',
  borderRadius: '8px', fontSize: '0.9rem', color: '#1f2937',
  outline: 'none', boxSizing: 'border-box'
}
