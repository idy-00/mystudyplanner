import React, { useState, useEffect } from 'react';
import { taskService, subjectService } from '../services/api';
import { Plus, Search, Filter, Trash2, Edit2, CheckCircle2, Circle } from 'lucide-react';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterSubject, setFilterSubject] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Form and Modal state
    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        subject: '',
        priority: 'medium',
        dueDate: '',
        status: 'todo'
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [tasksRes, subRes] = await Promise.all([
                taskService.getAll(),
                subjectService.getAll()
            ]);
            setTasks(tasksRes.data);
            setSubjects(subRes.data);
        } catch (error) {
            console.error("Error loading tasks", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (task) => {
        const newStatus = task.status === 'done' ? 'todo' : 'done';
        try {
            await taskService.update(task.id, { status: newStatus });
            setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
        } catch (error) {
            console.error("Error updating status", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer cette tâche ?')) {
            try {
                await taskService.delete(id);
                setTasks(tasks.filter(t => t.id !== id));
            } catch (error) {
                console.error("Error deleting task", error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingTask) {
                const res = await taskService.update(editingTask.id, formData);
                setTasks(tasks.map(t => t.id === editingTask.id ? res.data : t));
            } else {
                const res = await taskService.create(formData);
                setTasks([...tasks, res.data]);
            }
            closeForm();
        } catch (error) {
            console.error("Error saving task", error);
        }
    };

    const openForm = (task = null) => {
        if (task) {
            setEditingTask(task);
            setFormData(task);
        } else {
            setEditingTask(null);
            setFormData({
                title: '',
                description: '',
                subject: subjects[0] || '',
                priority: 'medium',
                dueDate: '',
                status: 'todo'
            });
        }
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingTask(null);
    };

    const isOverdue = (dueDate, status) => {
        if (!dueDate || status === 'done') return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const taskDate = new Date(dueDate);
        return taskDate < today;
    };

    const filteredTasks = tasks.filter(task => {
        const matchesSubject = filterSubject === 'all' || task.subject === filterSubject;
        const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSubject && matchesStatus && matchesSearch;
    });

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1>Mes Tâches</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Gérez vos devoirs et projets.</p>
                </div>
                <button className="btn-primary" onClick={() => openForm()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={20} /> Nouvelle Tâche
                </button>
            </div>

            {/* Filters */}
            <div className="card" style={{ marginBottom: '2rem', padding: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#f8f9fa', padding: '0 10px', borderRadius: 'var(--border-radius)', border: '1px solid var(--border)' }}>
                        <Search size={18} color="var(--text-secondary)" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ border: 'none', margin: 0, background: 'transparent', outline: 'none' }}
                        />
                    </div>

                    <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)} style={{ width: 'auto', margin: 0 }}>
                        <option value="all">Toutes les matières</option>
                        {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>

                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ width: 'auto', margin: 0 }}>
                        <option value="all">Tous les états</option>
                        <option value="todo">À faire / En cours</option>
                        <option value="done">Terminé</option>
                    </select>
                </div>
            </div>

            {/* Task List */}
            {loading ? (
                <p>Chargement des tâches...</p>
            ) : filteredTasks.length > 0 ? (
                <div className="grid">
                    {filteredTasks.map(task => (
                        <div key={task.id} className="card" style={{
                            borderLeft: `5px solid ${task.priority === 'high' ? 'var(--danger)' : task.priority === 'medium' ? 'orange' : 'var(--accent)'}`,
                            opacity: task.status === 'done' ? 0.7 : 1
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                                    {task.subject}
                                </span>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => openForm(task)} style={{ color: 'var(--text-secondary)', background: 'none' }}><Edit2 size={16} /></button>
                                    <button onClick={() => handleDelete(task.id)} style={{ color: 'var(--danger)', background: 'none' }}><Trash2 size={16} /></button>
                                </div>
                            </div>

                            <h3 style={{ marginBottom: '0.5rem', textDecoration: task.status === 'done' ? 'line-through' : 'none' }}>{task.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', minHeight: '3rem' }}>{task.description}</p>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{
                                    fontSize: '0.8rem',
                                    color: isOverdue(task.dueDate, task.status) ? 'var(--danger)' : 'var(--text-secondary)',
                                    fontWeight: isOverdue(task.dueDate, task.status) ? 700 : 400,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    Echéance: {task.dueDate || 'N/A'}
                                    {isOverdue(task.dueDate, task.status) && (
                                        <span style={{
                                            backgroundColor: 'var(--danger)',
                                            color: 'white',
                                            padding: '2px 6px',
                                            borderRadius: '4px',
                                            fontSize: '0.65rem'
                                        }}>
                                            RETARD
                                        </span>
                                    )}
                                </span>
                                <button
                                    onClick={() => handleToggleStatus(task)}
                                    style={{
                                        backgroundColor: 'transparent',
                                        color: task.status === 'done' ? 'var(--accent)' : 'var(--text-secondary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.4rem',
                                        fontSize: '0.9rem',
                                        fontWeight: 600
                                    }}
                                >
                                    {task.status === 'done' ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                                    {task.status === 'done' ? 'Terminé' : 'Marquer prêt'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>Aucune tâche ne correspond à vos critères.</p>
                </div>
            )}

            {/* Modal Form */}
            {showForm && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 2000
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>{editingTask ? 'Modifier la tâche' : 'Nouvelle Tâche'}</h2>
                        <form onSubmit={handleSubmit}>
                            <label>Titre</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />

                            <label>Description</label>
                            <textarea
                                rows="3"
                                style={{ width: '100%', padding: '10px', borderRadius: 'var(--border-radius)', border: '1px solid var(--border)', marginBottom: '1rem' }}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            ></textarea>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label>Matière</label>
                                    <select value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })}>
                                        {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label>Priorité</label>
                                    <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })}>
                                        <option value="low">Basse</option>
                                        <option value="medium">Moyenne</option>
                                        <option value="high">Haute</option>
                                    </select>
                                </div>
                            </div>

                            <label>Date d'échéance</label>
                            <input
                                type="date"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            />

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={closeForm} style={{ flex: 1, padding: '10px', borderRadius: 'var(--border-radius)', border: '1px solid var(--border)', background: 'white' }}>Annuler</button>
                                <button type="submit" className="btn-primary" style={{ flex: 1 }}>{editingTask ? 'Mettre à jour' : 'Ajouter'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tasks;
