import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function GuestRoute({ children }) {
    const { user } = useAuth();

    if (user) {
        // Already logged in, redirect to home
        return <Navigate to="/" replace />;
    }

    return children;
}
