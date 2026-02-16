import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowRight, ShieldCheck, Zap, Calendar } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="landing-content">
                    <div className="landing-image-container">
                        <div style={{
                            width: '100%',
                            maxWidth: '450px',
                            height: '450px',
                            backgroundColor: 'var(--bg-primary)',
                            borderRadius: '30px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: '0 30px 60px rgba(0,0,0,0.15)'
                        }} className="landing-image">
                            <div style={{
                                position: 'absolute',
                                width: '200px',
                                height: '200px',
                                background: 'var(--accent)',
                                filter: 'blur(80px)',
                                top: '20%',
                                left: '20%',
                                opacity: 0.5
                            }}></div>
                            <GraduationCap size={180} color="white" style={{ position: 'relative', zIndex: 1 }} />

                            <div style={{ position: 'absolute', bottom: '15%', right: '15%', background: 'white', padding: '15px', borderRadius: '15px', boxShadow: 'var(--shadow)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Calendar size={20} color="var(--accent)" />
                                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Planning à jour</span>
                            </div>
                        </div>
                    </div>

                    <div className="landing-text">
                        <div>
                            <h1>Organisez vos études avec MyStudyPlanner</h1>
                            <p>
                                La plateforme simplifiée pour les étudiants en Informatique. Gérez vos TP, projets et révisions en un seul endroit.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ backgroundColor: 'var(--accent)20', color: 'var(--accent)', padding: '6px', borderRadius: '6px' }}>
                                        <Zap size={16} />
                                    </div>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Suivi du statut "En cours"</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ backgroundColor: 'var(--accent)20', color: 'var(--accent)', padding: '6px', borderRadius: '6px' }}>
                                        <ShieldCheck size={16} />
                                    </div>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Organisation par priorité</span>
                                </div>
                            </div>

                            <div className="landing-buttons">
                                <button className="btn-primary" onClick={() => navigate('/login')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '12px 24px' }}>
                                    Se connecter <ArrowRight size={18} />
                                </button>
                                <button className="btn-secondary" onClick={() => navigate('/register')} style={{ padding: '12px 24px' }}>
                                    Créer un compte
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Tout ce dont vous avez besoin</h2>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>Une interface pensée pour la réussite des étudiants en informatique.</p>
                </div>

                <div className="features-grid">
                    <div className="card feature-card">
                        <div className="feature-icon"><Zap size={30} /></div>
                        <h3>Gestion Agile</h3>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Passez vos tâches en "En cours" pour ne jamais perdre le fil de votre progression.</p>
                    </div>
                    <div className="card feature-card">
                        <div className="feature-icon"><Calendar size={30} /></div>
                        <h3>Calendrier d'échéance</h3>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Visualisez vos dates limites d'un coup d'œil et évitez les retards de TP.</p>
                    </div>
                    <div className="card feature-card">
                        <div className="feature-icon"><ShieldCheck size={30} /></div>
                        <h3>Priorisation</h3>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Identifiez les projets critiques grâce au système de priorité intégré.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-section">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            <GraduationCap size={24} color="var(--accent)" />
                            <h3 style={{ color: 'white', margin: 0 }}>MyStudyPlanner</h3>
                        </div>
                        <p>La solution ultime pour l'organisation académique des étudiants passionnés.</p>
                    </div>
                    <div className="footer-section">
                        <h4>Navigation</h4>
                        <p>Accueil</p>
                        <p>Tableau de bord</p>
                        <p>Mes Tâches</p>
                    </div>
                    <div className="footer-section">
                        <h4>Contact</h4>
                        <p>support@mystudyplanner.com</p>
                        <p>L3 Informatique - Projet 2026</p>
                    </div>
                </div>
                <div className="footer-copy">
                    &copy; 2026 MyStudyPlanner. Tous droits réservés.
                </div>
            </footer>
        </div>
    );
};

export default Home;
