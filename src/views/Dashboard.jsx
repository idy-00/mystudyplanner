import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { taskService } from '../services/api';
import { CheckCircle, Clock, ListTodo, AlertTriangle, CalendarX, Circle, Check } from 'lucide-react';

const Dashboard = () => {
    const location = useLocation();
    const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0, highPriority: 0, overdue: 0 });
    const [recentTasks, setRecentTasks] = useState([]);
    const [badge, setBadge] = useState(null);

    useEffect(() => {
        fetchData();
        if (location.state?.successMessage) {
            setBadge(location.state.successMessage);
            const timer = setTimeout(() => {
                setBadge(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [location.state]);

    const fetchData = async () => {
        try {
            const response = await taskService.getAll();
            const tasks = response.data;
            const isOverdue = (dueDate, status) => {
                if (!dueDate || status === 'done') return false;
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const taskDate = new Date(dueDate);
                return taskDate < today;
            };

            setStats({
                total: tasks.length,
                pending: tasks.filter(t => t.status === 'todo').length,
                inProgress: tasks.filter(t => t.status === 'in_progress').length,
                completed: tasks.filter(t => t.status === 'done').length,
                highPriority: tasks.filter(t => t.priority === 'high' && t.status !== 'done').length,
                overdue: tasks.filter(t => isOverdue(t.dueDate, t.status)).length
            });
            setRecentTasks(tasks.slice(-3).reverse());
        } catch (error) {
            console.error("Error fetching stats", error);
        }
    };

    const StatusCard = ({ title, value, icon, color }) => (
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ backgroundColor: `${color}15`, color: color, padding: '12px', borderRadius: '12px' }}>
                {icon}
            </div>
            <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '2px' }}>{title}</p>
                <h3 style={{ margin: 0 }}>{value}</h3>
            </div>
        </div>
    );

    return (
        <div style={{ position: 'relative' }}>
            {badge && (
                <div className="success-badge">
                    <Check size={16} />
                    <span>{badge}</span>
                </div>
            )}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ marginBottom: '0.5rem' }}>Tableau de bord</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Voici un aperçu global de vos devoirs et projets.</p>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '3rem' }}>
                <StatusCard title="Total Tâches" value={stats.total} icon={<ListTodo />} color="var(--bg-primary)" />
                <StatusCard title="À faire" value={stats.pending} icon={<Circle />} color="var(--text-secondary)" />
                <StatusCard title="En cours" value={stats.inProgress || 0} icon={<Clock />} color="#f57c00" />
                <StatusCard title="Terminées" value={stats.completed} icon={<CheckCircle />} color="var(--accent)" />
                <StatusCard title="Priorité Haute" value={stats.highPriority} icon={<AlertTriangle />} color="var(--danger)" />
                <StatusCard title="En retard" value={stats.overdue} icon={<CalendarX />} color="var(--danger)" />
            </div>

            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem' }}>Récemment ajoutés</h3>
                    {recentTasks.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {recentTasks.map(task => (
                                <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid #f0f0f0' }}>
                                    <div>
                                        <p style={{ fontWeight: 600, margin: 0 }}>{task.title}</p>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{task.subject}</span>
                                    </div>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        padding: '2px 8px',
                                        borderRadius: '10px',
                                        backgroundColor: task.status === 'done' ? 'var(--accent)20' : '#f57c0020',
                                        color: task.status === 'done' ? 'var(--accent)' : '#f57c00'
                                    }}>
                                        {task.status === 'done' ? 'Terminé' : 'En cours'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>Aucune tâche trouvée.</p>
                    )}
                </div>

                <div className="card" style={{ backgroundColor: 'var(--bg-primary)', color: 'white' }}>
                    <h3 style={{ color: 'white', marginBottom: '1rem' }}>MyStudyPlanner Tips</h3>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', opacity: 0.9 }}>
                        <li>💡 Ordonnez vos tâches par priorité pour rester efficace.</li>
                        <li>📅 Vérifiez régulièrement vos dates d'échéance.</li>
                        <li>✅ Marquez une tâche comme terminée dès qu'elle est prête !</li>
                    </ul>
                    <button className="btn-primary" style={{ marginTop: '2rem', width: '100%' }} onClick={() => window.location.href = '/tasks'}>
                        Gérer mes tâches
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
