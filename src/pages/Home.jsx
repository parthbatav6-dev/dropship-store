import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient.js';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  const rest = products.slice(1);

  return (
    <>
      {/* Hero spotlights one real product — a photo doing the work,
          not generic copy. Swap featured.images[0] for a real shot
          once you've got one. */}
      <section className="product-hero grid-texture">
        <div className="product-hero-media">
          <img src={featured.images?.[0] || 'https://placehold.co/700x700'} alt={featured.name} />
        </div>
        <div className="product-hero-copy">
          <p className="eyebrow">{featured.stock_status === 'in_stock' ? 'In stock, ships this week' : featured.stock_status.replace('_', ' ')}</p>
          <h1>{featured.name}</h1>
          {featured.specs && (
            <p className="spec-line">{featured.specs.split('|').map(s => s.trim()).join(' · ')}</p>
          )}
          <p className="hero-price">₹{featured.sell_price}</p>
          <Link to={`/product/${featured.slug}`} className="btn-primary">Shop now</Link>
        </div>
      </section>

      {rest.length > 0 && (
        <>
          <h2 className="section-heading">More for your setup</h2>
          <div className="product-grid">
            {rest.map((p) => (
              <Link to={`/product/${p.slug}`} key={p.id} className="product-card">
                <img src={p.images?.[0] || 'https://placehold.co/400x400'} alt={p.name} />
                <div className="card-body">
                  <p className="product-tag">{p.stock_status === 'in_stock' ? 'In stock' : p.stock_status.replace('_', ' ')}</p>
                  <h3>{p.name}</h3>
                  {p.specs && <p className="spec-line small">{p.specs.split('|').map(s => s.trim()).join(' · ')}</p>}
                  <p className="price">₹{p.sell_price}</p>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
}
