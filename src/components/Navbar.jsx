import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=User&background=dc3545&color=fff';

export default function Navbar({ onSearch }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div
      className="navbar-header container-fluid px-4 position-fixed top-0 z-3"
      style={{ height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
    >
      {/* Logo + Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#dc3545', letterSpacing: '-0.03em' }}>
            Tech<span style={{ color: '#f0ece8' }}>Read</span>
          </span>
        </Link>

        <div style={{ position: 'relative', minWidth: '250px', borderRadius: '50px' }}>
          <span className="search-icon" style={{ position: 'absolute', padding: '0.45rem 1rem', color: '#dc3545', background: 'transparent', display: 'flex', alignItems: 'center', borderRadius: '50px 0 0 50px' }}>
            <i className="bi bi-search-heart"></i>
          </span>
          <input
            className='search-input w-100'
            type="search"
            placeholder="Search posts..."
            onChange={e => onSearch && onSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', padding: '0.45rem 0.75rem 0.45rem 2.5rem', background: 'transparent', borderRadius: '50px' }}
          />
        </div>
      </div>

      {/* Marquee */}
      {/* <div style={{ flex: 1, maxWidth: '360px', overflow: 'hidden', margin: '0 1rem' }}>
        <div className="marquee-wrap">
          <span className="marquee-inner">
            <strong style={{ color: '#dc3545' }}>TechRead</strong> — A social knowledge-sharing platform for CS learners and developers. Publish articles, explore tutorials, and discuss modern tech.
          </span>
        </div>
      </div> */}

      {/* Right: Auth or User buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {user ? (
          <>
            <Link to="/create-post" className="btn btn-danger rounded-5" style={{ fontSize: '0.85rem' }}>
              <i className="bi bi-pencil-square me-2"></i>Create post
            </Link>
            <button className="btn" style={{ color: '#dc3545', padding: '0.25rem' }}>
              <i className="bi bi-bell-fill" style={{ fontSize: '1.2rem' }}></i>
            </button>
            <button
              className="btn p-0 border-0"
              onClick={() => navigate('/profile')}
              style={{ background: 'transparent' }}
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
            <Link to="/login" className="btn btn-outline-danger rounded-5" style={{ fontSize: '0.85rem' }}>
              <i className="bi bi-box-arrow-in-right me-2"></i>Sign In
            </Link>
            <Link to="/register" className="btn btn-danger rounded-5" style={{ fontSize: '0.85rem' }}>
              <i className="bi bi-person-plus me-2"></i>Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
}