import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const AuthContext = createContext(null);
const USER_KEY = 'user';
const USERS_KEY = 'users';

const normalizeEmail = (email = '') => email.trim().toLowerCase();

const toPublicUser = (account) => ({
    id: account.id,
    name: account.name,
    email: account.email,
    avatar: account.avatar,
});

const readStoredUsers = () => {
    const stored = localStorage.getItem(USERS_KEY);
    if (!stored) return [];

    try {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

export function AuthProvider({ children }) {
    const [users, setUsers] = useState(readStoredUsers);
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem(USER_KEY);
        return stored ? JSON.parse(stored) : null;
    });

    const persistUsers = useCallback((nextUsers) => {
        localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers));
        setUsers(nextUsers);
    }, []);

    const login = useCallback((credentials) => {
        const email = normalizeEmail(credentials?.email);
        const password = credentials?.password || '';

        const account = users.find((u) => normalizeEmail(u.email) === email && u.password === password);
        if (!account) {
            return { ok: false, message: 'Invalid email or password' };
        }

        const sessionUser = toPublicUser(account);
        localStorage.setItem(USER_KEY, JSON.stringify(sessionUser));
        setUser(sessionUser);
        return { ok: true, user: sessionUser };
    }, [users]);

    const register = useCallback((payload) => {
        const name = payload?.name?.trim();
        const email = normalizeEmail(payload?.email);
        const password = payload?.password || '';

        if (!name || !email || !password) {
            return { ok: false, message: 'All fields are required' };
        }

        const exists = users.some((u) => normalizeEmail(u.email) === email);
        if (exists) {
            return { ok: false, message: 'Email already exists. Please login instead.' };
        }

        const account = {
            id: Date.now(),
            name,
            email,
            password,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=dc3545&color=fff`,
        };

        const nextUsers = [...users, account];
        persistUsers(nextUsers);

        const sessionUser = toPublicUser(account);
        localStorage.setItem(USER_KEY, JSON.stringify(sessionUser));
        setUser(sessionUser);

        return { ok: true, user: sessionUser };
    }, [users, persistUsers]);

    const logout = useCallback(() => {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem('bookmarks');
        setUser(null);
    }, []);

    const updateUser = useCallback((updatedUser) => {
        localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
        setUser(updatedUser);

        const nextUsers = users.map((account) => {
            if (account.id !== updatedUser.id) return account;
            return {
                ...account,
                name: updatedUser.name,
                email: updatedUser.email,
                avatar: updatedUser.avatar,
            };
        });

        persistUsers(nextUsers);
    }, [users, persistUsers]);

    // Memoize context value to avoid unnecessary consumer re-renders.
    const value = useMemo(() => ({
        user,
        users,
        login,
        register,
        logout,
        updateUser,
    }), [user, users, login, register, logout, updateUser]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
