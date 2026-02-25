import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostsContext';
import { useToast } from '../context/ToastContext';
import ConfirmModal from './ConfirmModal';
import useModal from '../hooks/useModal';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=User&background=dc3545&color=fff';

const BlogCard = memo(function BlogCard({ post }) {
  const { user } = useAuth();
  const { toggleBookmark, toggleReaction } = usePosts();
  const { showToast } = useToast();
  const { modalProps, showConfirm } = useModal();
  const navigate = useNavigate();

  const handleBookmark = async (e) => {
    e.stopPropagation();
    if (!user) {
      const yes = await showConfirm({
        title: 'Login Required',
        message: 'Please login or register to bookmark posts.',
        type: 'alert',
        confirmText: 'Go to Login',
        cancelText: 'Cancel',
      });
      if (yes) navigate('/login');
      return;
    }
    toggleBookmark(post.id);
    showToast(
      post.bookmarked ? `Removed: "${post.title}"` : `Bookmarked: "${post.title}"`,
      post.bookmarked ? 'danger' : 'success'
    );
  };

  const handleReaction = async (e) => {
    e.stopPropagation();
    if (!user) {
      const yes = await showConfirm({
        title: 'Login Required',
        message: 'Please login or register to react to posts.',
        type: 'alert',
        confirmText: 'Go to Login',
        cancelText: 'Cancel',
      });
      if (yes) navigate('/login');
      return;
    }
    toggleReaction(post.id, post.reactionCount);
  };

  return (
    <>
      <div
        style={{ marginBottom: '1.5rem', cursor: 'pointer' }}
        onClick={() => navigate(`/blog/${post.slug}`)}
      >
        <div
          className="blog-card"
          style={{ display: 'flex', flexDirection: 'row', borderRadius: '12px', overflow: 'hidden', height: '200px' }}
        >
          {/* Image — lazy loaded */}
          <div style={{ width: '260px', flexShrink: 0 }}>
            <img
              src={post.image}
              alt={post.title}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Content */}
          <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {/* Author */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <img
                src={post.author?.avatar || DEFAULT_AVATAR}
                alt={post.author?.name}
                loading="lazy"
                style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(220,53,69,0.4)' }}
              />
              <div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', color: '#f0ece8' }}>{post.author?.name}</p>
                <span style={{ fontSize: '0.75rem', color: '#9a9a9a' }}>{post.date}</span>
              </div>
              <span className="tag-badge" style={{ marginLeft: 'auto' }}>{post.category}</span>
            </div>

            {/* Title & Content */}
            <div style={{ flex: 1 }}>
              <h4 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: '0.5rem', fontSize: '1.15rem', color: '#f0ece8' }}>
                {post.title}
              </h4>
              <p style={{ color: '#9a9a9a', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
                {post.content.slice(0, 160)}...
              </p>
            </div>

            {/* Tags & Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(220,53,69,0.15)' }}>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {post.tags?.slice(0, 3).map(tag => (
                  <span key={tag} className="tag-badge">{tag}</span>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <i
                    className={`bi ${post.reacted ? 'bi-emoji-heart-eyes-fill' : 'bi-emoji-heart-eyes'} action-icon`}
                    style={{ fontSize: '1.3rem', color: '#dc3545' }}
                    onClick={handleReaction}
                  ></i>
                  <span style={{ color: '#dc3545', fontWeight: 700, fontSize: '0.875rem' }}>{post.reactionCount}</span>
                </div>
                <i
                  className={`bi ${post.bookmarked ? 'bi-bookmark-fill' : 'bi-bookmark'} action-icon`}
                  style={{ fontSize: '1.3rem', color: '#dc3545' }}
                  onClick={handleBookmark}
                ></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal {...modalProps} />
    </>
  );
});

export default BlogCard;