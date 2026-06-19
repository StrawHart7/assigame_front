// PAGE : Catalogue
// RESPONSABLE : Diel Perez
// TODO : Liste produits, filtre par catégorie, recherche texte, page détail
// ENDPOINTS :
//   GET /api/produit/list
//   GET /api/categorieproduit/list
//   POST /api/panier/{idUtilisateur}/ajouter?idProduit=X&quantite=1

export default function Catalogue() {
  return (
    <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
      <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800 }}>
        Catalogue
      </h1>
      <p style={{ color: '#6b7280', marginTop: '1rem' }}>
        [Page Catalogue — à développer par Diel Perez]
      </p>
    </div>
  )
}