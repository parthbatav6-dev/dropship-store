import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { supabase } from '../lib/supabaseClient.js';

const SHIPPING_FEE = 0; // set a flat fee here if you charge one, e.g. 49

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const total = subtotal + SHIPPING_FEE;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handlePay(e) {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);
    setError(null);

    try {
      // 1. Create a pending order in Supabase
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: form.name,
          customer_email: form.email,
          customer_phone: form.phone,
          shipping_address: {
            line1: form.line1, line2: form.line2, city: form.city, state: form.state, pincode: form.pincode,
          },
          subtotal,
          shipping_fee: SHIPPING_FEE,
          total,
          payment_status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      await supabase.from('order_items').insert(
        items.map((i) => ({
          order_id: order.id,
          product_id: i.id,
          product_name: i.name,
          unit_price: i.price,
          quantity: i.quantity,
        }))
      );

      // 2. Ask our Netlify Function to create a Razorpay order (keeps the Razorpay secret key server-side)
      const razorpayOrderRes = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total, orderId: order.id }),
      });
      const razorpayOrder = await razorpayOrderRes.json();
      if (!razorpayOrderRes.ok) throw new Error(razorpayOrder.error || 'Payment setup failed');

      await supabase.from('orders').update({ razorpay_order_id: razorpayOrder.id }).eq('id', order.id);

      // 3. Launch Razorpay checkout
      const rzp = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: 'INR',
        name: 'Your Store',
        order_id: razorpayOrder.id,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        handler: async function (response) {
          // 4. Verify payment server-side
          const verifyRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              dbOrderId: order.id,
            }),
          });
          const result = await verifyRes.json();
          if (result.verified) {
            clearCart();
            navigate('/order-confirmed', { state: { orderId: order.id } });
          } else {
            setError('Payment could not be verified. Contact support with your order ID: ' + order.id);
          }
        },
        modal: {
          ondismiss: function () {
            setSubmitting(false);
          },
        },
      });
      rzp.open();
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return <p className="status-msg">Your cart is empty. <a href="/">Go shopping</a></p>;
  }

  return (
    <form className="checkout-form" onSubmit={handlePay}>
      <h1>Checkout</h1>

      <div className="checkout-summary">
        {items.map((i) => (
          <div key={i.id} className="summary-row">
            <span>{i.name} × {i.quantity}</span>
            <span>₹{(i.price * i.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="summary-row total">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>

      <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
      <input name="phone" type="tel" placeholder="Phone number" value={form.phone} onChange={handleChange} required />
      <input name="line1" placeholder="Address line 1" value={form.line1} onChange={handleChange} required />
      <input name="line2" placeholder="Address line 2 (optional)" value={form.line2} onChange={handleChange} />
      <div className="form-row">
        <input name="city" placeholder="City" value={form.city} onChange={handleChange} required />
        <input name="state" placeholder="State" value={form.state} onChange={handleChange} required />
        <input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} required />
      </div>

      {error && <p className="status-msg error">{error}</p>}

      <button className="btn-primary" type="submit" disabled={submitting}>
        {submitting ? 'Processing…' : `Pay ₹${total.toFixed(2)}`}
      </button>
    </form>
  );
}
