import { useParams, useNavigate } from 'react-router-dom';
import { usePosts } from '../context/PostsContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { allPosts } = usePosts();

  const post = allPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <>
        <Navbar />
        <div style={{ marginTop: '68px', textAlign: 'center', padding: '6rem 2rem', color: '#9a9a9a' }}>
          <i className="bi bi-file-earmark-x" style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem', color: '#dc3545' }}></i>
          <h3 style={{ fontFamily: 'Syne, sans-serif' }}>Post not found</h3>
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
      <main style={{ marginTop: '68px', minHeight: 'calc(100vh - 68px)' }}>
        <article style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem' }}>

          <span className="tag-badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>{post.category}</span>

          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', lineHeight: 1.2, marginBottom: '1rem', color: '#f0ece8' }}>
            {post.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(220,53,69,0.15)' }}>
            <img
              src={post.author?.avatar || 'https://ui-avatars.com/api/?name=User&background=dc3545&color=fff'}
              alt={post.author?.name}
              style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(220,53,69,0.5)' }}
            />
            <div>
              <p style={{ margin: 0, fontWeight: 600, color: '#f0ece8' }}>{post.author?.name}</p>
              <span style={{ fontSize: '0.8rem', color: '#9a9a9a' }}>{post.date}</span>
            </div>
          </div>

          <div className="cover-detail" style={{ marginBottom: '2.5rem', maxWidth: '100%' }}>
            <img src={post.image} alt={post.title} />
          </div>

          <div style={{ fontSize: '1.05rem', lineHeight: 1.85, color: '#c8c4c0', whiteSpace: 'pre-wrap' }}>
            {post.content}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(220,53,69,0.15)' }}>
              {post.tags.map(tag => (
                <span key={tag} className="tag-badge">{tag}</span>
              ))}
            </div>
          )}

          <button
            className="btn btn-danger"
            style={{ marginTop: '2.5rem', borderRadius: '8px', padding: '0.65rem 1.5rem' }}
            onClick={() => navigate(-1)}
          >
            <i className="bi bi-arrow-left me-2"></i>Back
          </button>
        </article>
      </main>
      <Footer />
    </>
  );
}