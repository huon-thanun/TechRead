import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill all fields');
      return;
    }
    login({
      name: 'Huon Thanun',
      email,
      avatar: 'https://ui-avatars.com/api/?name=Huon+Thanun&background=dc3545&color=fff',
    });
    navigate('/');
  };

  return (
    <div className="auth-body">
      <div className="auth-card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '2rem', color: '#dc3545', letterSpacing: '-0.03em' }}>
            Tech<span style={{ color: '#f0ece8' }}>Read</span>
          </span>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginTop: '1rem', marginBottom: '0.25rem' }}>Welcome back</h3>
          <p style={{ color: '#9a9a9a', fontSize: '0.9rem' }}>Sign in to continue 👋</p>
        </div>

        {error && (
          <div className="alert-danger" style={{ padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="example@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9a9a9a', fontSize: '0.875rem', cursor: 'pointer' }}>
              <input type="checkbox" style={{ accentColor: '#dc3545' }} />
              Remember me
            </label>
            <a href="#" style={{ color: '#dc3545', fontSize: '0.875rem' }}>Forgot password?</a>
          </div>

          <button type="submit" className="btn btn-danger" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', marginTop: '0.5rem' }}>
            <i className="bi bi-box-arrow-in-right me-2"></i>Login
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#9a9a9a', fontSize: '0.875rem' }}>
          Don't have an account? <Link to="/register" style={{ color: '#dc3545', fontWeight: 600 }}>Register</Link>
        </p>
      </div>
    </div>
  );
}