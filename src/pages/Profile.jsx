import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ConfirmModal from '../components/ConfirmModal';
import useModal from '../hooks/useModal';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostsContext';
import { useToast } from '../context/ToastContext';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=User&background=dc3545&color=fff';
const CATEGORIES = ['Programming','WebDev','MobileDev','DSA','Database','AI','ML','DevOps','Cybersecurity','SoftwareEng','TechNews','CareerTips'];

function MiniCard({ post, onReact, onBookmark, showActions, onEdit, onDelete, navigate }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div
        className="blog-card"
        style={{ display: 'flex', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer', position: 'relative' }}
        onClick={() => navigate(`/blog/${post.slug}`)}
      >
        <img src={post.image} alt={post.title} style={{ width: '140px', height: '120px', objectFit: 'cover', flexShrink: 0 }} />
        <div style={{ padding: '0.85rem 1rem', flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h6 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, margin: '0 0 0.3rem', fontSize: '0.95rem' }}>{post.title}</h6>
            {showActions && (
              <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '0.5rem', flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                <button className="btn" style={{ padding: '0 0.4rem', color: '#9a9a9a', fontSize: '0.8rem' }} onClick={() => onEdit(post)}>
                  <i className="bi bi-pencil"></i>
                </button>
                <button className="btn" style={{ padding: '0 0.4rem', color: '#dc3545', fontSize: '0.8rem' }} onClick={() => onDelete(post.id)}>
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            )}
          </div>
          <p style={{ color: '#9a9a9a', fontSize: '0.78rem', margin: '0 0 0.5rem' }}>{post.content.slice(0, 100)}...</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} onClick={e => e.stopPropagation()}>
            <span className="tag-badge">{post.category}</span>
            <span style={{ color: '#9a9a9a', fontSize: '0.75rem' }}>{post.date}</span>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <span style={{ color: '#dc3545', fontSize: '0.8rem', cursor: 'pointer' }} onClick={() => onReact(post)}>
                <i className={`bi ${post.reacted ? 'bi-emoji-heart-eyes-fill' : 'bi-emoji-heart-eyes'} me-1`}></i>{post.reactionCount}
              </span>
              <i
                className={`bi ${post.bookmarked ? 'bi-bookmark-fill' : 'bi-bookmark'}`}
                style={{ color: '#dc3545', cursor: 'pointer', fontSize: '0.85rem' }}
                onClick={() => onBookmark(post)}
              ></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const { allPosts, userPosts, bookmarks, toggleBookmark, toggleReaction, updatePost, deletePost, updateUserPosts } = usePosts();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { modalProps, showAlert, showConfirm } = useModal();

  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);

  const [editPostData, setEditPostData] = useState(null);
  const [editPostForm, setEditPostForm] = useState({ title: '', category: '', content: '', tags: '' });
  const [editImageFile, setEditImageFile] = useState(null);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user]);

  if (!user) return null;

  
  const myPosts = userPosts
    .filter(p => p.author.email === user.email)
    .map(p => ({ ...p, bookmarked: bookmarks[p.id] || false, reacted: false }))
    .sort((a, b) => b.id - a.id);
  const bookmarkedPosts = allPosts.filter(p => bookmarks[p.id]).sort((a, b) => b.id - a.id);

  const handleLogout = async () => {
    const yes = await showConfirm({
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      type: 'warning',
      confirmText: 'Logout',
      cancelText: 'Stay',
    });
    if (yes) { logout(); navigate('/'); }
  };

  const handleShowEditForm = () => {
    setEditForm({ name: user.name, email: user.email });
    setAvatarPreview(user.avatar || '');
    setShowEdit(true);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    if (!editForm.name || !editForm.email) {
      showAlert({ title: 'Missing Fields', message: 'Please fill in all fields.', type: 'warning' });
      return;
    }
    const save = (avatar) => {
      const updated = { ...user, name: editForm.name, email: editForm.email, avatar: avatar || user.avatar };
      updateUser(updated);
      updateUserPosts(updated);
      setShowEdit(false);
      showToast('Profile updated successfully!', 'success');
    };
    if (avatarFile) {
      const reader = new FileReader();
      reader.onload = () => save(reader.result);
      reader.readAsDataURL(avatarFile);
    } else {
      save(null);
    }
  };

  const handleEditPost = (post) => {
    setEditPostData(post);
    setEditPostForm({ title: post.title, category: post.category, content: post.content, tags: post.tags?.join(' ') || '' });
    setEditImageFile(null);
  };

  const handleSaveEditPost = async () => {
    if (!editPostForm.title || !editPostForm.category || !editPostForm.content) {
      await showAlert({ title: 'Missing Fields', message: 'Please fill all required fields.', type: 'warning' });
      return;
    }
    const tags = editPostForm.tags.split(' ').filter(t => t.trim().startsWith('#'));
    const save = (img) => {
      updatePost(editPostData.id, {
        title: editPostForm.title,
        slug: editPostForm.title.toLowerCase().replace(/\s+/g, '-'),
        category: editPostForm.category,
        content: editPostForm.content,
        tags,
        ...(img ? { image: img } : {}),
      });
      setEditPostData(null);
      showToast('Post updated!', 'success');
    };
    if (editImageFile) {
      const reader = new FileReader();
      reader.onload = () => save(reader.result);
      reader.readAsDataURL(editImageFile);
    } else {
      save(null);
    }
  };

  const handleDeletePost = async (postId) => {
    const yes = await showConfirm({
      title: 'Delete Post',
      message: 'Are you sure you want to delete this post? This action cannot be undone.',
      type: 'danger',
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });
    if (yes) {
      deletePost(postId);
      showToast('Post deleted', 'danger');
    }
  };

  const handleReact = (post) => toggleReaction(post.id, post.reactionCount);
  const handleBookmark = (post) => {
    toggleBookmark(post.id);
    showToast(post.bookmarked ? `Removed: "${post.title}"` : `Bookmarked: "${post.title}"`, post.bookmarked ? 'danger' : 'success');
  };

  return (
    <>
      <Navbar />
      <main style={{ marginTop: '68px', minHeight: 'calc(100vh - 68px)', padding: '3rem 2rem' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>

          {/* Profile Card */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.75rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <img
                src={user.avatar || DEFAULT_AVATAR}
                alt="avatar"
                style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #dc3545', cursor: 'pointer' }}
                onClick={handleShowEditForm}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={handleShowEditForm}>
                  <h4 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, margin: 0 }}>{user.name}</h4>
                  <i className="bi bi-pencil" style={{ color: '#9a9a9a', fontSize: '0.85rem' }}></i>
                </div>
                <p style={{ color: '#9a9a9a', margin: 0, fontSize: '0.875rem', cursor: 'pointer' }} onClick={handleShowEditForm}>{user.email}</p>
              </div>
              <button className="btn btn-danger" style={{ borderRadius: '8px' }} onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2"></i>Logout
              </button>
            </div>

            {showEdit && (
              <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label className="form-label">Avatar</label>
                    <input type="file" className="form-control" accept="image/*" onChange={handleAvatarChange} />
                    {avatarPreview && (
                      <img src={avatarPreview} alt="preview" style={{ width: '60px', height: '60px', borderRadius: '50%', marginTop: '0.5rem', objectFit: 'cover' }} />
                    )}
                  </div>
                  <div>
                    <label className="form-label">Username</label>
                    <input type="text" className="form-control" value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={editForm.email} onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))} />
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="btn btn-danger" style={{ borderRadius: '8px' }} onClick={handleSaveProfile}>
                      <i className="bi bi-check-circle me-2"></i>Save
                    </button>
                    <button className="btn btn-outline-danger" style={{ borderRadius: '8px' }} onClick={() => setShowEdit(false)}>
                      <i className="bi bi-x-circle me-2"></i>Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* My Posts */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h5 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: '1rem', color: '#dc3545' }}>
              <i className="bi bi-pencil-square me-2"></i>My Posts ({myPosts.length})
            </h5>
            {myPosts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#9a9a9a', border: '1px dashed var(--border)', borderRadius: '12px' }}>
                <i className="bi bi-journal-plus" style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}></i>
                No posts yet. <Link to="/create-post" style={{ color: '#dc3545' }}>Create your first post</Link>
              </div>
            ) : (
              myPosts.map(post => (
                <MiniCard key={post.id} post={post} onReact={handleReact} onBookmark={handleBookmark}
                  showActions onEdit={handleEditPost} onDelete={handleDeletePost} navigate={navigate} />
              ))
            )}
          </section>

          {/* Bookmarks */}
          <section>
            <h5 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: '1rem', color: '#dc3545' }}>
              <i className="bi bi-bookmark-heart-fill me-2"></i>Bookmarked ({bookmarkedPosts.length})
            </h5>
            {bookmarkedPosts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#9a9a9a', border: '1px dashed var(--border)', borderRadius: '12px' }}>
                <i className="bi bi-bookmark" style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}></i>
                No bookmarks yet. Start saving posts you like!
              </div>
            ) : (
              bookmarkedPosts.map(post => (
                <MiniCard key={post.id} post={post} onReact={handleReact} onBookmark={handleBookmark}
                  showActions={false} navigate={navigate} />
              ))
            )}
          </section>
        </div>
      </main>

      {/* Edit Post Modal */}
      {editPostData && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', width: '100%', maxWidth: '680px', maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ background: 'linear-gradient(135deg, #dc3545, #a71d2a)', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h5 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, margin: 0, color: '#fff' }}>Edit Post</h5>
              <button onClick={() => setEditPostData(null)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.25rem', cursor: 'pointer' }}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Post Title</label>
                <input type="text" className="form-control" value={editPostForm.title} onChange={e => setEditPostForm(p => ({ ...p, title: e.target.value }))} />
              </div>
              <div>
                <label className="form-label">Category</label>
                <select className="form-select" value={editPostForm.category} onChange={e => setEditPostForm(p => ({ ...p, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Cover Image</label>
                <input type="file" className="form-control" accept="image/*" onChange={e => setEditImageFile(e.target.files[0])} />
              </div>
              <div>
                <label className="form-label">Content</label>
                <textarea className="form-control" rows={8} value={editPostForm.content} onChange={e => setEditPostForm(p => ({ ...p, content: e.target.value }))} style={{ resize: 'vertical' }} />
              </div>
              <div>
                <label className="form-label">Tags</label>
                <input type="text" className="form-control" value={editPostForm.tags} onChange={e => setEditPostForm(p => ({ ...p, tags: e.target.value }))} />
              </div>
            </div>
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button className="btn btn-outline-danger" style={{ borderRadius: '8px' }} onClick={() => setEditPostData(null)}>Cancel</button>
              <button className="btn btn-danger" style={{ borderRadius: '8px' }} onClick={handleSaveEditPost}>
                <i className="bi bi-check-circle me-2"></i>Update Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm/Alert Modal */}
      <ConfirmModal {...modalProps} />

      <Footer />
    </>
  );
}