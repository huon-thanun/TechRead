import { useParams, useNavigate } from 'react-router-dom';
import { usePosts } from '../context/PostsContext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { allPosts } = usePosts();

  const post = allPosts.find(p => p.slug === slug);

  const goToAuthor = () => {
    if (!post) return;
    if (user && user.name === post.author?.name) {
      navigate('/profile');
    } else {
      navigate(`/user/${encodeURIComponent(post.author?.name)}`);
    }
  };

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

          {/* Category */}
          <span className="tag-badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>{post.category}</span>

          {/* Title */}
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', lineHeight: 1.2, marginBottom: '1.5rem', color: '#f0ece8' }}>
            {post.title}
          </h1>

          {/* Author — clickable */}
          <div
            onClick={goToAuthor}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.85rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(220,53,69,0.15)', cursor: 'pointer', padding: '0.5rem 0.85rem', borderRadius: '10px', transition: 'background 0.2s', width: '100%' }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(220,53,69,0.06)'}
            onMouseOut={e => e.currentTarget.style.background = 'transparent'}
          >
            <img
              src={post.author?.avatar || 'https://ui-avatars.com/api/?name=User&background=dc3545&color=fff'}
              alt={post.author?.name}
              style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(220,53,69,0.5)', flexShrink: 0 }}
            />
            <div>
              <p style={{ margin: 0, fontWeight: 700, color: '#f0ece8', fontFamily: 'Syne, sans-serif' }}>{post.author?.name}</p>
              <span style={{ fontSize: '0.8rem', color: '#9a9a9a' }}>{post.date}</span>
            </div>
            <i className="bi bi-box-arrow-up-right" style={{ color: '#dc3545', fontSize: '0.8rem', marginLeft: 'auto', opacity: 0.6 }}></i>
          </div>

          {/* Cover image */}
          <div className="cover-detail" style={{ marginBottom: '2.5rem', maxWidth: '100%' }}>
            <img src={post.image} alt={post.title} />
          </div>

          {/* Content */}
          <div style={{ fontSize: '1.05rem', lineHeight: 1.85, color: '#c8c4c0', whiteSpace: 'pre-wrap' }}>
            {post.content}
          </div>

          {/* References */}
          {post.references && post.references.length > 0 && (
            <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(220,53,69,0.15)' }}>
              <h5 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: '1.25rem', color: '#f0ece8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="bi bi-journals" style={{ color: '#dc3545' }}></i>
                References
              </h5>
              <ol style={{ padding: '0 0 0 1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {post.references.map((ref, idx) => (
                  <li key={idx} style={{ color: '#9a9a9a', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#dc3545', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', transition: 'opacity 0.2s' }}
                      onMouseOver={e => e.currentTarget.style.opacity = '0.75'}
                      onMouseOut={e => e.currentTarget.style.opacity = '1'}
                    >
                      {ref.label}
                      <i className="bi bi-box-arrow-up-right" style={{ fontSize: '0.75rem' }}></i>
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Back */}
          <button className="btn btn-danger" style={{ marginTop: '2.5rem', borderRadius: '8px', padding: '0.65rem 1.5rem' }} onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left me-2"></i>Back
          </button>

        </article>
      </main>
      <Footer />
    </>
  );
}