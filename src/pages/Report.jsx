import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Report() {
  const [form, setForm] = useState({ name: '', email: '', type: '', description: '' });
  const [submitted, setSubmitted] = useState(false);

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', type: '', description: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <>
      <Navbar />
      <main className="report-section">
        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '0 2rem', width: '100%' }}>
          {submitted && (
            <div style={{ background: 'rgba(25,135,84,0.15)', border: '1px solid rgba(25,135,84,0.4)', color: '#6ee7b7', borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <i className="bi bi-check-circle-fill"></i>
              Thank you! Your report has been submitted successfully.
            </div>
          )}

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(135deg, #dc3545, #a71d2a)', padding: '1.5rem 1.75rem', textAlign: 'center' }}>
              <div style={{ width: '52px', height: '52px', background: 'rgba(255,255,255,0.15)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                <i className="bi bi-mailbox2-flag" style={{ fontSize: '1.5rem', color: '#fff' }}></i>
              </div>
              <h4 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#fff', margin: '0 0 0.25rem' }}>Report an Issue</h4>
              <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '0.875rem' }}>Let us know if you find any inappropriate content or bugs</p>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div>
                  <label className="form-label">Your Name</label>
                  <input type="text" className="form-control" placeholder="Enter your name" value={form.name} onChange={set('name')} required />
                </div>
                <div>
                  <label className="form-label">Your Email</label>
                  <input type="email" className="form-control" placeholder="Enter your email" value={form.email} onChange={set('email')} required />
                </div>
              </div>

              <div>
                <label className="form-label">Report Type</label>
                <select className="form-select" value={form.type} onChange={set('type')} required>
                  <option value="">-- Select Type --</option>
                  <option value="Bug">Bug</option>
                  <option value="Inappropriate Content">Inappropriate Content</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows={6}
                  placeholder="Describe the issue in detail..."
                  value={form.description}
                  onChange={set('description')}
                  required
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ textAlign: 'center' }}>
                <button type="submit" className="btn btn-danger" style={{ padding: '0.75rem 3rem', borderRadius: '8px', fontSize: '1rem' }}>
                  <i className="bi bi-send me-2"></i>Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}