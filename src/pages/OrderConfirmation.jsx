import { useLocation, Link } from 'react-router-dom';

export default function OrderConfirmation() {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="order-confirmation">
      <h1>Order confirmed 🎉</h1>
      {orderId && <p>Your order ID is <strong>{orderId}</strong>. Save this for reference.</p>}
      <p>We'll email you once it ships.</p>
      <Link to="/" className="btn-primary">Continue shopping</Link>
    </div>
  );
}
