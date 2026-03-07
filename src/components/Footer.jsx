import { Link } from 'react-router-dom';
import logoImage from '../assets/logo/logo.png';

export default function Footer() {
  return (
    <footer style={{ padding: '3rem 0', marginTop: '4rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem' }}>
          {/* Brand */}
          <div className='text-center'>
            <img src={logoImage} alt="TechRead" style={{ height: '44px', width: 'auto', display: 'block', margin: '0 auto' }} />
            <p className="foot-text" style={{ marginTop: '1rem' }}>
              A social knowledge-sharing platform for Computer Science learners and developers.
            </p>
          </div>

          {/* About */}
          <div className='text-center'>
            <h6 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.8rem' }}>Platform</h6>
            <p className="foot-text">
              Users can publish articles, explore coding tutorials, and discuss modern tech topics. Admins manage content to ensure quality and a safe learning environment.
            </p>
          </div>

          {/* Quick Links */}
          <div className='text-center'>
            <h6 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.8rem' }}>Quick Links</h6>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><Link to="/" className="foot-link"><i className="bi bi-house-fill me-2"></i>Home</Link></li>
              <li><Link to="/about" className="foot-link"><i className="bi bi-layers-fill me-2"></i>About</Link></li>
              <li><Link to="/report" className="foot-link"><i className="bi bi-mailbox2-flag me-2"></i>Report</Link></li>
            </ul>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(220,53,69,0.15)', marginTop: '2.5rem', paddingTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: '#5a5a5a', fontSize: '0.8rem', margin: 0 }}>
            © 2026 TechRead — Built by <span style={{ color: '#dc3545' }}>Huon Thanun</span>
          </p>
        </div>
      </div>
    </footer>
  );
}