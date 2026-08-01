import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-col">
          <p className="footer-brand">PAWRIG</p>
          <p className="footer-blurb">Practical, tested accessories for your dog or cat. No gimmicks, no overclaiming — just gear that does what it says.</p>
        </div>

        <div className="footer-col">
          <p className="footer-heading">Shop</p>
          <Link to="/?category=grooming">Grooming</Link>
          <Link to="/?category=safety">Safety</Link>
        </div>

        <div className="footer-col">
          <p className="footer-heading">Policies</p>
          <Link to="/shipping">Shipping</Link>
          <Link to="/returns">Returns &amp; Refunds</Link>
          <Link to="/contact">Contact Us</Link>
        </div>

        <div className="footer-col">
          <p className="footer-heading">Payments</p>
          <p className="footer-note">Secure checkout powered by Razorpay. Cards, UPI, and net banking accepted.</p>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} PawRig. All rights reserved.</span>
      </div>
    </footer>
  );
}
