import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient.js';
import TrustBadges from '../components/TrustBadges.jsx';

function OurPromise() {
  const promises = [
    { title: 'Real specs, no overclaiming', body: 'We describe what a product actually does — not inflated marketing claims.' },
    { title: 'Secure checkout', body: 'Payments run through Razorpay. We never see or store your card details.' },
    { title: 'Straightforward support', body: "Questions or issues after delivery? We're a message away, not a maze of chatbots." },
  ];

  return (
    <section className="our-promise">
      <h2 className="section-heading">Our promise</h2>
      <div className="promise-grid">
        {promises.map((p) => (
          <div className="promise-card" key={p.title}>
            <h3>{p.title}</h3>
            <p>{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProductCard({ p }) {
  return (
    <Link to={`/product/${p.slug}`} className="product-card">
      <img src={p.images?.[0] || 'https://placehold.co/400x400'} alt={p.name} />
      <div className="card-body">
        {p.spec_code && <p className="spec-badge">[{p.spec_code}]</p>}
        <h3>{p.name}</h3>
        {p.specs && <p className="spec-line small">{p.specs.split('|').map(s => s.trim()).join(' · ')}</p>}
        <p className="price">₹{p.sell_price}</p>
      </div>
    </Link>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) setError(error.message);
      else setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  if (loading) return <p className="status-msg">Loading products…</p>;
  if (error) return <p className="status-msg error">Couldn't load products: {error}</p>;
  if (products.length === 0) return <p className="status-msg">No products yet. Add some in Supabase.</p>;

  const featured = products[0];
  const grooming = products.filter((p) => p.category === 'grooming' && p.id !== featured.id);
  const safety = products.filter((p) => p.category === 'safety' && p.id !== featured.id);
  const other = products.filter((p) => (!p.category || (p.category !== 'grooming' && p.category !== 'safety')) && p.id !== featured.id);

  // If a category link was clicked, jump straight to that section's products
  if (categoryFilter === 'grooming') {
    return (
      <>
        <h2 className="section-heading">Grooming</h2>
        <div className="product-grid">{grooming.map((p) => <ProductCard p={p} key={p.id} />)}</div>
      </>
    );
  }
  if (categoryFilter === 'safety') {
    return (
      <>
        <h2 className="section-heading">Safety</h2>
        <div className="product-grid">{safety.map((p) => <ProductCard p={p} key={p.id} />)}</div>
      </>
    );
  }

  return (
    <>
      {/* Hero spotlights one real product — swap featured.images[0] for a
          real photo once you've got one. */}
      <section className="product-hero grid-texture">
        <div className="product-hero-media">
          <img src={featured.images?.[0] || 'https://placehold.co/700x700'} alt={featured.name} />
        </div>
        <div className="product-hero-copy">
          <p className="eyebrow">Engineered pet gear.</p>
          <h1>{featured.name}</h1>
          {featured.specs && (
            <p className="spec-line">{featured.specs.split('|').map(s => s.trim()).join(' · ')}</p>
          )}
          <p className="hero-price">₹{featured.sell_price}</p>
          <Link to={`/product/${featured.slug}`} className="btn-primary">Shop now</Link>
        </div>
      </section>

      <TrustBadges />
      <OurPromise />

      {grooming.length > 0 && (
        <>
          <h2 className="section-heading">Grooming</h2>
          <div className="product-grid">{grooming.map((p) => <ProductCard p={p} key={p.id} />)}</div>
        </>
      )}

      {safety.length > 0 && (
        <>
          <h2 className="section-heading">Safety</h2>
          <div className="product-grid">{safety.map((p) => <ProductCard p={p} key={p.id} />)}</div>
        </>
      )}

      {other.length > 0 && (
        <>
          <h2 className="section-heading">More</h2>
          <div className="product-grid">{other.map((p) => <ProductCard p={p} key={p.id} />)}</div>
        </>
      )}
    </>
  );
}
