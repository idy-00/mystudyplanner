import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

export const taskService = {
    getAll: () => api.get('/tasks'),
    create: (task) => api.post('/tasks', task),
    update: (id, task) => api.put(`/tasks/${id}`, task),
    delete: (id) => api.delete(`/tasks/${id}`),
};

export const subjectService = {
    getAll: () => api.get('/subjects'),
};

export default api;
