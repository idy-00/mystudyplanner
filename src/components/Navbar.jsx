import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, CheckSquare, LogOut, GraduationCap } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { label: 'Tableau de bord', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { label: 'Mes Tâches', path: '/tasks', icon: <CheckSquare size={20} /> },
    ];

    return (
        <nav style={{
            backgroundColor: 'var(--bg-primary)',
            color: 'white',
            padding: '1rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <GraduationCap size={28} />
                <h2 style={{ color: 'white', margin: 0 }}>MyStudyPlanner</h2>
            </div>

            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                {navItems.map(item => (
                    <Link
                        key={item.path}
                        to={item.path}
                        style={{
                            color: location.pathname === item.path ? 'var(--accent)' : 'white',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontWeight: 500
                        }}
                    >
                        {item.icon}
                        {item.label}
                    </Link>
                ))}

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem', borderLeft: '1px solid #444', paddingLeft: '1rem' }}>
                    <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>{user?.name}</span>
                    <button
                        onClick={handleLogout}
                        style={{
                            background: 'transparent',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '5px 10px',
                            borderRadius: '4px',
                            border: '1px solid rgba(255,255,255,0.2)'
                        }}
                    >
                        <LogOut size={18} />
                        Quitter
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
