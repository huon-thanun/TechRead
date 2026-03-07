import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProfileHeader from '../components/ProfileHeader';
import PostCard from '../components/PostCard';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostsContext';

export default function UserProfile() {
  const { authorName } = useParams();
  const navigate       = useNavigate();
  const { user }       = useAuth();
  const { allPosts, reactionCounts } = usePosts();

  const decodedName = decodeURIComponent(authorName);

  // Redirect to own profile if viewing self
  if (user && user.name === decodedName) {
    navigate('/profile', { replace: true });
    return null;
  }

  const authorPosts = useMemo(() =>
    allPosts.filter(p => p.author?.name === decodedName),
    [allPosts, decodedName]
  );

  const authorInfo = authorPosts[0]?.author || { name: decodedName, avatar: null };

  const totalReactions = authorPosts.reduce((sum, p) =>
    sum + (reactionCounts[p.id] !== undefined ? reactionCounts[p.id] : (p.likes || 0)), 0);

  const stats = [
    { label: 'Posts',      value: authorPosts.length },
    { label: 'Reactions',  value: totalReactions },
    { label: 'Categories', value: [...new Set(authorPosts.map(p => p.category))].length },
  ];

  if (authorPosts.length === 0) {
    return (
      <>
        <Navbar />
        <div style={{ marginTop: '68px', textAlign: 'center', padding: '6rem 2rem', color: 'var(--text-muted)' }}>
          <i className="bi bi-person-x" style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem', color: '#dc3545' }}></i>
          <h3 style={{ fontFamily: 'Syne, sans-serif' }}>User not found</h3>
          <p>No posts found for <strong style={{ color: 'var(--text)' }}>{decodedName}</strong></p>
          <button className="btn btn-danger" style={{ marginTop: '1.5rem', borderRadius: '8px' }} onClick={() => navigate('/')}>
            <i className="bi bi-arrow-left me-2"></i>Back to Home
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main style={{ marginTop: '68px', minHeight: 'calc(100vh - 68px)', padding: '3rem 2rem' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>

          <ProfileHeader
            avatar={authorInfo.avatar}
            name={decodedName}
            stats={stats}
            actions={
              <button className="btn btn-outline-danger" style={{ borderRadius: '8px', fontSize: '0.875rem' }} onClick={() => navigate(-1)}>
                <i className="bi bi-arrow-left me-2"></i>Back
              </button>
            }
          />

          {/* Posts list */}
          <h5 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: '1.25rem', color: '#dc3545', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="bi bi-grid"></i> Posts by {decodedName}
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 400, fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '0.25rem' }}>({authorPosts.length})</span>
          </h5>

          {authorPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}

        </div>
      </main>
      <Footer />
    </>
  );
}