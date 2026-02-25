import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ConfirmModal from '../components/ConfirmModal';
import useModal from '../hooks/useModal';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostsContext';
import { useToast } from '../context/ToastContext';

const CATEGORIES = [
  'Programming', 'WebDev', 'MobileDev', 'DSA', 'Database',
  'AI', 'ML', 'DevOps', 'Cybersecurity', 'SoftwareEng', 'TechNews', 'CareerTips'
];

export default function CreatePost() {
  const { user } = useAuth();
  const { createPost } = usePosts();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { modalProps, showAlert } = useModal();

  const [form, setForm] = useState({ title: '', category: '', content: '', tags: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect immediately if not logged in — no useEffect race condition
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

  const publish = (imageUrl) => {
    const post = {
      id: Date.now(),
      title: form.title.trim(),
      slug: form.title.trim().toLowerCase().replace(/\s+/g, '-'),
      content: form.content.trim(),
      category: form.category,
      tags: form.tags.split(' ').filter(t => t.startsWith('#')),
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
      reader.onload = () => {
        publish(reader.result);
        setLoading(false);
      };
      reader.onerror = () => {
        showAlert({ title: 'Image Error', message: 'Failed to read image file.', type: 'danger' });
        setLoading(false);
      };
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
            <p style={{ color: '#9a9a9a' }}>Share your Computer Science knowledge with the community</p>
          </div>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(135deg, #dc3545, #a71d2a)', padding: '1.25rem 1.75rem' }}>
              <h4 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, margin: 0, color: '#fff' }}>New Post</h4>
            </div>

            <form onSubmit={handleSubmit} noValidate style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              <div>
                <label className="form-label">Post Title *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter post title"
                  value={form.title}
                  onChange={set('title')}
                />
              </div>

              <div>
                <label className="form-label">Category *</label>
                <select
                  className="form-select"
                  value={form.category}
                  onChange={set('category')}
                >
                  <option value="">-- Select Category --</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="form-label">Cover Image</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="preview"
                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginTop: '0.75rem', border: '1px solid var(--border)' }}
                  />
                )}
              </div>

              <div>
                <label className="form-label">Post Content *</label>
                <textarea
                  className="form-control"
                  rows={10}
                  placeholder="Write your article here..."
                  value={form.content}
                  onChange={set('content')}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div>
                <label className="form-label">Tags</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="#WebDev #JavaScript #React"
                  value={form.tags}
                  onChange={set('tags')}
                />
                <p style={{ fontSize: '0.775rem', color: '#9a9a9a', marginTop: '0.35rem' }}>
                  Separate tags with space, each starting with #
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  style={{ borderRadius: '8px', padding: '0.65rem 1.5rem' }}
                  onClick={() => navigate('/')}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-danger"
                  style={{ borderRadius: '8px', padding: '0.65rem 2rem' }}
                  disabled={loading}
                >
                  {loading
                    ? <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Publishing...</>
                    : <><i className="bi bi-send me-2"></i>Publish</>
                  }
                </button>
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