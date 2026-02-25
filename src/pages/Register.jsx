import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState('');

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError('All fields are required'); return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match'); return;
    }
    if (!terms) {
      setError('You must accept the terms'); return;
    }
    login({ name: form.name, email: form.email, avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name)}&background=dc3545&color=fff` });
    navigate('/');
  };

  return (
    <div className="auth-body">
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '460px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '2rem', color: '#dc3545', letterSpacing: '-0.03em' }}>
            Tech<span style={{ color: '#f0ece8' }}>Read</span>
          </span>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginTop: '1rem', marginBottom: '0.25rem' }}>Create Account</h3>
          <p style={{ color: '#9a9a9a', fontSize: '0.9rem' }}>Join TechRead and start sharing 🚀</p>
        </div>

        {error && (
          <div className="alert-danger" style={{ padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="form-label">Full name</label>
            <input type="text" className="form-control" placeholder="Your name" value={form.name} onChange={set('name')} required />
          </div>
          <div>
            <label className="form-label">Email address</label>
            <input type="email" className="form-control" placeholder="example@email.com" value={form.email} onChange={set('email')} required />
          </div>
          <div>
            <label className="form-label">Password</label>
            <input type="password" className="form-control" placeholder="Minimum 6 characters" minLength={6} value={form.password} onChange={set('password')} required />
          </div>
          <div>
            <label className="form-label">Confirm password</label>
            <input type="password" className="form-control" placeholder="Repeat password" value={form.confirmPassword} onChange={set('confirmPassword')} required />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9a9a9a', fontSize: '0.875rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} style={{ accentColor: '#dc3545' }} />
            I agree to the <a href="#" style={{ color: '#dc3545' }}>Terms & Conditions</a>
          </label>

          <button type="submit" className="btn btn-danger" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', marginTop: '0.5rem' }}>
            <i className="bi bi-person-plus me-2"></i>Register
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#9a9a9a', fontSize: '0.875rem' }}>
          Already have an account? <Link to="/login" style={{ color: '#dc3545', fontWeight: 600 }}>Login</Link>
        </p>
      </div>
    </div>
  );
}