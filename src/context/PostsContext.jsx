import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import postsData from '../data/posts.json';

const PostsContext = createContext(null);

export function PostsProvider({ children }) {
  const [userPosts, setUserPosts] = useState(() => {
    const stored = localStorage.getItem('userPosts');
    return stored ? JSON.parse(stored) : [];
  });
  const [bookmarks, setBookmarks] = useState(() => {
    const stored = localStorage.getItem('bookmarks');
    return stored ? JSON.parse(stored) : {};
  });
  const [reactions, setReactions] = useState(() => {
    const stored = localStorage.getItem('reactions');
    return stored ? JSON.parse(stored) : {};
  });
  const [reactionCounts, setReactionCounts] = useState(() => {
    const stored = localStorage.getItem('reactionCounts');
    return stored ? JSON.parse(stored) : {};
  });

  // Memoize static posts so they never get recreated
  const staticPosts = useMemo(() => postsData.posts, []);

  // Memoize the full merged + decorated post list
  const allPosts = useMemo(() => {
    const merged = [...userPosts, ...staticPosts];
    return merged
      .map(p => ({
        ...p,
        bookmarked: bookmarks[p.id] || false,
        reacted: reactions[p.id] || false,
        reactionCount: reactionCounts[p.id] !== undefined
          ? reactionCounts[p.id]
          : (p.likes || 0),
      }))
      .sort((a, b) => b.id - a.id);
  }, [userPosts, staticPosts, bookmarks, reactions, reactionCounts]);

  const toggleBookmark = useCallback((postId) => {
    setBookmarks(prev => {
      const next = { ...prev, [postId]: !prev[postId] };
      localStorage.setItem('bookmarks', JSON.stringify(next));
      return next;
    });
  }, []);

  const toggleReaction = useCallback((postId, currentCount) => {
    setReactions(prev => {
      const isReacted = prev[postId] || false;
      const next = { ...prev, [postId]: !isReacted };
      localStorage.setItem('reactions', JSON.stringify(next));

      setReactionCounts(prevCounts => {
        const newCount = isReacted
          ? Math.max(0, currentCount - 1)
          : currentCount + 1;
        const nextCounts = { ...prevCounts, [postId]: newCount };
        localStorage.setItem('reactionCounts', JSON.stringify(nextCounts));
        return nextCounts;
      });

      return next;
    });
  }, []);

  const createPost = useCallback((post) => {
    setUserPosts(prev => {
      const next = [post, ...prev];
      localStorage.setItem('userPosts', JSON.stringify(next));
      return next;
    });
  }, []);

  const updatePost = useCallback((postId, updates) => {
    setUserPosts(prev => {
      const next = prev.map(p => p.id === postId ? { ...p, ...updates } : p);
      localStorage.setItem('userPosts', JSON.stringify(next));
      return next;
    });
  }, []);

  const deletePost = useCallback((postId) => {
    setUserPosts(prev => {
      const next = prev.filter(p => p.id !== postId);
      localStorage.setItem('userPosts', JSON.stringify(next));
      return next;
    });
  }, []);

  const updateUserPosts = useCallback((user) => {
    setUserPosts(prev => {
      const next = prev.map(p =>
        p.author.email === user.email
          ? { ...p, author: { ...p.author, name: user.name, avatar: user.avatar } }
          : p
      );
      localStorage.setItem('userPosts', JSON.stringify(next));
      return next;
    });
  }, []);

  const value = useMemo(() => ({
    allPosts,
    userPosts,
    bookmarks,
    reactions,
    reactionCounts,
    toggleBookmark,
    toggleReaction,
    createPost,
    updatePost,
    deletePost,
    updateUserPosts,
  }), [allPosts, userPosts, bookmarks, reactions, reactionCounts, toggleBookmark, toggleReaction, createPost, updatePost, deletePost, updateUserPosts]);

  return (
    <PostsContext.Provider value={value}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  return useContext(PostsContext);
}