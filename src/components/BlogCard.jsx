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

  const goToAuthor = (e) => {
    e.stopPropagation();
    if (user && user.name === post.author?.name) {
      navigate('/profile');
    } else {
      navigate(`/user/${encodeURIComponent(post.author?.name)}`);
    }
  };

  const handleBookmark = async (e) => {
    e.stopPropagation();
    if (!user) {
      const yes = await showConfirm({ title: 'Login Required', message: 'Please login or register to bookmark posts.', type: 'alert', confirmText: 'Go to Login', cancelText: 'Cancel' });
      if (yes) navigate('/login');
      return;
    }
    toggleBookmark(post.id);
    showToast(post.bookmarked ? `Removed: "${post.title}"` : `Bookmarked: "${post.title}"`, post.bookmarked ? 'danger' : 'success');
  };

  const handleReaction = async (e) => {
    e.stopPropagation();
    if (!user) {
      const yes = await showConfirm({ title: 'Login Required', message: 'Please login or register to react to posts.', type: 'alert', confirmText: 'Go to Login', cancelText: 'Cancel' });
      if (yes) navigate('/login');
      return;
    }
    toggleReaction(post.id, post.reactionCount);
  };

  const refCount = post.references?.length || 0;

  return (
    <>
      <article className="blog-card ig-card" onClick={() => navigate(`/blog/${post.slug}`)}>
        <header className="ig-card-header">
          <button type="button" className="ig-author" onClick={goToAuthor}>
            <img
              src={post.author?.avatar || DEFAULT_AVATAR}
              alt={post.author?.name}
              loading="lazy"
              className="ig-author-avatar"
            />
            <span>
              <strong className="ig-author-name">{post.author?.name}</strong>
              <small className="ig-author-date">{post.date}</small>
            </span>
          </button>
          <span className="tag-badge">{post.category}</span>
        </header>

        <div className="ig-cover-wrap">
          <img src={post.image} alt={post.title} loading="lazy" className="ig-cover" />
        </div>

        <div className="ig-card-body">
          <h4 className="ig-title">{post.title}</h4>
          <p className="ig-caption">{post.content.slice(0, 150)}...</p>

          <div className="ig-actions" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="ig-action-btn" onClick={handleReaction}>
              <i className={`bi ${post.reacted ? 'bi-heart-fill' : 'bi-heart'} action-icon`}></i>
              <span>{post.reactionCount}</span>
            </button>
            <button type="button" className="ig-action-btn" onClick={handleBookmark}>
              <i className={`bi ${post.bookmarked ? 'bi-bookmark-fill' : 'bi-bookmark'} action-icon`}></i>
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

export default BlogCard;