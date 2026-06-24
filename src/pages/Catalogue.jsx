// PAGE : Catalogue
// RESPONSABLE : Strawhart
// ENDPOINTS :
//   GET /api/produit/list
//   GET /api/categorieproduit/list
//   POST /api/panier/{idUtilisateur}/ajouter?idProduit=X&quantite=1

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Catalogue() {
  const { user, setCartCount } = useAuth()
  const navigate = useNavigate()

  const [produits, setProduits] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [recherche, setRecherche] = useState('')
  const [categorieActive, setCategorieActive] = useState(null)
  const [toast, setToast] = useState(null)
  const [ajoutEnCours, setAjoutEnCours] = useState(null)

  useEffect(() => {
    Promise.all([
      api.get('/produit/list'),
      api.get('/categorieproduit/list')
    ]).then(([resProduits, resCats]) => {
      setProduits(resProduits.data)
      setCategories(resCats.data)
    }).catch(() => {
      showToast('Erreur de chargement des produits.', 'error')
    }).finally(() => setLoading(false))
  }, [])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const ajouterAuPanier = async (produit) => {
    if (!user) {
      navigate('/login')
      return
    }
    setAjoutEnCours(produit.id_produit)
    try {
      await api.post(`/panier/${user.id_utilisateur}/ajouter?idProduit=${produit.id_produit}&quantite=1`)
      setCartCount(prev => prev + 1)
      showToast(`"${produit.nom_produit}" ajouté au panier !`, 'success')
    } catch {
      showToast('Erreur lors de l\'ajout au panier.', 'error')
    } finally {
      setAjoutEnCours(null)
    }
  }

  const produitsFiltres = produits.filter(p => {
    const matchRecherche = p.nom_produit?.toLowerCase().includes(recherche.toLowerCase())
      || p.description?.toLowerCase().includes(recherche.toLowerCase())
    const matchCategorie = categorieActive === null
      || p.categorieProduit?.idcategorie_produit === categorieActive
    return matchRecherche && matchCategorie
  })

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 2rem' }}>

      {/* Toast notification */}
      {toast && (
        <div style={{
          position: 'fixed', top: '80px', right: '2rem', zIndex: 999,
          padding: '0.85rem 1.25rem', borderRadius: '10px', fontWeight: 600,
          fontSize: '0.88rem', boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          background: toast.type === 'success' ? '#f0fdf4' : '#fef2f2',
          color: toast.type === 'success' ? '#166534' : '#dc2626',
          border: `1px solid ${toast.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
          transition: 'all 0.3s'
        }}>
          {toast.type === 'success' ? '✓ ' : '✕ '}{toast.message}
        </div>
      )}

      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2.2rem', fontWeight: 800, color: '#1a1a1a' }}>
          Découvrez nos <span style={{ color: '#F5A623' }}>produits</span>
        </h1>
        <p style={{ color: '#6b7280', marginTop: '0.5rem', fontSize: '1rem' }}>
          Achetez et vendez en toute simplicité
        </p>
      </div>

      {/* Barre de recherche */}
      <div style={{ position: 'relative', maxWidth: '560px', margin: '0 auto 2rem' }}>
        <span style={{
          position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
          color: '#9ca3af', fontSize: '1rem'
        }}>🔍</span>
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={recherche}
          onChange={e => setRecherche(e.target.value)}
          style={{
            width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem',
            border: '1px solid #e5e7eb', borderRadius: '12px',
            fontSize: '0.95rem', outline: 'none',
            fontFamily: 'Inter, sans-serif',
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            background: '#fff'
          }}
        />
        {recherche && (
          <button
            onClick={() => setRecherche('')}
            style={{
              position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '1.1rem'
            }}
          >×</button>
        )}
      </div>

      {/* Filtres catégories */}
      {categories.length > 0 && (
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem' }}>
          <ChipCategorie
            label="Tous"
            actif={categorieActive === null}
            onClick={() => setCategorieActive(null)}
          />
          {categories.map(cat => (
            <ChipCategorie
              key={cat.idcategorie_produit}
              label={cat.nom_categorieproduit}
              actif={categorieActive === cat.idcategorie_produit}
              onClick={() => setCategorieActive(
                categorieActive === cat.idcategorie_produit ? null : cat.idcategorie_produit
              )}
            />
          ))}
        </div>
      )}

      {/* Résultats */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
          Chargement des produits...
        </div>
      ) : produitsFiltres.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <h2 style={{ fontWeight: 700, color: '#1a1a1a' }}>Aucun produit trouvé</h2>
          <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>Essayez un autre mot-clé ou une autre catégorie.</p>
          <button
            onClick={() => { setRecherche(''); setCategorieActive(null) }}
            style={{ marginTop: '1.5rem', background: '#F5A623', color: '#fff', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <>
          <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            {produitsFiltres.length} produit{produitsFiltres.length > 1 ? 's' : ''} trouvé{produitsFiltres.length > 1 ? 's' : ''}
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.5rem'
          }}>
            {produitsFiltres.map(produit => (
              <CarteProduit
                key={produit.id_produit}
                produit={produit}
                enCours={ajoutEnCours === produit.id_produit}
                onAjouter={() => ajouterAuPanier(produit)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ── Sous-composants ──────────────────────────────────────────────

function CarteProduit({ produit, enCours, onAjouter }) {
  const [hovered, setHovered] = useState(false)

  const statutConfig = {
    disponible: { label: 'Disponible', color: '#16a34a', bg: '#dcfce7' },
    vendu:      { label: 'Vendu',      color: '#dc2626', bg: '#fee2e2' },
    reservé:    { label: 'Réservé',    color: '#d97706', bg: '#fef3c7' },
  }
  const statut = statutConfig[produit.statut?.toLowerCase()] || { label: produit.statut, color: '#6b7280', bg: '#f3f4f6' }
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
        transform: hovered ? 'translateY(-2px)' : 'none',
        display: 'flex', flexDirection: 'column'
      }}
    >
      {/* Image */}
      <div style={{
        height: '200px', background: '#f9fafb',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', position: 'relative'
      }}>
        {produit.image ? (
          <img
            src={produit.image}
            alt={produit.nom_produit}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span style={{ fontSize: '3.5rem' }}>📦</span>
        )}
        {/* Badge statut */}
        <span style={{
          position: 'absolute', top: '0.75rem', right: '0.75rem',
          padding: '0.25rem 0.6rem', borderRadius: '20px',
          fontSize: '0.72rem', fontWeight: 700,
          background: statut.bg, color: statut.color
        }}>
          {statut.label}
        </span>
      </div>

      {/* Contenu */}
      <div style={{ padding: '1.1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Catégorie */}
        {produit.categorieProduit && (
          <span style={{ fontSize: '0.75rem', color: '#F5A623', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {produit.categorieProduit.nom_categorieproduit}
          </span>
        )}

        {/* Nom */}
        <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a1a', margin: '0.3rem 0 0.4rem', lineHeight: 1.3 }}>
          {produit.nom_produit}
        </h3>

        {/* Description */}
        {produit.description && (
          <p style={{
            fontSize: '0.82rem', color: '#6b7280', lineHeight: 1.5,
            flex: 1, overflow: 'hidden',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
          }}>
            {produit.description}
          </p>
        )}

        {/* Prix + bouton */}
        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1a1a1a' }}>
            {produit.prix?.toLocaleString('fr-FR')} FCFA
          </span>
          <button
            onClick={onAjouter}
            disabled={enCours || !estDisponible}
            style={{
              background: estDisponible ? '#F5A623' : '#e5e7eb',
              color: estDisponible ? '#fff' : '#9ca3af',
              border: 'none', borderRadius: '8px',
              padding: '0.55rem 1rem', fontSize: '0.85rem',
              fontWeight: 600, cursor: estDisponible ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              opacity: enCours ? 0.7 : 1, transition: 'opacity 0.2s',
              whiteSpace: 'nowrap'
            }}
          >
            {enCours ? (
              '...'
            ) : estDisponible ? (
              <><CartIcon /> Ajouter</>
            ) : (
              'Indisponible'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function ChipCategorie({ label, actif, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '0.45rem 1rem', borderRadius: '20px',
        border: actif ? '2px solid #F5A623' : '1px solid #e5e7eb',
        background: actif ? '#FFF8EE' : '#fff',
        color: actif ? '#F5A623' : '#4b5563',
        fontSize: '0.85rem', fontWeight: actif ? 700 : 500,
        cursor: 'pointer', transition: 'all 0.15s'
      }}
    >
      {label}
    </button>
  )
}

function CartIcon() {
  return (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  )
}