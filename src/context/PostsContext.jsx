import { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';

const PostsContext = createContext(null);
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8081/api').replace(/\/$/, '');
const POSTS_ENDPOINT = `${API_BASE_URL}/posts`;
const REPORTS_ENDPOINT = `${API_BASE_URL}/reports`;

const getToken = () => localStorage.getItem('auth_token') || '';

const apiRequest = async (url, options = {}) => {
  const headers = {
    Accept: 'application/json',
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.message || `Request failed (${response.status})`);
  }

  return payload;
};

const toSlug = (value = '') =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const normalizeReferences = (references) => {
  if (!Array.isArray(references)) return [];
  return references
    .map((ref) => ({
      label: ref?.label || ref?.title || '',
      url: ref?.url || ref?.link || '',
    }))
    .filter((ref) => ref.label && ref.url);
};

const normalizePost = (raw, index = 0) => {
  const title = raw?.title || raw?.name || 'Untitled Post';
  const createdAt = raw?.created_at || raw?.createdAt || raw?.date || new Date().toISOString();
  const authorName =
    raw?.author?.name ||
    raw?.user?.name ||
    raw?.author_name ||
    raw?.authorName ||
    'TechRead Author';

  return {
    id: Number(raw?.id) || Date.now() + index,
    title,
    slug: raw?.slug || toSlug(title),
    content: raw?.content || raw?.body || raw?.description || '',
    category: raw?.category || raw?.topic || 'Programming',
    references: normalizeReferences(raw?.references),
    tags: Array.isArray(raw?.tags) ? raw.tags : [],
    image:
      raw?.image ||
      raw?.image_url ||
      raw?.cover ||
      'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200',
    author: {
      name: authorName,
      email: raw?.author?.email || raw?.user?.email || raw?.author_email || '',
      avatar:
        raw?.author?.avatar ||
        raw?.user?.avatar ||
        raw?.author_avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=dc3545&color=fff`,
    },
    date: createdAt?.toString().slice(0, 10),
    likes: Number(raw?.likes ?? raw?.reaction_count ?? raw?.reactions_count ?? 0),
    reactionCount: Number(raw?.reaction_count ?? raw?.likes ?? raw?.reactions_count ?? 0),
    bookmarked: false,
    reacted: raw?.user_has_reacted || false,
  };
};

const parsePostsResponse = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.posts)) return payload.posts;
  if (Array.isArray(payload?.result)) return payload.result;
  return [];
};

export function PostsProvider({ children }) {
  const [serverPosts, setServerPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isRefreshingPosts, setIsRefreshingPosts] = useState(false);
  const [postsError, setPostsError] = useState('');
  const [userPosts, setUserPosts] = useState(() => {
    const stored = localStorage.getItem('userPosts');
    return stored ? JSON.parse(stored) : [];
  });
  const [bookmarks, setBookmarks] = useState(() => {
    const stored = localStorage.getItem('bookmarks');
    return stored ? JSON.parse(stored) : {};
  });


  const fetchPosts = useCallback(async ({ silent = false } = {}) => {
    if (silent) setIsRefreshingPosts(true);
    else setIsLoadingPosts(true);

    try {
      const token = getToken();
      const response = await fetch(POSTS_ENDPOINT, {
        headers: {
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status}`);
      }

      const data = await response.json();
      const posts = parsePostsResponse(data).map((post, index) => normalizePost(post, index));
      setServerPosts(posts);
      setPostsError('');
    } catch {
      setPostsError('Backend not available yet. Showing local content.');
    } finally {
      if (silent) setIsRefreshingPosts(false);
      else setIsLoadingPosts(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Sync reactions when auth changes in the current tab or another tab
  useEffect(() => {
    const handleAuthChange = () => {
      fetchPosts({ silent: true });
    };

    const handleStorageChange = (e) => {
      if (e?.key === 'auth_token') {
        handleAuthChange();
      }
    };

    window.addEventListener('auth-changed', handleAuthChange);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('auth-changed', handleAuthChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [fetchPosts]);

  // Memoize the full merged + decorated post list
  const allPosts = useMemo(() => {
    const merged = [...serverPosts, ...userPosts];
    const unique = new Map();

    merged.forEach((post) => {
      const key = post.slug || post.id;
      if (!unique.has(key)) unique.set(key, post);
    });

    const mergedList = Array.from(unique.values());

    return mergedList
      .map(p => ({
        ...p,
        bookmarked: bookmarks[p.id] || false,
        reacted: p.reacted || false,
        reactionCount: p.reactionCount ?? p.likes ?? 0,
      }))
      .sort((a, b) => {
        const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
        if (!Number.isNaN(dateDiff) && dateDiff !== 0) return dateDiff;
        return b.id - a.id;
      });
  }, [userPosts, serverPosts, bookmarks]);

  const toggleBookmark = useCallback((postId) => {
    setBookmarks(prev => {
      const next = { ...prev, [postId]: !prev[postId] };
      localStorage.setItem('bookmarks', JSON.stringify(next));
      return next;
    });

    apiRequest(`${POSTS_ENDPOINT}/${postId}/bookmark`, {
      method: 'POST',
    }).catch(() => { });
  }, []);

  const toggleReaction = useCallback((postId, currentCount) => {
    return apiRequest(`${POSTS_ENDPOINT}/${postId}/react`, {
      method: 'POST',
    }).then((response) => {
      const reacted = Boolean(response?.reacted);
      const reactionCount = Number(response?.reaction_count ?? currentCount ?? 0);

      const applyReactionState = (post) => {
        if (post.id !== postId) return post;

        return {
          ...post,
          reacted,
          reactionCount,
          likes: reactionCount,
          reaction_count: reactionCount,
          user_has_reacted: reacted,
        };
      };

      setServerPosts((prev) => prev.map(applyReactionState));
      setUserPosts((prev) => prev.map(applyReactionState));

      return response;
    }).catch(() => { });
  }, []);

  const createPost = useCallback(async (post) => {
    try {
      const response = await apiRequest(POSTS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: post.title,
          slug: post.slug,
          content: post.content,
          category: post.category,
          image: post.image,
          references: post.references,
          author_name: post.author?.name,
          author_email: post.author?.email,
          author_avatar: post.author?.avatar,
        }),
      });

      const created = normalizePost(response?.data || response);
      setServerPosts((prev) => [created, ...prev]);
      setUserPosts((prev) => {
        const next = [created, ...prev.filter((p) => p.id !== created.id)];
        localStorage.setItem('userPosts', JSON.stringify(next));
        return next;
      });
      return created;
    } catch {
      setUserPosts(prev => {
        const next = [post, ...prev];
        localStorage.setItem('userPosts', JSON.stringify(next));
        return next;
      });
      return post;
    }
  }, []);

  const updatePost = useCallback(async (postId, updates) => {
    try {
      const response = await apiRequest(`${POSTS_ENDPOINT}/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const updated = normalizePost(response?.data || response);
      setServerPosts((prev) => prev.map((p) => (p.id === postId ? updated : p)));
      setUserPosts((prev) => {
        const next = prev.map((p) => (p.id === postId ? { ...p, ...updated } : p));
        localStorage.setItem('userPosts', JSON.stringify(next));
        return next;
      });
      return updated;
    } catch {
      setUserPosts(prev => {
        const next = prev.map(p => p.id === postId ? { ...p, ...updates } : p);
        localStorage.setItem('userPosts', JSON.stringify(next));
        return next;
      });
      return { id: postId, ...updates };
    }
  }, []);

  const deletePost = useCallback(async (postId) => {
    try {
      await apiRequest(`${POSTS_ENDPOINT}/${postId}`, {
        method: 'DELETE',
      });
      setServerPosts((prev) => prev.filter((p) => p.id !== postId));
      setUserPosts((prev) => {
        const next = prev.filter((p) => p.id !== postId);
        localStorage.setItem('userPosts', JSON.stringify(next));
        return next;
      });
    } catch {
      setUserPosts(prev => {
        const next = prev.filter(p => p.id !== postId);
        localStorage.setItem('userPosts', JSON.stringify(next));
        return next;
      });
    }
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

  const submitReport = useCallback(async (report) => {
    return apiRequest(REPORTS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(report),
    });
  }, []);

  const value = useMemo(() => ({
    allPosts,
    userPosts,
    isLoadingPosts,
    isRefreshingPosts,
    postsError,
    bookmarks,
    refreshPosts: fetchPosts,
    toggleBookmark,
    toggleReaction,
    createPost,
    updatePost,
    deletePost,
    updateUserPosts,
    submitReport,
  }), [allPosts, userPosts, isLoadingPosts, isRefreshingPosts, postsError, bookmarks, fetchPosts, toggleBookmark, toggleReaction, createPost, updatePost, deletePost, updateUserPosts]);

  return (
    <PostsContext.Provider value={value}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  return useContext(PostsContext);
}