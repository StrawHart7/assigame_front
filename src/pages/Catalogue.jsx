// PAGE : Catalogue
// ENDPOINTS RÉELS :
//   GET  /api/produit/list
//   GET  /api/categorieproduit/list
//   POST /api/produit/add
// Panier : localStorage uniquement (pas d'endpoint panier en backend)

import { useEffect, useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

// ── Helpers ───────────────────────────────────────────────────────

const STATUT_CONFIG = {
  disponible: { label: 'Disponible', color: '#16a34a', bg: '#dcfce7' },
  vendu:      { label: 'Vendu',      color: '#dc2626', bg: '#fee2e2' },
  'réservé':  { label: 'Réservé',    color: '#d97706', bg: '#fef3c7' },
  reservé:    { label: 'Réservé',    color: '#d97706', bg: '#fef3c7' },
}

const formatPrix = (prix) =>
  prix != null ? Number(prix).toLocaleString('fr-FR') + ' FCFA' : '—'

// Lecture panier localStorage
const getPanier = () => {
  try { return JSON.parse(localStorage.getItem('assigame_panier') || '[]') }
  catch { return [] }
}

// Ajout au panier localStorage
const ajouterPanierLocal = (produit) => {
  const panier = getPanier()
  const existe = panier.find(item => item.id_produit === produit.id_produit)
  if (existe) {
    existe.quantite += 1
  } else {
    panier.push({
      id_produit:   produit.id_produit,
      nom_produit:  produit.nom_produit,
      prix:         produit.prix,
      image:        produit.image || null,
      statut:       produit.statut,
      quantite:     1,
    })
  }
  localStorage.setItem('assigame_panier', JSON.stringify(panier))
  return panier.reduce((acc, i) => acc + i.quantite, 0)
}

// Conversion fichier → base64
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload  = () => resolve(reader.result)   // "data:image/...;base64,..."
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

// ── Page principale ───────────────────────────────────────────────

export default function Catalogue() {
  const { user, setCartCount } = useAuth()

  const [produits, setProduits]               = useState([])
  const [categories, setCategories]           = useState([])
  const [loading, setLoading]                 = useState(true)
  const [recherche, setRecherche]             = useState('')
  const [categorieActive, setCategorieActive] = useState(null)
  const [tri, setTri]                         = useState('recent')
  const [toast, setToast]                     = useState(null)
  const [modalOuverte, setModalOuverte]       = useState(false)
  const [produitDetail, setProduitDetail]     = useState(null) // overlay détail
  const toastTimer = useRef(null)

  // Sync compteur panier au montage
  useEffect(() => {
    const total = getPanier().reduce((acc, i) => acc + i.quantite, 0)
    setCartCount(total)
  }, [])

  useEffect(() => { chargerDonnees() }, [])

  const chargerDonnees = () => {
    setLoading(true)
    Promise.all([
      api.get('/produit/list'),
      api.get('/categorieproduit/list'),
    ])
      .then(([resProduits, resCats]) => {
        setProduits(resProduits.data)
        setCategories(resCats.data)
      })
      .catch(() => showToast('Erreur de chargement des produits.', 'error'))
      .finally(() => setLoading(false))
  }

  const showToast = (message, type = 'success') => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast({ message, type })
    toastTimer.current = setTimeout(() => setToast(null), 3000)
  }

  // Ajout panier — localStorage uniquement, pas d'appel API
  const ajouterAuPanier = (produit) => {
    const total = ajouterPanierLocal(produit)
    setCartCount(total)
    showToast(`"${produit.nom_produit}" ajouté au panier !`, 'success')
  }

  const onProduitAjoute = (nouveauProduit) => {
    setProduits(prev => [nouveauProduit, ...prev])
    setModalOuverte(false)
    showToast(`"${nouveauProduit.nom_produit}" publié avec succès !`, 'success')
  }

  // Filtrage + tri
  const produitsFiltres = produits
    .filter(p => {
      const matchRecherche =
        p.nom_produit?.toLowerCase().includes(recherche.toLowerCase()) ||
        p.description?.toLowerCase().includes(recherche.toLowerCase())
      const matchCategorie =
        categorieActive === null ||
        p.categorieProduit?.idcategorie_produit === categorieActive
      return matchRecherche && matchCategorie
    })
    .sort((a, b) => {
      if (tri === 'prix_asc')  return (a.prix || 0) - (b.prix || 0)
      if (tri === 'prix_desc') return (b.prix || 0) - (a.prix || 0)
      return (b.id_produit || 0) - (a.id_produit || 0)
    })

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 2rem' }}>

      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Modal publication */}
      {modalOuverte && (
        <ModalAjoutProduit
          categories={categories}
          user={user}
          onClose={() => setModalOuverte(false)}
          onSuccess={onProduitAjoute}
          showToast={showToast}
        />
      )}

      {/* Overlay détail produit */}
      {produitDetail && (
        <OverlayDetailProduit
          produit={produitDetail}
          onClose={() => setProduitDetail(null)}
          onAjouter={ajouterAuPanier}
        />
      )}

      {/* Hero */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800, color: '#1a1a1a' }}>
            Découvrez nos <span style={{ color: '#F5A623' }}>produits</span>
          </h1>
          <p style={{ color: '#6b7280', marginTop: '0.3rem', fontSize: '0.95rem' }}>
            Achetez et vendez en toute simplicité
          </p>
        </div>
        {/* Bouton publier visible uniquement si connecté */}
        {user && (
          <button onClick={() => setModalOuverte(true)} style={btnPublierStyle}>
            + Publier un produit
          </button>
        )}
      </div>

      {/* Barre recherche + tri */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>🔍</span>
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={recherche}
            onChange={e => setRecherche(e.target.value)}
            style={searchInputStyle}
          />
          {recherche && (
            <button onClick={() => setRecherche('')} style={clearSearchStyle}>×</button>
          )}
        </div>
        <select value={tri} onChange={e => setTri(e.target.value)} style={selectStyle}>
          <option value="recent">Plus récents</option>
          <option value="prix_asc">Prix croissant</option>
          <option value="prix_desc">Prix décroissant</option>
        </select>
      </div>

      {/* Filtres catégories */}
      {categories.length > 0 && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
          <ChipCategorie label="Tous" actif={categorieActive === null} onClick={() => setCategorieActive(null)} />
          {categories.map(cat => (
            <ChipCategorie
              key={cat.idcategorie_produit}
              label={cat.nom_categorieproduit}
              actif={categorieActive === cat.idcategorie_produit}
              onClick={() =>
                setCategorieActive(
                  categorieActive === cat.idcategorie_produit ? null : cat.idcategorie_produit
                )
              }
            />
          ))}
        </div>
      )}

      {/* Contenu */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: '#6b7280' }}>
          Chargement des produits...
        </div>
      ) : produitsFiltres.length === 0 ? (
        <EtatVide onReset={() => { setRecherche(''); setCategorieActive(null) }} />
      ) : (
        <>
          <p style={{ color: '#9ca3af', fontSize: '0.82rem', marginBottom: '1.25rem' }}>
            {produitsFiltres.length} produit{produitsFiltres.length > 1 ? 's' : ''}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {produitsFiltres.map(produit => (
              <CarteProduit
                key={produit.id_produit}
                produit={produit}
                onVoirPlus={() => setProduitDetail(produit)}
                onAjouter={() => ajouterAuPanier(produit)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ── Overlay détail produit ────────────────────────────────────────

function OverlayDetailProduit({ produit, onClose, onAjouter }) {
  const [imgError, setImgError] = useState(false)
  const estDisponible = produit.statut?.toLowerCase() === 'disponible'
  const statut = STATUT_CONFIG[produit.statut?.toLowerCase()] ||
    { label: produit.statut, color: '#6b7280', bg: '#f3f4f6' }

  // Fermeture clavier Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div style={overlayStyle} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: '#fff', borderRadius: '20px',
        width: '100%', maxWidth: '640px', maxHeight: '90vh',
        overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Image */}
        <div style={{ height: '280px', background: '#f9fafb', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
          {produit.image && !imgError ? (
            <img
              src={produit.image}
              alt={produit.nom_produit}
              onError={() => setImgError(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '5rem' }}>📦</span>
            </div>
          )}
          {/* Badge statut */}
          <span style={{
            position: 'absolute', top: '1rem', left: '1rem',
            padding: '0.3rem 0.8rem', borderRadius: '20px',
            fontSize: '0.78rem', fontWeight: 700,
            background: statut.bg, color: statut.color,
          }}>
            {statut.label}
          </span>
          {/* Bouton fermer */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: '1rem', right: '1rem',
              background: 'rgba(0,0,0,0.45)', border: 'none', borderRadius: '50%',
              width: '36px', height: '36px', color: '#fff',
              fontSize: '1.2rem', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            ×
          </button>
        </div>

        {/* Contenu */}
        <div style={{ padding: '1.75rem 2rem 2rem' }}>
          {/* Catégorie */}
          {produit.categorieProduit && (
            <span style={{ fontSize: '0.75rem', color: '#F5A623', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {produit.categorieProduit.nom_categorieproduit}
            </span>
          )}

          {/* Nom */}
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#1a1a1a', margin: '0.4rem 0 0.75rem' }}>
            {produit.nom_produit}
          </h2>

          {/* Prix — valeur réelle de la BDD */}
          <p style={{ fontSize: '1.6rem', fontWeight: 800, color: '#F5A623', margin: '0 0 1rem' }}>
            {formatPrix(produit.prix)}
          </p>

          {/* Description */}
          {produit.description && (
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                Description
              </p>
              <p style={{ fontSize: '0.95rem', color: '#4b5563', lineHeight: 1.7 }}>
                {produit.description}
              </p>
            </div>
          )}

          {/* Date ajout */}
          {produit.date_ajout && (
            <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '1.5rem' }}>
              Publié le {new Date(produit.date_ajout).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => { onAjouter(produit); onClose() }}
              disabled={!estDisponible}
              style={{
                flex: 1, minWidth: '140px',
                background: estDisponible ? '#F5A623' : '#e5e7eb',
                color: estDisponible ? '#fff' : '#9ca3af',
                border: 'none', borderRadius: '10px',
                padding: '0.8rem 1.25rem', fontSize: '0.95rem', fontWeight: 700,
                cursor: estDisponible ? 'pointer' : 'not-allowed',
              }}
            >
              {estDisponible ? '🛒 Ajouter au panier' : 'Indisponible'}
            </button>

            {/* Bouton WhatsApp */}
            <a
              href="https://wa.me/22890000000"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: '#25D366', color: '#fff',
                borderRadius: '10px', padding: '0.8rem 1.25rem',
                fontSize: '0.95rem', fontWeight: 700, textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              <WhatsAppIcon /> Contacter
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Modal ajout produit ───────────────────────────────────────────

function ModalAjoutProduit({ categories, user, onClose, onSuccess, showToast }) {
  const [form, setForm] = useState({
    nom_produit:  '',
    description:  '',
    prix:         '',
    image:        '',   // base64 string
    categorieId:  '',
  })
  const [apercu, setApercu]       = useState(null)   // URL objet pour preview
  const [submitting, setSubmitting] = useState(false)
  const [erreurs, setErreurs]     = useState({})

  const valider = () => {
    const e = {}
    if (!form.nom_produit.trim()) e.nom_produit = 'Le nom est requis.'
    if (!form.prix || isNaN(Number(form.prix)) || Number(form.prix) <= 0)
      e.prix = 'Entrez un prix valide.'
    if (!form.categorieId) e.categorieId = 'Choisissez une catégorie.'
    return e
  }

  // Gestion upload image → base64
  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    // Preview local immédiat
    setApercu(URL.createObjectURL(file))
    try {
      const base64 = await fileToBase64(file)
      champ('image', base64)
    } catch {
      showToast("Impossible de lire l'image.", 'error')
    }
  }

  const handleSubmit = async () => {
    const e = valider()
    if (Object.keys(e).length > 0) { setErreurs(e); return }
    setSubmitting(true)
    try {
      const payload = {
        nom_produit:      form.nom_produit.trim(),
        description:      form.description.trim() || null,
        prix:             Number(form.prix),
        image:            form.image || null,    // base64 ou null
        statut:           'disponible',
        // date_ajout géré par le backend (LocalDateTime.now())
        categorieProduit: { idcategorie_produit: Number(form.categorieId) },
        utilisateur:      { id_utilisateur: user?.id_utilisateur ?? 1 },
      }
      const res = await api.post('/produit/add', payload)
      onSuccess(res.data)
    } catch {
      showToast('Erreur lors de la publication.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const champ = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }))
    if (erreurs[key]) setErreurs(prev => ({ ...prev, [key]: null }))
  }

  return (
    <div style={overlayStyle} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={modalStyle}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.3rem' }}>
            Publier un produit
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#9ca3af' }}>×</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

          <ModalField label="Nom du produit *" error={erreurs.nom_produit}>
            <input
              type="text"
              placeholder="Ex : iPhone 13 Pro"
              value={form.nom_produit}
              onChange={e => champ('nom_produit', e.target.value)}
              style={inputStyle(!!erreurs.nom_produit)}
            />
          </ModalField>

          <ModalField label="Description">
            <textarea
              placeholder="Décrivez votre produit (état, caractéristiques...)"
              value={form.description}
              onChange={e => champ('description', e.target.value)}
              rows={3}
              style={{ ...inputStyle(false), resize: 'vertical', minHeight: '80px' }}
            />
          </ModalField>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <ModalField label="Prix (FCFA) *" error={erreurs.prix}>
              <input
                type="number"
                placeholder="Ex : 15000"
                value={form.prix}
                onChange={e => champ('prix', e.target.value)}
                min="0"
                style={inputStyle(!!erreurs.prix)}
              />
            </ModalField>

            <ModalField label="Catégorie *" error={erreurs.categorieId}>
              <select
                value={form.categorieId}
                onChange={e => champ('categorieId', e.target.value)}
                style={inputStyle(!!erreurs.categorieId)}
              >
                <option value="">Choisir...</option>
                {categories.map(cat => (
                  <option key={cat.idcategorie_produit} value={cat.idcategorie_produit}>
                    {cat.nom_categorieproduit}
                  </option>
                ))}
              </select>
            </ModalField>
          </div>

          {/* Upload image depuis l'ordinateur */}
          <ModalField label="Image du produit (optionnel)">
            <label style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.65rem 0.9rem', border: '1px dashed #d1d5db',
              borderRadius: '8px', cursor: 'pointer', background: '#f9fafb',
              fontSize: '0.88rem', color: '#6b7280',
            }}>
              <span>📁</span>
              <span>{form.image ? 'Image sélectionnée ✓' : 'Choisir une image depuis l\'ordinateur'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </label>
            {/* Aperçu */}
            {apercu && (
              <div style={{ marginTop: '0.5rem', height: '90px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e5e7eb', position: 'relative' }}>
                <img src={apercu} alt="aperçu" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  onClick={() => { setApercu(null); champ('image', '') }}
                  style={{
                    position: 'absolute', top: '4px', right: '4px',
                    background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%',
                    color: '#fff', width: '22px', height: '22px', cursor: 'pointer', fontSize: '0.85rem',
                  }}
                >×</button>
              </div>
            )}
          </ModalField>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem' }}>
          <button onClick={onClose} style={btnAnnulerStyle}>Annuler</button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{ ...btnPublierStyle, flex: 1, opacity: submitting ? 0.7 : 1 }}
          >
            {submitting ? 'Publication...' : 'Publier'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Carte produit ─────────────────────────────────────────────────

function CarteProduit({ produit, onVoirPlus, onAjouter }) {
  const [hovered, setHovered] = useState(false)
  const [imgError, setImgError] = useState(false)

  const statut = STATUT_CONFIG[produit.statut?.toLowerCase()] ||
    { label: produit.statut, color: '#6b7280', bg: '#f3f4f6' }
  const estDisponible = produit.statut?.toLowerCase() === 'disponible'

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff', borderRadius: '16px',
        border: '1px solid #e5e7eb', overflow: 'hidden',
        boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.1)' : '0 1px 4px rgba(0,0,0,0.05)',
        transition: 'box-shadow 0.2s, transform 0.2s',
        transform: hovered ? 'translateY(-3px)' : 'none',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Image */}
      <div style={{ height: '200px', background: '#f9fafb', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {produit.image && !imgError ? (
          <img
            src={produit.image}
            alt={produit.nom_produit}
            onError={() => setImgError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span style={{ fontSize: '3.5rem' }}>📦</span>
        )}
        <span style={{
          position: 'absolute', top: '0.75rem', right: '0.75rem',
          padding: '0.25rem 0.65rem', borderRadius: '20px',
          fontSize: '0.72rem', fontWeight: 700,
          background: statut.bg, color: statut.color,
        }}>
          {statut.label}
        </span>
      </div>

      {/* Contenu */}
      <div style={{ padding: '1.1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {produit.categorieProduit && (
          <span style={{ fontSize: '0.72rem', color: '#F5A623', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {produit.categorieProduit.nom_categorieproduit}
          </span>
        )}
        <h3 style={{ fontWeight: 700, fontSize: '0.97rem', color: '#1a1a1a', margin: '0.3rem 0 0.4rem', lineHeight: 1.3 }}>
          {produit.nom_produit}
        </h3>
        {produit.description && (
          <p style={{
            fontSize: '0.82rem', color: '#6b7280', lineHeight: 1.5, flex: 1,
            overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}>
            {produit.description}
          </p>
        )}

        {/* Prix réel de la BDD */}
        <p style={{ fontWeight: 800, fontSize: '1.05rem', color: '#1a1a1a', margin: '0.75rem 0 0.75rem' }}>
          {formatPrix(produit.prix)}
        </p>

        {/* Boutons */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {/* Voir + → ouvre l'overlay détail */}
          <button
            onClick={onVoirPlus}
            style={{
              flex: 1, background: '#f3f4f6', color: '#1a1a1a',
              border: 'none', borderRadius: '8px',
              padding: '0.5rem 0.7rem', fontSize: '0.82rem', fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Voir +
          </button>

          {/* Ajouter au panier */}
          <button
            onClick={onAjouter}
            disabled={!estDisponible}
            style={{
              flex: 1,
              background: estDisponible ? '#F5A623' : '#e5e7eb',
              color: estDisponible ? '#fff' : '#9ca3af',
              border: 'none', borderRadius: '8px',
              padding: '0.5rem 0.7rem', fontSize: '0.82rem', fontWeight: 600,
              cursor: estDisponible ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem',
            }}
          >
            {estDisponible ? <><CartIcon /> Ajouter</> : 'Indisponible'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Petits composants ─────────────────────────────────────────────

function ModalField({ label, error, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.35rem' }}>
        {label}
      </label>
      {children}
      {error && <p style={{ color: '#dc2626', fontSize: '0.78rem', marginTop: '0.25rem' }}>{error}</p>}
    </div>
  )
}

function ChipCategorie({ label, actif, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '0.4rem 0.9rem', borderRadius: '20px',
      border: actif ? '2px solid #F5A623' : '1px solid #e5e7eb',
      background: actif ? '#FFF8EE' : '#fff',
      color: actif ? '#F5A623' : '#4b5563',
      fontSize: '0.83rem', fontWeight: actif ? 700 : 500,
      cursor: 'pointer', transition: 'all 0.15s',
    }}>
      {label}
    </button>
  )
}

function EtatVide({ onReset }) {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
      <h2 style={{ fontWeight: 700, color: '#1a1a1a' }}>Aucun produit trouvé</h2>
      <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>Essayez un autre mot-clé ou une autre catégorie.</p>
      <button onClick={onReset} style={{ marginTop: '1.5rem', background: '#F5A623', color: '#fff', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}>
        Réinitialiser les filtres
      </button>
    </div>
  )
}

function Toast({ message, type }) {
  return (
    <div style={{
      position: 'fixed', top: '80px', right: '2rem', zIndex: 9999,
      padding: '0.85rem 1.25rem', borderRadius: '10px', fontWeight: 600,
      fontSize: '0.88rem', boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
      background: type === 'success' ? '#f0fdf4' : '#fef2f2',
      color: type === 'success' ? '#166534' : '#dc2626',
      border: `1px solid ${type === 'success' ? '#bbf7d0' : '#fecaca'}`,
      maxWidth: '320px',
    }}>
      {type === 'success' ? '✓ ' : '✕ '}{message}
    </div>
  )
}

function CartIcon() {
  return (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
    </svg>
  )
}

// ── Styles ────────────────────────────────────────────────────────

const inputStyle = (hasError) => ({
  width: '100%', padding: '0.65rem 0.9rem',
  border: `1px solid ${hasError ? '#fca5a5' : '#e5e7eb'}`,
  borderRadius: '8px', fontSize: '0.9rem',
  outline: 'none', fontFamily: 'Inter, sans-serif',
  background: hasError ? '#fef2f2' : '#fff',
  boxSizing: 'border-box',
})

const overlayStyle = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 1000, padding: '1rem',
}

const modalStyle = {
  background: '#fff', borderRadius: '20px', padding: '2rem',
  width: '100%', maxWidth: '520px', maxHeight: '90vh',
  overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
}

const btnPublierStyle = {
  background: '#F5A623', color: '#fff', border: 'none',
  padding: '0.65rem 1.25rem', borderRadius: '10px',
  fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
  whiteSpace: 'nowrap',
}

const btnAnnulerStyle = {
  background: '#fff', color: '#4b5563',
  border: '1px solid #e5e7eb', padding: '0.65rem 1.25rem',
  borderRadius: '10px', fontSize: '0.9rem', fontWeight: 600,
  cursor: 'pointer', minWidth: '100px',
}

const searchInputStyle = {
  width: '100%', padding: '0.72rem 2.5rem 0.72rem 2.75rem',
  border: '1px solid #e5e7eb', borderRadius: '12px',
  fontSize: '0.92rem', outline: 'none',
  fontFamily: 'Inter, sans-serif',
  background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  boxSizing: 'border-box',
}

const clearSearchStyle = {
  position: 'absolute', right: '1rem', top: '50%',
  transform: 'translateY(-50%)', background: 'none',
  border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '1.2rem',
}

const selectStyle = {
  padding: '0.72rem 1rem', border: '1px solid #e5e7eb',
  borderRadius: '12px', fontSize: '0.9rem', outline: 'none',
  fontFamily: 'Inter, sans-serif', background: '#fff',
  cursor: 'pointer', color: '#4b5563', minWidth: '170px',
}