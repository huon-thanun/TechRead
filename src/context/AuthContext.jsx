import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';

const AuthContext = createContext(null);
const USER_KEY = 'user';
const TOKEN_KEY = 'auth_token';
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8081/api').replace(/\/$/, '');
const AUTH_ENDPOINT = `${API_BASE_URL}/auth`;

const normalizeEmail = (email = '') => email.trim().toLowerCase();

const toPublicUser = (account) => ({
    id: account?.id,
    name: account?.name,
    email: account?.email,
    avatar: account?.avatar,
    role: account?.role,
    is_active: account?.is_active,
});

const readStoredUser = () => {
    const stored = localStorage.getItem(USER_KEY);
    if (!stored) return null;

    try {
        return JSON.parse(stored);
    } catch {
        return null;
    }
};

const apiRequest = async (path, options = {}, token = null) => {
    const headers = {
        Accept: 'application/json',
        ...(options.headers || {}),
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    // Don't set Content-Type for FormData, let browser handle it
    const isFormData = options.body instanceof FormData;
    if (!isFormData && !options.headers?.['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${AUTH_ENDPOINT}${path}`, {
        ...options,
        headers: isFormData ? { Accept: 'application/json', Authorization: headers.Authorization } : headers,
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(payload?.message || 'Request failed');
    }

    return payload;
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(readStoredUser);
    const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
    const [isReady, setIsReady] = useState(false);

    const persistSession = useCallback((nextUser, nextToken) => {
        if (nextUser) {
            localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
            setUser(nextUser);
        } else {
            localStorage.removeItem(USER_KEY);
            setUser(null);
        }

        if (nextToken) {
            localStorage.setItem(TOKEN_KEY, nextToken);
            setToken(nextToken);
        } else {
            localStorage.removeItem(TOKEN_KEY);
            setToken('');
        }

        window.dispatchEvent(new CustomEvent('auth-changed', {
            detail: { token: nextToken || '' },
        }));
    }, []);

    useEffect(() => {
        const bootstrap = async () => {
            if (!token) {
                setIsReady(true);
                return;
            }

            try {
                const payload = await apiRequest('/me', {}, token);
                const sessionUser = toPublicUser(payload?.user || payload?.data || payload);
                persistSession(sessionUser, token);
            } catch {
                persistSession(null, null);
            } finally {
                setIsReady(true);
            }
        };

        bootstrap();
    }, [token, persistSession]);

    const login = useCallback(async (credentials) => {
        try {
            const payload = await apiRequest('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: normalizeEmail(credentials?.email),
                    password: credentials?.password || '',
                }),
            });

            const sessionUser = toPublicUser(payload?.user || payload?.data?.user || payload?.data || payload);
            const sessionToken = payload?.token || payload?.data?.token || '';
            persistSession(sessionUser, sessionToken);
            return { ok: true, user: sessionUser };
        } catch (error) {
            return { ok: false, message: error.message || 'Invalid email or password' };
        }
    }, [persistSession]);

    const register = useCallback(async (payload) => {
        try {
            const response = await apiRequest('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: payload?.name?.trim(),
                    email: normalizeEmail(payload?.email),
                    password: payload?.password || '',
                }),
            });

            const sessionUser = toPublicUser(response?.user || response?.data?.user || response?.data || response);
            const sessionToken = response?.token || response?.data?.token || '';
            persistSession(sessionUser, sessionToken);
            return { ok: true, user: sessionUser };
        } catch (error) {
            return { ok: false, message: error.message || 'Registration failed' };
        }
    }, [persistSession]);

    const logout = useCallback(async () => {
        try {
            if (token) {
                await apiRequest('/logout', {
                    method: 'POST',
                }, token);
            }
        } finally {
            localStorage.removeItem('bookmarks');
            localStorage.removeItem('reactions');
            localStorage.removeItem('reactionCounts');
            localStorage.removeItem('userPosts');
            persistSession(null, null);
        }
    }, [token, persistSession]);

    const updateUser = useCallback(async (updatedUser, avatarFile = null) => {
        try {
            let body;
            let headers = {};
            let method = 'PUT';

            if (avatarFile) {
                // Use FormData for file upload
                const formData = new FormData();
                formData.append('_method', 'PUT');
                if (updatedUser?.name) formData.append('name', updatedUser.name);
                if (updatedUser?.email) formData.append('email', normalizeEmail(updatedUser.email));
                if (updatedUser?.password) formData.append('password', updatedUser.password);
                formData.append('avatar', avatarFile);
                body = formData;
                method = 'POST';
            } else {
                // Use JSON for non-file updates
                headers['Content-Type'] = 'application/json';
                body = JSON.stringify({
                    name: updatedUser?.name,
                    email: normalizeEmail(updatedUser?.email),
                    password: updatedUser?.password,
                });
            }

            const response = await apiRequest('/profile', {
                method,
                headers,
                body,
            }, token);

            const sessionUser = toPublicUser(response?.user || response?.data?.user || response?.data || response);
            persistSession(sessionUser, token);
            return { ok: true, user: sessionUser };
        } catch (error) {
            return { ok: false, message: error.message || 'Profile update failed' };
        }
    }, [token, persistSession]);

    // Memoize context value to avoid unnecessary consumer re-renders.
    const value = useMemo(() => ({
        user,
        token,
        isReady,
        login,
        register,
        logout,
        updateUser,
    }), [user, token, isReady, login, register, logout, updateUser]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
