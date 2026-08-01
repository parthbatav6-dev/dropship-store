import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient.js';
import { useCart } from '../context/CartContext.jsx';
import FAQ from '../components/FAQ.jsx';
import TrustBadges from '../components/TrustBadges.jsx';

export default function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    async function fetchProduct() {
      const { data } = await supabase.from('products').select('*').eq('slug', slug).single();
      setProduct(data);
      setActiveImage(0);
      setLoading(false);
    }
    fetchProduct();
  }, [slug]);

  if (loading) return <p className="status-msg">Loading…</p>;
  if (!product) return <p className="status-msg">Product not found.</p>;

  function handleAdd() {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <>
      <div className="product-detail">
        <div className="product-gallery">
          <img
            className="gallery-main"
            src={product.images?.[activeImage] || 'https://placehold.co/600x600'}
            alt={product.name}
          />
          {product.images && product.images.length > 1 && (
            <div className="gallery-thumbs">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  className={`gallery-thumb ${i === activeImage ? 'active' : ''}`}
                  onClick={() => setActiveImage(i)}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="product-info">
          {product.spec_code && <p className="spec-badge">[{product.spec_code}]</p>}
          <h1>{product.name}</h1>
          {product.specs && (
            <p className="spec-line">{product.specs.split('|').map(s => s.trim()).join(' · ')}</p>
          )}
          <p className="price">₹{product.sell_price}</p>
          <p className="description">{product.description}</p>

          {product.stock_status === 'out_of_stock' ? (
            <p className="status-msg error">Out of stock</p>
          ) : (
            <>
              <div className="qty-row">
                <label>Qty</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                />
              </div>
              <button className="btn-primary" onClick={handleAdd}>
                {added ? 'Added ✓' : 'Add to cart'}
              </button>
              <button className="btn-secondary" onClick={() => { addItem(product, quantity); navigate('/checkout'); }}>
                Buy now
              </button>
            </>
          )}

          <TrustBadges />
        </div>
      </div>

      <FAQ />
    </>
  );
}
