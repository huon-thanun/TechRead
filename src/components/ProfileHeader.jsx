/**
 * ProfileHeader — shared header card for Profile and UserProfile pages.
 *
 * Props:
 *  avatar        — image URL
 *  name          — display name
 *  email         — shown only for own profile
 *  stats         — [{ label, value }]
 *  onAvatarClick — if provided, avatar becomes clickable (own profile)
 *  actions       — JSX rendered in the top-right corner (e.g. edit form toggle, logout)
 *  editForm      — JSX rendered below the header row (edit fields)
 */
export default function ProfileHeader({ avatar, name, email, stats = [], onAvatarClick, actions, editForm }) {
  const avatarSrc = avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=dc3545&color=fff`;

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '16px',
      overflow: 'hidden',
      marginBottom: '2rem',
    }}>
      {/* Banner */}
      <div style={{
        height: '90px',
        background: 'linear-gradient(135deg, #1a0a0b 0%, #2d0d10 40%, #1a0a0b 100%)',
        borderBottom: '1px solid rgba(220,53,69,0.2)',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(220,53,69,0.15) 0%, transparent 60%), radial-gradient(circle at 80% 50%, rgba(220,53,69,0.08) 0%, transparent 60%)',
        }} />
      </div>

      <div style={{ padding: '0 2rem 1.75rem' }}>
        {/* Avatar row */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ position: 'relative', marginTop: '-40px' }}>
            <img
              src={avatarSrc}
              alt={name}
              onClick={onAvatarClick}
              style={{
                width: '80px', height: '80px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid var(--surface)',
                outline: '3px solid #dc3545',
                cursor: onAvatarClick ? 'pointer' : 'default',
                display: 'block',
                transition: 'opacity 0.2s',
              }}
              onMouseOver={e => { if (onAvatarClick) e.currentTarget.style.opacity = '0.85'; }}
              onMouseOut={e => e.currentTarget.style.opacity = '1'}
            />
            {onAvatarClick && (
              <div style={{
                position: 'absolute', bottom: 2, right: 2,
                background: '#dc3545', borderRadius: '50%',
                width: '20px', height: '20px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid var(--surface)',
              }}>
                <i className="bi bi-camera-fill" style={{ fontSize: '0.55rem', color: '#fff' }}></i>
              </div>
            )}
          </div>

          {/* Action buttons slot */}
          {actions && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              {actions}
            </div>
          )}
        </div>

        {/* Name + email */}
        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, margin: '0 0 0.2rem', color: '#f0ece8', fontSize: '1.4rem' }}>
            {name}
          </h3>
          {email && (
            <p style={{ color: '#9a9a9a', margin: 0, fontSize: '0.875rem' }}>
              <i className="bi bi-envelope me-2" style={{ color: '#dc3545' }}></i>{email}
            </p>
          )}
          {!email && (
            <p style={{ color: '#9a9a9a', margin: 0, fontSize: '0.875rem' }}>
              <i className="bi bi-person me-2" style={{ color: '#dc3545' }}></i>TechRead Author
            </p>
          )}
        </div>

        {/* Stats row */}
        {stats.length > 0 && (
          <div style={{ display: 'flex', gap: '0', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(220,53,69,0.15)', width: 'fit-content' }}>
            {stats.map((stat, i) => (
              <div
                key={i}
                style={{
                  padding: '0.65rem 1.5rem',
                  textAlign: 'center',
                  borderRight: i < stats.length - 1 ? '1px solid rgba(220,53,69,0.15)' : 'none',
                  background: 'rgba(220,53,69,0.04)',
                }}
              >
                <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.3rem', color: '#dc3545', margin: 0, lineHeight: 1 }}>
                  {stat.value}
                </p>
                <p style={{ color: '#9a9a9a', fontSize: '0.72rem', margin: '0.2rem 0 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Edit form slot */}
        {editForm && (
          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
            {editForm}
          </div>
        )}
      </div>
    </div>
  );
}