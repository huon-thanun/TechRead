import { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import BlogCard from '../components/BlogCard';
import Footer from '../components/Footer';
import { usePosts } from '../context/PostsContext';

const POSTS_PER_PAGE = 10;

export default function Home() {
  const { allPosts, isLoadingPosts, isRefreshingPosts, postsError, refreshPosts } = usePosts();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadedCount, setLoadedCount] = useState(POSTS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Reset to initial load whenever filter or search changes
  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setLoadedCount(POSTS_PER_PAGE);
  };

  const handleSearch = (q) => {
    setSearchQuery(q);
    setLoadedCount(POSTS_PER_PAGE);
  };

  // Filtered and loaded posts
  const filtered = useMemo(() => {
    let result = allPosts;
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q)
      );
    }
    return result;
  }, [allPosts, selectedCategory, searchQuery]);

  const displayed = useMemo(() => {
    return filtered.slice(0, loadedCount);
  }, [filtered, loadedCount]);

  const loadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setLoadedCount(prev => prev + POSTS_PER_PAGE);
      setIsLoadingMore(false);
    }, 500);
  };

  const hasMore = loadedCount < filtered.length;

  return (
    <>
      <Navbar onSearch={handleSearch} />
      <Sidebar selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />

      <main className="blog-cards-section">
        <div className="feed-toolbar">
          <p className="feed-count-text">
            {isLoadingPosts ? 'Loading your feed...' : `Showing ${displayed.length} of ${filtered.length} posts`}
          </p>

          <button
            type="button"
            className="feed-refresh-btn"
            onClick={() => refreshPosts({ silent: true })}
            disabled={isRefreshingPosts}
          >
            <i className={`bi ${isRefreshingPosts ? 'bi-arrow-repeat spin' : 'bi-arrow-clockwise'}`}></i>
            {isRefreshingPosts ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {postsError && (
          <div className="feed-alert" role="status">
            <i className="bi bi-exclamation-triangle-fill"></i>
            <span>{postsError}</span>
            <button type="button" onClick={() => refreshPosts()} className="feed-alert-btn">Retry</button>
          </div>
        )}

        {isLoadingPosts ? (
          <div className="feed-skeleton-wrap">
            {[1, 2, 3].map((key) => (
              <div key={key} className="feed-skeleton-card" />
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div className="feed-empty-state">
            <i className="bi bi-search"></i>
            <h4>No posts found</h4>
            <p>Try a different search term or category.</p>
          </div>
        ) : (
          displayed.map(post => (
            <BlogCard key={post.id} post={post} />
          ))
        )}

        {!isLoadingPosts && hasMore && (
          <div className="feed-load-more-wrap">
            <button onClick={loadMore} disabled={isLoadingMore} className="feed-load-more-btn">
              <i className={`bi ${isLoadingMore ? 'bi-hourglass-split' : 'bi-plus-circle'}`}></i>
              {isLoadingMore ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}

      </main>

    </>
  );
}