import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function About() {
  return (
    <>
      <Navbar />
      <main style={{ marginTop: '68px' }}>
        {/* Hero */}
        <section className="hero-about" style={{ padding: '5rem 2rem' }}>
          <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '3rem', letterSpacing: '-0.04em', color: 'var(--text)' }}>
              About <span style={{ color: '#dc3545' }}>TechRead</span>
            </span>
            <p style={{ color: '#c8c4c0', marginTop: '1.5rem', fontSize: '1.05rem', lineHeight: 1.7 }}>
              A social knowledge-sharing platform designed for Computer Science learners and developers.
              Users can publish articles, explore coding tutorials, and discuss modern tech topics.
              Admins manage content to ensure quality and a safe learning environment.
            </p>
          </div>
        </section>

        {/* Mission / Vision / Values */}
        <section style={{ padding: '4rem 2rem' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[
              {
                icon: 'bi-rocket-takeoff',
                title: 'Our Mission',
                text: 'To empower students and developers by sharing high-quality Computer Science articles, tutorials, and real-world experiences.',
              },
              {
                icon: 'bi-eye',
                title: 'Our Vision',
                text: 'To become a trusted knowledge-sharing community like medium.com and dev.to, focused on learning and innovation.',
              },
              {
                icon: 'bi-stars',
                title: 'Our Values',
                items: ['Open Knowledge', 'Community Growth', 'Quality Content'],
              },
            ].map(card => (
              <div key={card.title} className="about-card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.75rem' }}>
                <div style={{ width: '48px', height: '48px', background: 'rgba(220,53,69,0.12)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <i className={`bi ${card.icon}`} style={{ color: '#dc3545', fontSize: '1.4rem' }}></i>
                </div>
                <h5 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#dc3545', marginBottom: '0.75rem' }}>{card.title}</h5>
                {card.text && <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>{card.text}</p>}
                {card.items && (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {card.items.map(item => (
                      <li key={item} style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <i className="bi bi-check-circle-fill" style={{ color: '#dc3545', fontSize: '0.8rem' }}></i>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Developer */}
        <section className="about-join" style={{ padding: '4rem 2rem' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, textAlign: 'center', marginBottom: '2.5rem', color: 'var(--text)' }}>
              Meet the <span style={{ color: '#dc3545' }}>Developer</span>
            </h2>
            <div style={{ background: 'rgba(30,30,30,0.8)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2.5rem', display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <img
                src="https://ui-avatars.com/api/?name=Huon+Thanun&background=dc3545&color=fff&size=160"
                alt="Developer"
                style={{ width: '130px', height: '150px', objectFit: 'cover', borderRadius: '12px', border: '2px solid rgba(220,53,69,0.4)', flexShrink: 0 }}
              />
              <div>
                <h4 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: 'var(--text)', marginBottom: '0.5rem' }}>Huon Thanun</h4>
                <span className="tag-badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>Full-Stack Developer</span>
                <p style={{ color: '#c8c4c0', lineHeight: 1.75, marginBottom: '0.75rem' }}>
                  Hello! I'm a Computer Science student and full-stack developer. I created <strong style={{ color: '#dc3545' }}>TechRead</strong> to provide
                  a space where students and developers can read, write, and share Computer Science knowledge.
                </p>
                <p style={{ color: '#c8c4c0', lineHeight: 1.75, margin: 0 }}>
                  I am passionate about web development and learning new technologies.
                  This project reflects my interest in building practical and meaningful web applications.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}