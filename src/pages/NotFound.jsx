import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function NotFound() {
    return (
        <>
            <Navbar />
            <main style={{ marginTop: '68px', minHeight: 'calc(100vh - 68px)' }}>
                <section style={{ padding: '5rem 1.5rem' }}>
                    <div
                        style={{
                            maxWidth: '760px',
                            margin: '0 auto',
                            textAlign: 'center',
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            borderRadius: '16px',
                            padding: '3rem 2rem',
                        }}
                    >
                        <p
                            style={{
                                fontFamily: 'Syne, sans-serif',
                                fontWeight: 800,
                                fontSize: '4rem',
                                letterSpacing: '-0.04em',
                                color: '#dc3545',
                                margin: 0,
                                lineHeight: 1,
                            }}
                        >
                            404
                        </p>
                        <h1
                            style={{
                                fontFamily: 'Syne, sans-serif',
                                fontWeight: 700,
                                color: 'var(--text)',
                                marginTop: '1rem',
                                marginBottom: '0.75rem',
                            }}
                        >
                            Page Not Found
                        </h1>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
                            The page you are looking for does not exist or may have been moved.
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                            <Link
                                to="/"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    background: '#dc3545',
                                    color: '#fff',
                                    padding: '0.65rem 1rem',
                                    borderRadius: '10px',
                                    textDecoration: 'none',
                                    fontWeight: 600,
                                }}
                            >
                                <i className="bi bi-house-door"></i>
                                Back Home
                            </Link>
                            <Link
                                to="/about"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    border: '1px solid var(--border)',
                                    color: 'var(--text)',
                                    padding: '0.65rem 1rem',
                                    borderRadius: '10px',
                                    textDecoration: 'none',
                                    fontWeight: 600,
                                }}
                            >
                                <i className="bi bi-info-circle"></i>
                                About TechRead
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
