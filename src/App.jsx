import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home.jsx';
import ProductPage from './pages/ProductPage.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderConfirmation from './pages/OrderConfirmation.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import Logo from './components/Logo.jsx';
import { useCart } from './context/CartContext.jsx';

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <div className="app-shell">
      <div className="trust-bar">Free shipping on orders over ₹999 · Ships in 5–7 business days</div>
      <header className="site-header">
        <Link to="/" className="brand-lockup">
          <Logo />
        </Link>
        <button className="cart-toggle" onClick={() => setCartOpen(true)}>
          Cart {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
        </button>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmed" element={<OrderConfirmation />} />
        </Routes>
      </main>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
