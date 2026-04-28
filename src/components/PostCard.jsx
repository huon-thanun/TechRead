import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostsContext';
import { useToast } from '../context/ToastContext';
import ConfirmModal from './ConfirmModal';
import useModal from '../hooks/useModal';

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200';

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
  const { user } = useAuth();
  const { toggleBookmark, toggleReaction, bookmarks } = usePosts();
  const { showToast } = useToast();
  const { modalProps, showConfirm } = useModal();
  const navigate = useNavigate();

  const isReacted = post.reacted || false;
  const isBookmarked = bookmarks[post.id] || false;
  const liveCount = post.reactionCount ?? post.likes ?? 0;
  const refCount = post.references?.length || 0;

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
      <article className="blog-card ig-card ig-card-compact" onClick={() => navigate(`/blog/${post.slug}`)}>
        <div className="ig-cover-wrap ig-cover-wrap-compact">
          <img src={post.image || DEFAULT_COVER} alt={post.title} loading="lazy" className="ig-cover" />
        </div>

        <div className="ig-card-body">
          <div className="ig-meta-row" onClick={(e) => e.stopPropagation()}>
            <span className="tag-badge">{post.category}</span>
            <span className="ig-date-mini">{post.date}</span>

            {showActions && (
              <div className="post-owner-actions">
                <button type="button" className="post-action post-action-edit" onClick={() => onEdit?.(post)}>
                  <i className="bi bi-pencil me-1"></i>Edit
                </button>
                <button type="button" className="post-action post-action-delete" onClick={() => onDelete?.(post.id)}>
                  <i className="bi bi-trash me-1"></i>Delete
                </button>
              </div>
            )}
          </div>

          <h5 className="ig-title ig-title-sm">{post.title}</h5>
          <p className="ig-caption">{post.content.slice(0, 130)}...</p>

          <div className="ig-actions" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="ig-action-btn" onClick={handleReact}>
              <i className={`bi ${isReacted ? 'bi-heart-fill' : 'bi-heart'} action-icon`}></i>
              <span>{liveCount}</span>
            </button>
            <button type="button" className="ig-action-btn" onClick={handleBookmark}>
              <i className={`bi ${isBookmarked ? 'bi-bookmark-fill' : 'bi-bookmark'} action-icon`}></i>
            </button>
            <div className="ig-ref-count">
              <i className="bi bi-journals"></i>
              <span>{refCount} ref{refCount !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </article>

      <ConfirmModal {...modalProps} />
    </>
  );
});

export default PostCard;