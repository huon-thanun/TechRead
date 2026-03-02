import { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import BlogCard from '../components/BlogCard';
import Footer from '../components/Footer';
import { usePosts } from '../context/PostsContext';

const POSTS_PER_PAGE = 10;

export default function Home() {
  const { allPosts } = usePosts();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadedCount, setLoadedCount] = useState(POSTS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    setTimeout(() => {
      setLoadedCount(prev => prev + POSTS_PER_PAGE);
      setIsLoading(false);
    }, 500);
  };

  const hasMore = loadedCount < filtered.length;

  return (
    <>
      <Navbar onSearch={handleSearch} />
      <Sidebar selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />

      <main className="blog-cards-section">

        {/* Posts count info */}
        {filtered.length > 0 && (
          <p style={{ color: '#9a9a9a', fontSize: '0.82rem', marginBottom: '1.25rem' }}>
            Showing{' '}
            <span style={{ color: '#f0ece8', fontWeight: 600 }}>
              {displayed.length}
            </span>
            {' '}of{' '}
            <span style={{ color: '#dc3545', fontWeight: 600 }}>{filtered.length}</span>
            {' '}posts
          </p>
        )}

        {/* Post list */}
        {displayed.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#9a9a9a' }}>
            <i className="bi bi-search" style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem', color: '#dc3545' }}></i>
            <h4 style={{ fontFamily: 'Syne, sans-serif' }}>No posts found</h4>
            <p>Try a different search term or category</p>
          </div>
        ) : (
          displayed.map(post => (
            <BlogCard key={post.id} post={post} />
          ))
        )}

        {/* Load More Button */}
        {hasMore && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem', marginBottom: '1rem' }}>
            <button
              onClick={loadMore}
              disabled={isLoading}
              style={{
                background: isLoading ? '#555' : '#dc3545',
                border: '1px solid #dc3545',
                color: '#fff',
                borderRadius: '8px',
                padding: '0.6rem 1.5rem',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontFamily: 'Syne, sans-serif',
                fontWeight: 600,
                fontSize: '0.9rem',
                transition: 'all 0.2s',
              }}
            >
              {isLoading ? (
                <>
                  <i className="bi bi-hourglass-split" style={{ marginRight: '0.5rem', animation: 'spin 1s linear infinite' }}></i>
                  Loading...
                </>
              ) : (
                <>
                  <i className="bi bi-plus-circle" style={{ marginRight: '0.5rem' }}></i>
                  Load More
                </>
              )}
            </button>
          </div>
        )}

      </main>

      {/* <div style={{ marginLeft: '240px' }}>
        <Footer />
      </div> */}

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}