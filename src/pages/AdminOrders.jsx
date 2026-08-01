import { useEffect, useState } from 'react';

const FULFILLMENT_OPTIONS = ['unfulfilled', 'ordered_from_supplier', 'shipped', 'delivered', 'cancelled'];

function OrderRow({ order, password, onUpdated }) {
  const [status, setStatus] = useState(order.fulfillment_status || 'unfulfilled');
  const [tracking, setTracking] = useState(order.tracking_number || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch('/api/admin-update-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ orderId: order.id, fulfillment_status: status, tracking_number: tracking }),
      });
      if (!res.ok) throw new Error('Save failed');
      setSaved(true);
      onUpdated();
      setTimeout(() => setSaved(false), 1500);
    } catch (err) {
      alert('Could not save: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-order-card">
      <div className="admin-order-header">
        <div>
          <p className="admin-order-id">#{order.id.slice(0, 8)}</p>
          <p className="admin-order-date">{new Date(order.created_at).toLocaleString('en-IN')}</p>
        </div>
        <div className="admin-order-total">₹{order.total}</div>
      </div>

      <div className="admin-order-customer">
        <p><strong>{order.customer_name}</strong> · {order.customer_phone}</p>
        <p>{order.customer_email}</p>
        <p>
          {order.shipping_address?.line1}, {order.shipping_address?.line2 ? order.shipping_address.line2 + ', ' : ''}
          {order.shipping_address?.city}, {order.shipping_address?.state} - {order.shipping_address?.pincode}
        </p>
      </div>

      <ul className="admin-order-items">
        {order.order_items?.map((item) => (
          <li key={item.id}>{item.product_name} × {item.quantity} — ₹{item.unit_price}</li>
        ))}
      </ul>

      <div className="admin-order-badges">
        <span className={`admin-badge payment-${order.payment_status}`}>{order.payment_status}</span>
      </div>

      <div className="admin-order-controls">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          {FULFILLMENT_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt.replace(/_/g, ' ')}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Tracking number"
          value={tracking}
          onChange={(e) => setTracking(e.target.value)}
        />
        <button className="btn-primary" onClick={handleSave} disabled={saving}>
          {saved ? 'Saved ✓' : saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  );
}

export default function AdminOrders() {
  const [password, setPassword] = useState(() => sessionStorage.getItem('pawrig_admin_pw') || '');
  const [inputPassword, setInputPassword] = useState('');
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fetchOrders(pw) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin-orders', {
        headers: { 'x-admin-password': pw },
      });
      if (!res.ok) {
        if (res.status === 401) throw new Error('Wrong password');
        throw new Error('Could not load orders');
      }
      const data = await res.json();
      setOrders(data.orders);
      sessionStorage.setItem('pawrig_admin_pw', pw);
      setPassword(pw);
    } catch (err) {
      setError(err.message);
      setOrders(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (password) fetchOrders(password);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!orders) {
    return (
      <div className="admin-login">
        <h1>Admin</h1>
        <input
          type="password"
          placeholder="Password"
          value={inputPassword}
          onChange={(e) => setInputPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchOrders(inputPassword)}
        />
        <button className="btn-primary" onClick={() => fetchOrders(inputPassword)} disabled={loading}>
          {loading ? 'Checking…' : 'Enter'}
        </button>
        {error && <p className="status-msg error">{error}</p>}
      </div>
    );
  }

  return (
    <div className="admin-orders">
      <div className="admin-orders-header">
        <h1>Orders ({orders.length})</h1>
        <button className="btn-secondary" onClick={() => fetchOrders(password)}>Refresh</button>
      </div>
      {orders.length === 0 && <p className="status-msg">No orders yet.</p>}
      {orders.map((order) => (
        <OrderRow key={order.id} order={order} password={password} onUpdated={() => fetchOrders(password)} />
      ))}
    </div>
  );
}
