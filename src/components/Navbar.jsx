import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import logoImage from '../assets/images/logo/logo.png';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=User&background=dc3545&color=fff';

export default function Navbar({ onSearch }) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="navbar-header container-fluid px-3 px-md-4 position-fixed top-0 z-3">
      <div className="navbar-left-cluster">
        <Link to="/" className="navbar-brand-link">
          <img src={logoImage} alt="TechRead" className="navbar-logo" />
        </Link>

        <div className="navbar-search-wrap">
          <span className="search-icon navbar-search-icon">
            <i className="bi bi-search-heart"></i>
          </span>
          <input
            className="search-input w-100"
            type="search"
            placeholder={onSearch ? 'Search posts...' : 'Search unavailable on this page'}
            onChange={e => onSearch && onSearch(e.target.value)}
            disabled={!onSearch}
          />
        </div>
      </div>

      <div className="navbar-right-cluster">
        <button
          type="button"
          className="btn navbar-icon-btn"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          <i className={`bi ${theme === 'dark' ? 'bi-sun-fill' : 'bi-moon-stars-fill'}`}></i>
        </button>

        {user ? (
          <>
            <Link to="/create-post" className="btn btn-danger rounded-5 navbar-create-btn">
              <i className="bi bi-pencil-square me-2"></i>Create post
            </Link>

            <button
              className="btn p-0 border-0 navbar-avatar-btn"
              onClick={() => navigate('/profile')}
            >
              <img
                src={user.avatar || DEFAULT_AVATAR}
                className="avatar-circle"
                style={{ border: '2px solid #dc3545' }}
                alt="avatar"
              />
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline-danger rounded-5 navbar-auth-btn">
              <i className="bi bi-box-arrow-in-right me-2"></i>Sign In
            </Link>
            <Link to="/register" className="btn btn-danger rounded-5 navbar-auth-btn">
              <i className="bi bi-person-plus me-2"></i>Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}