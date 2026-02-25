import { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import BlogCard from '../components/BlogCard';
import Footer from '../components/Footer';
import { usePosts } from '../context/PostsContext';

export default function Home() {
  const { allPosts } = usePosts();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Memoize filtered list — only recalculates when posts, category, or search changes
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

  return (
    <>
      <Navbar onSearch={setSearchQuery} />
      <Sidebar selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />

      <main className="blog-cards-section">
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#9a9a9a' }}>
            <i className="bi bi-search" style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem', color: '#dc3545' }}></i>
            <h4 style={{ fontFamily: 'Syne, sans-serif' }}>No posts found</h4>
            <p>Try a different search term or category</p>
          </div>
        ) : (
          filtered.map(post => (
            <BlogCard key={post.id} post={post} />
          ))
        )}
      </main>

      <div style={{ marginLeft: '240px' }}>
        <Footer />
      </div>
    </>
  );
}