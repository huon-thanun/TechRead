import { Link } from 'react-router-dom';

const CATEGORIES = [
  'All', 'WebDev', 'MobileDev', 'Programming', 'DSA',
  'Database', 'AI', 'ML', 'DevOps', 'Cybersecurity',
  'SoftwareEng', 'TechNews', 'CareerTips'
];

const CATEGORY_ICONS = {
  All: 'bi-funnel', WebDev: 'bi-globe', MobileDev: 'bi-phone',
  Programming: 'bi-code-slash', DSA: 'bi-diagram-3',
  Database: 'bi-database', AI: 'bi-cpu', ML: 'bi-graph-up',
  DevOps: 'bi-gear', Cybersecurity: 'bi-shield-lock',
  SoftwareEng: 'bi-tools', TechNews: 'bi-newspaper', CareerTips: 'bi-briefcase'
};

export default function Sidebar({ selectedCategory, onCategoryChange }) {
  return (
    <aside className="sidebar">
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#dc3545', marginBottom: '0.75rem' }}>Navigation</p>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <Link to="/" className="side-item"><i className="bi bi-house-fill"></i> Home</Link>
          <Link to="/about" className="side-item"><i className="bi bi-layers-fill"></i> About</Link>
          <Link to="/report" className="side-item"><i className="bi bi-mailbox2-flag"></i> Report</Link>
        </nav>
      </div>

      <div>
        <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#dc3545', marginBottom: '0.75rem' }}>Categories</p>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className="side-item"
              style={{
                color: selectedCategory === cat ? 'var(--text)' : undefined,
                background: selectedCategory === cat ? 'rgba(220,53,69,0.15)' : undefined,
                borderLeft: selectedCategory === cat ? '2px solid #dc3545' : '2px solid transparent',
              }}
              onClick={() => onCategoryChange(cat)}
            >
              <i className={`bi ${CATEGORY_ICONS[cat] || 'bi-tag'}`}></i>
              {cat}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}