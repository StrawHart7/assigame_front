// PAGE : Accueil
// RESPONSABLE : Picardie

const categories = [
  { img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&q=80', nom: 'Électronique' },
  { img: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&q=80', nom: 'Mode' },
  { img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=80', nom: 'Maison' },
  { img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&q=80', nom: 'Beauté' },
  { img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&q=80', nom: 'Accessoires' },
  { img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&q=80', nom: 'Gaming' },
];

const produits = [
  { img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80', nom: 'Casque Sans Fil X1', prix: '84,99 €', ancien: '99,99 €', promo: '-20%', avis: 4 },
  { img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80', nom: 'Montre Connectée Pro', prix: '69,99 €', ancien: '99,99 €', promo: '-15%', avis: 4 },
  { img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80', nom: 'Baskets Urban', prix: '49,99 €', ancien: '99,99 €', promo: '-10%', avis: 5 },
  { img: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=300&q=80', nom: 'Parfum Élégance', prix: '29,99 €', ancien: '42,99 €', promo: '-30%', avis: 4 },
  { img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&q=80', nom: 'Sac à dos Elite', prix: '59,99 €', ancien: '74,99 €', promo: '-20%', avis: 4 },
  { img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&q=80', nom: 'Lunettes Polarisées', prix: '29,99 €', ancien: '49,99 €', promo: '-25%', avis: 4 },
];

export default function Accueil() {
  return (
    <div style={{ fontFamily: 'Syne, sans-serif', background: '#f5f5f5', margin: 0 }}>

      {/* BARRE TOP */}
      <div style={{ background: 'linear-gradient(90deg, #6c2bd9, #9b4dff)', color: '#fff', padding: '0.5rem 2rem', display: 'flex', justifyContent: 'space-around', fontSize: '0.78rem', flexWrap: 'wrap', gap: '0.5rem', textAlign: 'center' }}>
        {['🚚 Livraison rapide partout', '🔒 Paiement sécurisé', '🔄 Satisfait ou remboursé 30 jours', '💬 Support 7/7'].map((t, i) => (
          <span key={i}>{t}</span>
        ))}
      </div>

      {/* HERO */}
      <section style={{
        background: 'linear-gradient(135deg, #0d0d2b 0%, #1a1a4e 60%, #0d1b3e 100%)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '4rem 5%',
        minHeight: '420px',
        flexWrap: 'wrap',
        gap: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '480px', zIndex: 1 }}>
          <p style={{ color: '#a78bfa', fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '1rem' }}>✦ Bienvenue chez Assigame</p>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '900', lineHeight: 1.15, marginBottom: '1rem' }}>
            Qualité, confiance<br />et <span style={{ color: '#a78bfa' }}>style.</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            Découvrez des produits tendance, de qualité et sélectionnés rien que pour vous.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="/catalogue" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff', padding: '0.8rem 1.8rem', borderRadius: '8px', textDecoration: 'none', fontWeight: '700' }}>
              Découvrir le catalogue →
            </a>
            <a href="/catalogue" style={{ background: 'transparent', border: '1px solid #475569', color: '#fff', padding: '0.8rem 1.8rem', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>
              Voir les offres →
            </a>
          </div>
        </div>

        {/* IMAGES HERO */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', zIndex: 1 }}>
          <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&q=80"
            alt="mode" style={{ width: '200px', height: '280px', objectFit: 'cover', borderRadius: '16px', boxShadow: '0 0 40px rgba(167,139,250,0.3)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80"
              alt="shoes" style={{ width: '140px', height: '130px', objectFit: 'cover', borderRadius: '12px' }} />
            <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80"
              alt="casque" style={{ width: '140px', height: '130px', objectFit: 'cover', borderRadius: '12px' }} />
          </div>
        </div>
      </section>

      {/* GARANTIES */}
      <div style={{ background: '#fff', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', padding: '1.5rem 5%', gap: '1rem', borderBottom: '1px solid #e5e7eb' }}>
        {[
          { icon: '🚚', titre: 'Livraison rapide', desc: 'Partout dans le monde' },
          { icon: '🔒', titre: 'Paiement sécurisé', desc: '100% sécurisé' },
          { icon: '🔄', titre: 'Satisfait ou remboursé', desc: '30 jours pour changer d\'avis' },
          { icon: '💬', titre: 'Support 7/7', desc: 'Nous sommes là pour vous' },
        ].map((g, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <span style={{ fontSize: '1.5rem' }}>{g.icon}</span>
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>{g.titre}</div>
              <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>{g.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* CATÉGORIES */}
      <section style={{ background: '#fff', padding: '3rem 5%', marginTop: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '800' }}>Nos catégories populaires</h2>
          <a href="/catalogue" style={{ color: '#7c3aed', fontSize: '0.85rem', textDecoration: 'none', fontWeight: '600' }}>Voir tout →</a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
          {categories.map((cat, i) => (
            <div key={i} style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e7eb', cursor: 'pointer', textAlign: 'center' }}>
              <img src={cat.img} alt={cat.nom} style={{ width: '100%', height: '90px', objectFit: 'cover' }} />
              <div style={{ padding: '0.6rem', fontSize: '0.8rem', fontWeight: '700', color: '#374151' }}>{cat.nom}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUITS POPULAIRES */}
      <section style={{ padding: '3rem 5%', background: '#f9fafb' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '800' }}>Produits populaires</h2>
          <a href="/catalogue" style={{ color: '#7c3aed', fontSize: '0.85rem', textDecoration: 'none', fontWeight: '600' }}>Voir tous les produits →</a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
          {produits.map((p, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e7eb', position: 'relative' }}>
              <span style={{ position: 'absolute', top: '0.8rem', left: '0.8rem', background: '#7c3aed', color: '#fff', fontSize: '0.7rem', fontWeight: '700', padding: '0.2rem 0.5rem', borderRadius: '4px', zIndex: 1 }}>{p.promo}</span>
              <img src={p.img} alt={p.nom} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
              <div style={{ padding: '0.8rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.3rem' }}>{p.nom}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                  <span style={{ color: '#7c3aed', fontWeight: '800' }}>{p.prix}</span>
                  <span style={{ color: '#9ca3af', fontSize: '0.75rem', textDecoration: 'line-through' }}>{p.ancien}</span>
                </div>
                <div style={{ color: '#f59e0b', fontSize: '0.8rem' }}>{'★'.repeat(p.avis)}{'☆'.repeat(5 - p.avis)}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BANNIÈRES PROMO */}
      <section style={{ padding: '2rem 5%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {[
          { bg: 'linear-gradient(135deg, #3b0764, #7c3aed)', tag: '🏷️ Offres exclusives', titre: "Jusqu'à -30% sur une sélection !", sub: "Profitez-en avant qu'il n'y en ait plus.", btn: 'Voir les offres', btnColor: '#7c3aed' },
          { bg: 'linear-gradient(135deg, #4c1d95, #a855f7)', tag: '✨ Nouveautés', titre: 'Découvrez les dernières arrivées !', sub: 'Des nouveautés chaque semaine.', btn: 'Voir les nouveautés', btnColor: '#7c3aed' },
          { bg: 'linear-gradient(135deg, #1e3a8a, #3b82f6)', tag: '🚚 Livraison rapide', titre: 'Recevez vos commandes en un temps record.', sub: 'Livraison express disponible.', btn: 'En savoir plus', btnColor: '#1e3a8a' },
        ].map((b, i) => (
          <div key={i} style={{ background: b.bg, borderRadius: '16px', padding: '2rem', color: '#fff' }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>{b.tag}</p>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.5rem' }}>{b.titre}</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '1.2rem' }}>{b.sub}</p>
            <a href="/catalogue" style={{ background: '#fff', color: b.btnColor, padding: '0.6rem 1.2rem', borderRadius: '6px', textDecoration: 'none', fontWeight: '700', fontSize: '0.85rem' }}>{b.btn}</a>
          </div>
        ))}
      </section>

      {/* FOOTER STATS */}
      <div style={{ background: '#0d0d2b', color: '#fff', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', padding: '2rem 5%', gap: '1.5rem', textAlign: 'center' }}>
        {[
          { val: '+10 000', label: 'Clients satisfaits', sub: 'Rejoignez la communauté Assigame' },
          { val: '100%', label: 'Produits authentiques', sub: 'Qualité garantie' },
          { val: '🔒', label: 'Paiement 100% sécurisé', sub: 'Transactions protégées' },
          { val: '🌍', label: 'Livraison partout', sub: 'Rapide et fiable' },
        ].map((s, i) => (
          <div key={i}>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#a78bfa' }}>{s.val}</div>
            <div style={{ fontWeight: '700', fontSize: '0.85rem', marginTop: '0.3rem' }}>{s.label}</div>
            <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{s.sub}</div>
          </div>
        ))}
      </div>

    </div>
  );
}