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

  return (
    <div className="product-grid">
      {products.map((p) => (
        <Link to={`/product/${p.slug}`} key={p.id} className="product-card">
          <img src={p.images?.[0] || 'https://placehold.co/400x400'} alt={p.name} />
          <h3>{p.name}</h3>
          <p className="price">₹{p.sell_price}</p>
        </Link>
      ))}
    </div>
  );
}
