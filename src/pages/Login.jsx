import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input, Button, Checkbox } from '../components/Base';
import logoImage from '../assets/images/logo/logo.png';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill all fields');
      return;
    }

    const result = login({ email, password });
    if (!result.ok) {
      setError(result.message);
      return;
    }

    // Redirect to the page they tried to visit, or home page
    const from = location.state?.from?.pathname || '/';
    navigate(from, { replace: true });
  };

  return (
    <div className="auth-body">
      <div className="auth-card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src={logoImage} alt="TechRead" style={{ height: '56px', width: 'auto', display: 'block', margin: '0 auto' }} />
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginTop: '1rem', marginBottom: '0.25rem' }}>Welcome back</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sign in to continue 👋</p>
        </div>

        {error && (
          <div className="alert-danger" style={{ padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input
            label="Email address"
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Checkbox label="Remember me" />
            <a href="#" style={{ color: '#dc3545', fontSize: '0.875rem' }}>Forgot password?</a>
          </div>

          <Button
            type="submit"
            fullWidth
            icon="bi bi-box-arrow-in-right"
            style={{ marginTop: '0.5rem' }}
          >
            Login
          </Button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Don't have an account? <Link to="/register" style={{ color: '#dc3545', fontWeight: 600 }}>Register</Link>
        </p>
      </div>
    </div>
  );
}