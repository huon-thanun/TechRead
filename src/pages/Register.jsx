import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input, Button, Checkbox } from '../components/Base';
import logoImage from '../assets/images/logo/logo.png';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState('');

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError('All fields are required'); return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match'); return;
    }
    if (!terms) {
      setError('You must accept the terms'); return;
    }

    const result = register({
      name: form.name,
      email: form.email,
      password: form.password,
    });
    if (!result.ok) {
      setError(result.message);
      return;
    }

    navigate('/');
  };

  return (
    <div className="auth-body">
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '460px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src={logoImage} alt="TechRead" style={{ height: '56px', width: 'auto', display: 'block', margin: '0 auto' }} />
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginTop: '1rem', marginBottom: '0.25rem' }}>Create Account</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Join TechRead and start sharing 🚀</p>
        </div>

        {error && (
          <div className="alert-danger" style={{ padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input
            label="Full name"
            type="text"
            placeholder="Your name"
            value={form.name}
            onChange={set('name')}
            required
          />

          <Input
            label="Email address"
            type="email"
            placeholder="example@email.com"
            value={form.email}
            onChange={set('email')}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="Minimum 6 characters"
            value={form.password}
            onChange={set('password')}
            minLength={6}
            required
          />

          <Input
            label="Confirm password"
            type="password"
            placeholder="Repeat password"
            value={form.confirmPassword}
            onChange={set('confirmPassword')}
            required
          />

          <Checkbox
            checked={terms}
            onChange={e => setTerms(e.target.checked)}
            label={
              <>
                I agree to the <a href="#" style={{ color: '#dc3545' }}>Terms & Conditions</a>
              </>
            }
          />

          <Button
            type="submit"
            fullWidth
            icon="bi bi-person-plus"
            style={{ marginTop: '0.5rem' }}
          >
            Register
          </Button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Already have an account? <Link to="/login" style={{ color: '#dc3545', fontWeight: 600 }}>Login</Link>
        </p>
      </div>
    </div>
  );
}