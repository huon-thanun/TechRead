import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostsContext';
import { useToast } from '../context/ToastContext';
import ConfirmModal from './ConfirmModal';
import useModal from '../hooks/useModal';

/**
 * PostCard — same visual style as BlogCard but used in Profile / UserProfile.
 * Supports optional edit/delete actions for the post owner.
 *
 * Props:
 *  post        — post object (with live bookmarked/reacted/reactionCount from context)
 *  showActions — show edit/delete buttons (owner only)
 *  onEdit      — called with post when edit clicked
 *  onDelete    — called with post.id when delete clicked
 */
const PostCard = memo(function PostCard({ post, showActions = false, onEdit, onDelete }) {
  const { user }    = useAuth();
  const { toggleBookmark, toggleReaction, reactions, reactionCounts, bookmarks } = usePosts();
  const { showToast } = useToast();
  const { modalProps, showConfirm } = useModal();
  const navigate    = useNavigate();

  const isReacted    = reactions[post.id]       || false;
  const isBookmarked = bookmarks[post.id]        || false;
  const liveCount    = reactionCounts[post.id]  !== undefined
    ? reactionCounts[post.id]
    : (post.likes || 0);
  const refCount     = post.references?.length  || 0;

  const handleReact = async (e) => {
    e.stopPropagation();
    if (!user) {
      const yes = await showConfirm({ title: 'Login Required', message: 'Please login to react to posts.', type: 'alert', confirmText: 'Go to Login', cancelText: 'Cancel' });
      if (yes) navigate('/login');
      return;
    }
    toggleReaction(post.id, liveCount);
  };

  const handleBookmark = async (e) => {
    e.stopPropagation();
    if (!user) {
      const yes = await showConfirm({ title: 'Login Required', message: 'Please login to bookmark posts.', type: 'alert', confirmText: 'Go to Login', cancelText: 'Cancel' });
      if (yes) navigate('/login');
      return;
    }
    toggleBookmark(post.id);
    showToast(isBookmarked ? `Removed: "${post.title}"` : `Bookmarked: "${post.title}"`, isBookmarked ? 'danger' : 'success');
  };

  return (
    <>
      <div style={{ marginBottom: '1.5rem', cursor: 'pointer' }} onClick={() => navigate(`/blog/${post.slug}`)}>
        <div className="blog-card" style={{ display: 'flex', flexDirection: 'row', borderRadius: '12px', overflow: 'hidden', minHeight: '180px' }}>

          {/* Cover image */}
          <div style={{ width: '240px', flexShrink: 0 }}>
            <img
              src={post.image}
              alt={post.title}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Content */}
          <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

            {/* Top: category + date + edit/delete */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <span className="tag-badge">{post.category}</span>
                <span style={{ color: '#9a9a9a', fontSize: '0.75rem' }}>{post.date}</span>
                {showActions && (
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.25rem' }} onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => onEdit?.(post)}
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#9a9a9a', borderRadius: '6px', padding: '3px 9px', cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.2s' }}
                      onMouseOver={e => { e.currentTarget.style.color = '#f0ece8'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                      onMouseOut={e => { e.currentTarget.style.color = '#9a9a9a'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                    >
                      <i className="bi bi-pencil me-1"></i>Edit
                    </button>
                    <button
                      onClick={() => onDelete?.(post.id)}
                      style={{ background: 'rgba(220,53,69,0.08)', border: '1px solid rgba(220,53,69,0.2)', color: '#dc3545', borderRadius: '6px', padding: '3px 9px', cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.2s' }}
                      onMouseOver={e => { e.currentTarget.style.background = 'rgba(220,53,69,0.18)'; }}
                      onMouseOut={e => { e.currentTarget.style.background = 'rgba(220,53,69,0.08)'; }}
                    >
                      <i className="bi bi-trash me-1"></i>Delete
                    </button>
                  </div>
                )}
              </div>

              {/* Title */}
              <h5 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#f0ece8', marginBottom: '0.4rem', fontSize: '1.05rem', lineHeight: 1.3 }}>
                {post.title}
              </h5>

              {/* Excerpt */}
              <p style={{ color: '#9a9a9a', fontSize: '0.85rem', lineHeight: 1.65, margin: 0 }}>
                {post.content.slice(0, 140)}...
              </p>
            </div>

            {/* Bottom: references + reaction + bookmark */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(220,53,69,0.12)' }}>
              {refCount > 0 ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: '#9a9a9a', background: 'rgba(220,53,69,0.07)', border: '1px solid rgba(220,53,69,0.18)', borderRadius: '20px', padding: '3px 10px' }}>
                  <i className="bi bi-journals" style={{ color: '#dc3545', fontSize: '0.75rem' }}></i>
                  {refCount} reference{refCount > 1 ? 's' : ''}
                </span>
              ) : <span />}

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <i
                    className={`bi ${isReacted ? 'bi-emoji-heart-eyes-fill' : 'bi-emoji-heart-eyes'} action-icon`}
                    style={{ fontSize: '1.25rem', color: '#dc3545' }}
                    onClick={handleReact}
                  ></i>
                  <span style={{ color: '#dc3545', fontWeight: 700, fontSize: '0.85rem' }}>{liveCount}</span>
                </div>
                <i
                  className={`bi ${isBookmarked ? 'bi-bookmark-fill' : 'bi-bookmark'} action-icon`}
                  style={{ fontSize: '1.25rem', color: '#dc3545' }}
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

export default PostCard;