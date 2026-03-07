import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ConfirmModal from '../components/ConfirmModal';
import useModal from '../hooks/useModal';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostsContext';
import { useToast } from '../context/ToastContext';
import { Input, Button, Select, Textarea } from '../components/Base';

const CATEGORIES = [
  'Programming', 'WebDev', 'MobileDev', 'DSA', 'Database',
  'AI', 'ML', 'DevOps', 'Cybersecurity', 'SoftwareEng', 'TechNews', 'CareerTips', 'Other'
];

const emptyRef = () => ({ label: '', url: '' });

export default function CreatePost() {
  const { user } = useAuth();
  const { createPost } = usePosts();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { modalProps, showAlert } = useModal();

  const [form, setForm] = useState({ title: '', category: '', content: '' });
  const [references, setReferences] = useState([emptyRef()]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) return <Navigate to="/login" replace />;

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  // Reference handlers
  const setRef = (idx, field) => (e) => {
    setReferences(prev => prev.map((r, i) => i === idx ? { ...r, [field]: e.target.value } : r));
  };
  const addRef = () => setReferences(prev => [...prev, emptyRef()]);
  const removeRef = (idx) => setReferences(prev => prev.filter((_, i) => i !== idx));

  const publish = (imageUrl) => {
    const validRefs = references.filter(r => r.label.trim() && r.url.trim());
    const post = {
      id: Date.now(),
      title: form.title.trim(),
      slug: form.title.trim().toLowerCase().replace(/\s+/g, '-'),
      content: form.content.trim(),
      category: form.category,
      references: validRefs,
      tags: [],
      image: imageUrl,
      author: {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
      date: new Date().toISOString().split('T')[0],
      bookmarked: false,
      reacted: false,
      likes: 0,
    };
    createPost(post);
    showToast('Post published successfully! 🎉', 'success');
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.category || !form.content.trim()) {
      await showAlert({
        title: 'Missing Fields',
        message: 'Please fill in Title, Category and Content before publishing.',
        type: 'warning',
      });
      return;
    }
    setLoading(true);
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = () => { publish(reader.result); setLoading(false); };
      reader.onerror = () => { showAlert({ title: 'Image Error', message: 'Failed to read image file.', type: 'danger' }); setLoading(false); };
      reader.readAsDataURL(imageFile);
    } else {
      publish('https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800');
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ marginTop: '68px', minHeight: 'calc(100vh - 68px)', padding: '3rem 2rem' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>

          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '2rem', marginBottom: '0.25rem' }}>
              Create <span style={{ color: '#dc3545' }}>Post</span>
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>Share your Computer Science knowledge with the community</p>
          </div>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(135deg, #dc3545, #a71d2a)', padding: '1.25rem 1.75rem' }}>
              <h4 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, margin: 0, color: '#fff' }}>New Post</h4>
            </div>

            <form onSubmit={handleSubmit} noValidate style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              <Input
                label="Post Title *"
                type="text"
                placeholder="Enter post title"
                value={form.title}
                onChange={set('title')}
              />

              <Select
                label="Category *"
                value={form.category}
                onChange={set('category')}
                options={CATEGORIES}
                placeholder="-- Select Category --"
              />

              <div>
                <label className="form-label">Cover Image</label>
                <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} />
                {imagePreview && (
                  <img src={imagePreview} alt="preview" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginTop: '0.75rem', border: '1px solid var(--border)' }} />
                )}
              </div>

              <Textarea
                label="Post Content *"
                rows={10}
                placeholder="Write your article here..."
                value={form.content}
                onChange={set('content')}
              />

              {/* References */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <label className="form-label" style={{ margin: 0 }}>
                    <i className="bi bi-journals me-2" style={{ color: '#dc3545' }}></i>
                    References
                  </label>
                  <button
                    type="button"
                    onClick={addRef}
                    style={{ background: 'rgba(220,53,69,0.1)', border: '1px solid rgba(220,53,69,0.3)', color: '#dc3545', borderRadius: '6px', padding: '0.3rem 0.75rem', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'Syne, sans-serif', fontWeight: 600 }}
                  >
                    <i className="bi bi-plus me-1"></i>Add Reference
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {references.map((ref, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', minWidth: '20px', textAlign: 'center' }}>{idx + 1}.</span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Label (e.g. MDN — CSS Guide)"
                        value={ref.label}
                        onChange={setRef(idx, 'label')}
                        style={{ flex: 1 }}
                      />
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://..."
                        value={ref.url}
                        onChange={setRef(idx, 'url')}
                        style={{ flex: 1.5 }}
                      />
                      {references.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRef(idx)}
                          style={{ background: 'transparent', border: 'none', color: '#dc3545', cursor: 'pointer', padding: '0 0.25rem', fontSize: '1rem' }}
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  Add relevant sources, docs, or articles readers can refer to
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/')}
                  style={{ padding: '0.65rem 1.5rem' }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  style={{ padding: '0.65rem 2rem' }}
                >
                  {loading
                    ? <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Publishing...</>
                    : <><i className="bi bi-send me-2"></i>Publish</>
                  }
                </Button>
              </div>

            </form>
          </div>
        </div>
      </main>

      <ConfirmModal {...modalProps} />
      <Footer />
    </>
  );
}