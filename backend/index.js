const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Simple courses data (we'll move this to a database later)
let courses = [
    { id: 1, name: 'Advanced Web Development', code: 'CSC548', credits: 3, department: 'Computer Science' },
    { id: 2, name: 'Database Systems', code: 'CSC560', credits: 3, department: 'Computer Science' }
];

// API Routes
app.get('/api/courses', (req, res) => {
    res.json(courses);
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        return res.status(404).json({ error: 'Course not found' });
    }
    res.json(course);
});

// Home route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Class-Scheduler API',
        endpoints: ['/api/courses', '/api/courses/:id']
    });
});
// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});