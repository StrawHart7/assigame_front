import { useState, useEffect } from "react";

export default function Catalogue() {
  const [search, setSearch] = useState("");
  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔵 Chargement produits
  useEffect(() => {
    fetch("http://localhost:8080/api/produit/list")
      .then(res => res.json())
      .then(data => {
        setProduits(data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  // 🔵 Chargement catégories
  useEffect(() => {
    fetch("http://localhost:8080/api/categorieproduit/list")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.log(err));
  }, []);

  // 🟢 Ajouter au panier
  const ajouterAuPanier = (idProduit) => {
    fetch(`http://localhost:8080/api/panier/1/ajouter?idProduit=${idProduit}&quantite=1`, {
      method: "POST"
    })
      .then(res => res.json())
      .then(data => {
        console.log("Produit ajouté :", data);
        alert("Produit ajouté au panier ✅");
      })
      .catch(err => console.log("Erreur :", err));
  };

  // 🟢 FILTRE PROPRE
  const filtered = produits.filter(p => {
    const matchSearch = p.nom
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      selectedCat === null
        ? true
        : (p.categorie_id === selectedCat ||
          p.categorie?.id === selectedCat ||
          p.id_categorie === selectedCat);

    return matchSearch && matchCategory;
  });

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Chargement des produits...
      </div>
    );
  }

  return (
    <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>

      <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800 }}>
        Catalogue
      </h1>

      {/* 🔍 RECHERCHE */}
      <input
        type="text"
        placeholder="Rechercher un produit..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          marginTop: "1rem",
          padding: "10px",
          width: "60%",
          borderRadius: "8px",
          border: "1px solid #ccc"
        }}
      />

      {/* 📂 CATEGORIES */}
      <div style={{ marginTop: "1rem" }}>
        <button
          onClick={() => setSelectedCat(null)}
          style={{
            margin: "5px",
            padding: "6px 12px",
            borderRadius: "6px",
            border: "1px solid #ddd",
            cursor: "pointer"
          }}
        >
          Tous
        </button>

        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCat(cat.id)}
            style={{
              margin: "5px",
              padding: "6px 12px",
              borderRadius: "6px",
              border: "1px solid #ddd",
              cursor: "pointer",
              background: selectedCat === cat.id ? "#111" : "#fff",
              color: selectedCat === cat.id ? "#fff" : "#000"
            }}
          >
            {cat.nom}
          </button>
        ))}
      </div>

      {/* 🛍 PRODUITS */}
      <div
        style={{
          marginTop: "2rem",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center"
        }}
      >
        {filtered.length === 0 ? (
          <p>Aucun produit trouvé</p>
        ) : (
          filtered.map((p) => (
            <div
              key={p.id}
              style={{
                border: "1px solid #e5e7eb",
                padding: "20px",
                margin: "15px",
                width: "250px",
                borderRadius: "12px",
                textAlign: "center",
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                backgroundColor: "#fff"
              }}
            >

              {/* IMAGE SI EXISTE */}
              {p.image && (
                <img
                  src={p.image}
                  alt={p.nom}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "10px"
                  }}
                />
              )}

              <h3 style={{ marginBottom: "10px" }}>{p.nom}</h3>

              <p style={{ fontWeight: "bold", color: "#111" }}>
                {p.prix} FCFA
              </p>

              <button
                onClick={() => ajouterAuPanier(p.id)}
                style={{
                  marginTop: "10px",
                  padding: "8px 12px",
                  border: "none",
                  borderRadius: "6px",
                  backgroundColor: "#111",
                  color: "#fff",
                  cursor: "pointer"
                }}
              >
                Ajouter au panier
              </button>

            </div>
          ))
        )}
      </div>

    </div>
  );
}