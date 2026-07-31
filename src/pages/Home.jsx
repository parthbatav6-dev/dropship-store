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

  return (
    <>
      <section className="store-hero grid-texture">
        <p className="eyebrow">Desk &amp; home upgrades</p>
        <h1>Small changes to your space, worth noticing.</h1>
        <p>Practical, well-made pieces for the desk and the room around it — picked for what they actually fix, not just how they look in a photo.</p>
      </section>

      {loading && <p className="status-msg">Loading products…</p>}
      {error && <p className="status-msg error">Couldn't load products: {error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className="status-msg">No products yet. Add some in Supabase.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="product-grid">
          {products.map((p) => (
            <Link to={`/product/${p.slug}`} key={p.id} className="product-card">
              <img src={p.images?.[0] || 'https://placehold.co/400x400'} alt={p.name} />
              <div className="card-body">
                <p className="product-tag">{p.stock_status === 'in_stock' ? 'In stock' : p.stock_status.replace('_', ' ')}</p>
                <h3>{p.name}</h3>
                <p className="price">₹{p.sell_price}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
