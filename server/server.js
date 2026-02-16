const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const DB_PATH = path.join(__dirname, 'data', 'db.json');

app.use(cors());
app.use(bodyParser.json());

// Helper function to read/write DB
const readDB = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
const writeDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// Auth Simulation
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const { users } = readDB();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        const { password, ...userWithoutPassword } = user;
        res.json({ success: true, user: userWithoutPassword });
    } else {
        res.status(401).json({ success: false, message: 'Identifiants incorrects' });
    }
});

// Tasks CRUD
app.get('/api/tasks', (req, res) => {
    const { tasks } = readDB();
    res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
    const db = readDB();
    const newTask = { ...req.body, id: Date.now() };
    db.tasks.push(newTask);
    writeDB(db);
    res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
    const db = readDB();
    const index = db.tasks.findIndex(t => t.id == req.params.id);
    if (index !== -1) {
        db.tasks[index] = { ...db.tasks[index], ...req.body };
        writeDB(db);
        res.json(db.tasks[index]);
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
});

app.delete('/api/tasks/:id', (req, res) => {
    const db = readDB();
    db.tasks = db.tasks.filter(t => t.id != req.params.id);
    writeDB(db);
    res.status(204).send();
});

// Subjects
app.get('/api/subjects', (req, res) => {
    const { subjects } = readDB();
    res.json(subjects);
});

app.post('/api/subjects', (req, res) => {
    const db = readDB();
    const { name } = req.body;
    if (name && !db.subjects.includes(name)) {
        db.subjects.push(name);
        writeDB(db);
        res.status(201).json(name);
    } else {
        res.status(400).json({ message: 'Subject already exists or name missing' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
