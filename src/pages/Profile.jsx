import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProfileHeader from '../components/ProfileHeader';
import PostCard from '../components/PostCard';
import ConfirmModal from '../components/ConfirmModal';
import useModal from '../hooks/useModal';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostsContext';
import { useToast } from '../context/ToastContext';

const CATEGORIES = ['Programming','WebDev','MobileDev','DSA','Database','AI','ML','DevOps','Cybersecurity','SoftwareEng','TechNews','CareerTips'];
const emptyRef = () => ({ label: '', url: '' });

const TABS = [
  { key: 'posts',     label: 'My Posts',   icon: 'bi-pencil-square' },
  { key: 'bookmarks', label: 'Bookmarked', icon: 'bi-bookmark-heart-fill' },
];

export default function Profile() {
  const { user, logout, updateUser }                                                        = useAuth();
  const { allPosts, userPosts, bookmarks, reactionCounts,
          updatePost, deletePost, updateUserPosts }                              = usePosts();
  const { showToast }                                                                       = useToast();
  const navigate                                                                            = useNavigate();
  const { modalProps, showAlert, showConfirm }                                              = useModal();

  // ── Active sidebar tab ──
  const [activeTab, setActiveTab] = useState('posts');

  // ── Profile edit ──
  const [showEdit,      setShowEdit]      = useState(false);
  const [editForm,      setEditForm]      = useState({ name: '', email: '' });
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarFile,    setAvatarFile]    = useState(null);

  // ── Edit post modal ──
  const [editPostData,  setEditPostData]  = useState(null);
  const [editPostForm,  setEditPostForm]  = useState({ title: '', category: '', content: '' });
  const [editRefs,      setEditRefs]      = useState([emptyRef()]);
  const [editImageFile, setEditImageFile] = useState(null);

  useEffect(() => { if (!user) navigate('/login'); }, [user]);
  if (!user) return null;

  // ── Derived ──
  const myPosts = userPosts
    .filter(p => p.author?.email === user.email)
    .sort((a, b) => b.id - a.id);

  const bookmarkedPosts = allPosts
    .filter(p => bookmarks[p.id])
    .sort((a, b) => b.id - a.id);

  const totalReactions = myPosts.reduce((sum, p) =>
    sum + (reactionCounts[p.id] !== undefined ? reactionCounts[p.id] : (p.likes || 0)), 0);

  const stats = [
    { label: 'Posts',      value: myPosts.length },
    { label: 'Reactions',  value: totalReactions },
    { label: 'Bookmarks',  value: bookmarkedPosts.length },
    { label: 'Categories', value: [...new Set(myPosts.map(p => p.category))].length },
  ];

  // ── Profile handlers ──
  const handleShowEdit = () => {
    setEditForm({ name: user.name, email: user.email });
    setAvatarPreview(user.avatar || '');
    setShowEdit(true);
  };
  const handleAvatarChange = (e) => {
    const file = e.target.files[0]; if (!file) return;
    setAvatarFile(file);
    const r = new FileReader();
    r.onload = () => setAvatarPreview(r.result);
    r.readAsDataURL(file);
  };
  const handleSaveProfile = () => {
    if (!editForm.name || !editForm.email) {
      showAlert({ title: 'Missing Fields', message: 'Please fill in all fields.', type: 'warning' }); return;
    }
    const save = (avatar) => {
      const updated = { ...user, name: editForm.name, email: editForm.email, avatar: avatar || user.avatar };
      updateUser(updated); updateUserPosts(updated);
      setShowEdit(false); showToast('Profile updated!', 'success');
    };
    if (avatarFile) { const r = new FileReader(); r.onload = () => save(r.result); r.readAsDataURL(avatarFile); }
    else save(null);
  };
  const handleLogout = async () => {
    const yes = await showConfirm({ title: 'Logout', message: 'Are you sure you want to logout?', type: 'warning', confirmText: 'Logout', cancelText: 'Stay' });
    if (yes) { logout(); navigate('/'); }
  };

  // ── Post edit handlers ──
  const handleEditPost = (post) => {
    setEditPostData(post);
    setEditPostForm({ title: post.title, category: post.category, content: post.content });
    setEditRefs(post.references?.length ? post.references.map(r => ({ ...r })) : [emptyRef()]);
    setEditImageFile(null);
  };
  const setEditRef    = (idx, field) => (e) => setEditRefs(prev => prev.map((r, i) => i === idx ? { ...r, [field]: e.target.value } : r));
  const addEditRef    = () => setEditRefs(prev => [...prev, emptyRef()]);
  const removeEditRef = (idx) => setEditRefs(prev => prev.filter((_, i) => i !== idx));

  const handleSaveEditPost = async () => {
    if (!editPostForm.title || !editPostForm.category || !editPostForm.content) {
      await showAlert({ title: 'Missing Fields', message: 'Please fill all required fields.', type: 'warning' }); return;
    }
    const validRefs = editRefs.filter(r => r.label.trim() && r.url.trim());
    const save = (img) => {
      updatePost(editPostData.id, {
        title: editPostForm.title, slug: editPostForm.title.toLowerCase().replace(/\s+/g, '-'),
        category: editPostForm.category, content: editPostForm.content, references: validRefs,
        ...(img ? { image: img } : {}),
      });
      setEditPostData(null); showToast('Post updated!', 'success');
    };
    if (editImageFile) { const r = new FileReader(); r.onload = () => save(r.result); r.readAsDataURL(editImageFile); }
    else save(null);
  };
  const handleDeletePost = async (postId) => {
    const yes = await showConfirm({ title: 'Delete Post', message: 'This cannot be undone.', type: 'danger', confirmText: 'Delete', cancelText: 'Cancel' });
    if (yes) { deletePost(postId); showToast('Post deleted', 'danger'); }
  };

  // ── Edit form passed to ProfileHeader ──
  const editFormJSX = showEdit ? (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <div>
        <label className="form-label">Avatar</label>
        <input type="file" className="form-control" accept="image/*" onChange={handleAvatarChange} />
        {avatarPreview && <img src={avatarPreview} alt="preview" style={{ width: '56px', height: '56px', borderRadius: '50%', marginTop: '0.5rem', objectFit: 'cover', border: '2px solid #dc3545' }} />}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label className="form-label">Username</label>
          <input type="text" className="form-control" value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} />
        </div>
        <div>
          <label className="form-label">Email</label>
          <input type="email" className="form-control" value={editForm.email} onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button className="btn btn-danger" style={{ borderRadius: '8px' }} onClick={handleSaveProfile}>
          <i className="bi bi-check-circle me-2"></i>Save Changes
        </button>
        <button className="btn btn-outline-danger" style={{ borderRadius: '8px' }} onClick={() => setShowEdit(false)}>
          <i className="bi bi-x-circle me-2"></i>Cancel
        </button>
      </div>
    </div>
  ) : null;

  // ── Active posts list ──
  const activePosts    = activeTab === 'posts' ? myPosts : bookmarkedPosts;
  const isEmptyPosts   = activeTab === 'posts' && myPosts.length === 0;
  const isEmptyBookmarks = activeTab === 'bookmarks' && bookmarkedPosts.length === 0;

  return (
    <>
      <Navbar />
      <main style={{ marginTop: '68px', minHeight: 'calc(100vh - 68px)', padding: '3rem 2rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          <ProfileHeader
            avatar={user.avatar}
            name={user.name}
            email={user.email}
            stats={stats}
            onAvatarClick={handleShowEdit}
            actions={
              <>
                <button className="btn btn-outline-danger" style={{ borderRadius: '8px', fontSize: '0.875rem' }} onClick={handleShowEdit}>
                  <i className="bi bi-pencil me-2"></i>Edit Profile
                </button>
                <button className="btn btn-danger" style={{ borderRadius: '8px', fontSize: '0.875rem' }} onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i>Logout
                </button>
              </>
            }
            editForm={editFormJSX}
          />

          {/* ── Two-column layout: sidebar + posts ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.5rem', alignItems: 'start' }}>

            {/* ── Sidebar ── */}
            <aside style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              overflow: 'hidden',
              position: 'sticky',
              top: '88px',
            }}>
              <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)' }}>
                <p style={{ margin: 0, fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.8rem', color: '#9a9a9a', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  Content
                </p>
              </div>
              <nav style={{ padding: '0.5rem' }}>
                {TABS.map(tab => {
                  const count = tab.key === 'posts' ? myPosts.length : bookmarkedPosts.length;
                  const isActive = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        marginBottom: '0.2rem',
                        fontFamily: 'Syne, sans-serif',
                        fontWeight: isActive ? 700 : 500,
                        fontSize: '0.9rem',
                        background: isActive ? 'rgba(220,53,69,0.12)' : 'transparent',
                        color: isActive ? '#dc3545' : '#9a9a9a',
                        transition: 'all 0.18s',
                        textAlign: 'left',
                      }}
                      onMouseOver={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                      onMouseOut={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <i className={`bi ${tab.icon}`} style={{ fontSize: '1rem' }}></i>
                        {tab.label}
                      </span>
                      <span style={{
                        background: isActive ? '#dc3545' : 'rgba(255,255,255,0.07)',
                        color: isActive ? '#fff' : '#9a9a9a',
                        borderRadius: '20px',
                        padding: '1px 8px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        minWidth: '22px',
                        textAlign: 'center',
                      }}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </nav>

              {/* Quick action */}
              <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border)' }}>
                <Link to="/create-post" style={{ textDecoration: 'none' }}>
                  <button style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #dc3545, #a71d2a)',
                    border: 'none',
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '0.6rem',
                    cursor: 'pointer',
                    fontFamily: 'Syne, sans-serif',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    transition: 'opacity 0.2s',
                  }}
                    onMouseOver={e => e.currentTarget.style.opacity = '0.88'}
                    onMouseOut={e => e.currentTarget.style.opacity = '1'}
                  >
                    <i className="bi bi-plus-lg"></i> New Post
                  </button>
                </Link>
              </div>
            </aside>

            {/* ── Posts area ── */}
            <div>
              {/* Tab heading */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h5 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#dc3545', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className={`bi ${TABS.find(t => t.key === activeTab)?.icon}`}></i>
                  {TABS.find(t => t.key === activeTab)?.label}
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 400, fontSize: '0.85rem', color: '#9a9a9a' }}>
                    ({activePosts.length})
                  </span>
                </h5>
              </div>

              {/* Empty states */}
              {isEmptyPosts && (
                <div style={{ textAlign: 'center', padding: '3rem 2rem', color: '#9a9a9a', border: '1px dashed rgba(220,53,69,0.25)', borderRadius: '12px' }}>
                  <i className="bi bi-journal-plus" style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem', color: '#dc3545', opacity: 0.5 }}></i>
                  <p style={{ margin: '0 0 1rem' }}>You haven't written any posts yet.</p>
                  <Link to="/create-post">
                    <button className="btn btn-danger" style={{ borderRadius: '8px' }}>
                      <i className="bi bi-plus-lg me-2"></i>Create First Post
                    </button>
                  </Link>
                </div>
              )}
              {isEmptyBookmarks && (
                <div style={{ textAlign: 'center', padding: '3rem 2rem', color: '#9a9a9a', border: '1px dashed rgba(220,53,69,0.25)', borderRadius: '12px' }}>
                  <i className="bi bi-bookmark" style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem', color: '#dc3545', opacity: 0.5 }}></i>
                  <p style={{ margin: 0 }}>No bookmarks yet. Start saving posts you like!</p>
                </div>
              )}

              {/* Post cards */}
              {activePosts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  showActions={activeTab === 'posts'}
                  onEdit={handleEditPost}
                  onDelete={handleDeletePost}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* ── Edit Post Modal ── */}
      {editPostData && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ background: 'linear-gradient(135deg, #dc3545, #a71d2a)', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 1 }}>
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
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <label className="form-label" style={{ margin: 0 }}>
                    <i className="bi bi-journals me-2" style={{ color: '#dc3545' }}></i>References
                  </label>
                  <button type="button" onClick={addEditRef} style={{ background: 'rgba(220,53,69,0.1)', border: '1px solid rgba(220,53,69,0.3)', color: '#dc3545', borderRadius: '6px', padding: '0.3rem 0.75rem', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'Syne, sans-serif', fontWeight: 600 }}>
                    <i className="bi bi-plus me-1"></i>Add
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {editRefs.map((ref, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{ color: '#9a9a9a', fontSize: '0.8rem', minWidth: '20px', textAlign: 'center' }}>{idx + 1}.</span>
                      <input type="text" className="form-control" placeholder="Label" value={ref.label} onChange={setEditRef(idx, 'label')} style={{ flex: 1 }} />
                      <input type="url" className="form-control" placeholder="https://..." value={ref.url} onChange={setEditRef(idx, 'url')} style={{ flex: 1.5 }} />
                      {editRefs.length > 1 && (
                        <button type="button" onClick={() => removeEditRef(idx)} style={{ background: 'transparent', border: 'none', color: '#dc3545', cursor: 'pointer', padding: '0 0.25rem', fontSize: '1rem' }}>
                          <i className="bi bi-x-lg"></i>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', position: 'sticky', bottom: 0, background: 'var(--surface)' }}>
              <button className="btn btn-outline-danger" style={{ borderRadius: '8px' }} onClick={() => setEditPostData(null)}>Cancel</button>
              <button className="btn btn-danger" style={{ borderRadius: '8px' }} onClick={handleSaveEditPost}>
                <i className="bi bi-check-circle me-2"></i>Update Post
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal {...modalProps} />
      <Footer />
    </>
  );
}