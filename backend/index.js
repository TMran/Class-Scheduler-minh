const express = require('express');
const cors = require('cors');
const { query, queryOne } = require('./db');
const app = express();
const { generateSchedule } = require('./scheduleGenerator');

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// ==========================================
// API ROUTES
// ==========================================

// Get all departments
app.get('/api/departments', async (req, res) => {
    try {
        const departments = await query('SELECT * FROM departments ORDER BY name');
        res.json(departments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all majors
app.get('/api/majors', async (req, res) => {
    try {
        const majors = await query(`
            SELECT m.*, d.name as department_name 
            FROM majors m
            JOIN departments d ON m.department_id = d.id
            WHERE m.is_active = 1
            ORDER BY m.name
        `);
        res.json(majors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get courses for a specific major
app.get('/api/majors/:id/courses', async (req, res) => {
    try {
        const courses = await query(`
            SELECT c.*, mr.requirement_type, mr.is_required,
                   d.name as department_name, d.code as department_code
            FROM courses c
            JOIN major_requirements mr ON c.id = mr.course_id
            JOIN departments d ON c.department_id = d.id
            WHERE mr.major_id = ?
            ORDER BY c.course_code, c.course_number
        `, [req.params.id]);
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all courses
app.get('/api/courses', async (req, res) => {
    try {
        const courses = await query(`
            SELECT c.*, d.name as department_name, d.code as department_code
            FROM courses c
            JOIN departments d ON c.department_id = d.id
            ORDER BY c.course_code, c.course_number
        `);
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Search courses for electives
app.get('/api/courses/search', async (req, res) => {
    try {
        const { q, department } = req.query;
        let sql = `
            SELECT c.*, d.name as department_name, d.code as department_code
            FROM courses c
            JOIN departments d ON c.department_id = d.id
            WHERE 1=1
        `;
        const params = [];
        
        if (department) {
            sql += ` AND c.course_code = ?`;
            params.push(department);
        }
        
        if (q) {
            sql += ` AND (c.title LIKE ? OR c.course_code LIKE ? OR c.course_number LIKE ? OR c.description LIKE ?)`;
            const searchTerm = `%${q}%`;
            params.push(searchTerm, searchTerm, searchTerm, searchTerm);
        }
        
        sql += ` ORDER BY c.course_code, c.course_number LIMIT 50`;
        
        const courses = await query(sql, params);
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get course sections with meeting times for a specific term
app.get('/api/sections', async (req, res) => {
    const termId = req.query.term_id || 2; // Default to Spring 2025
    try {
        const sections = await query(`
            SELECT 
                cs.*,
                c.course_code,
                c.course_number,
                c.title as course_title,
                c.description as course_description,
                c.prerequisites,
                i.first_name || ' ' || i.last_name as instructor_name,
                b.name as building_name,
                r.room_number,
                GROUP_CONCAT(mt.day_of_week || '|' || mt.start_time || '|' || mt.end_time, ';') as meeting_times
            FROM course_sections cs
            JOIN courses c ON cs.course_id = c.id
            LEFT JOIN instructors i ON cs.instructor_id = i.id
            LEFT JOIN rooms r ON cs.room_id = r.id
            LEFT JOIN buildings b ON r.building_id = b.id
            LEFT JOIN meeting_times mt ON cs.id = mt.section_id
            WHERE cs.term_id = ?
            GROUP BY cs.id
            ORDER BY c.course_code, c.course_number, cs.section_number
        `, [termId]);
        
        // Parse meeting times into array
        const parsedSections = sections.map(section => ({
            ...section,
            meeting_times: section.meeting_times ? section.meeting_times.split(';').map(mt => {
                const [day, start, end] = mt.split('|');
                return { day_of_week: day, start_time: start, end_time: end };
            }) : []
        }));
        
        res.json(parsedSections);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Magis Core categories
app.get('/api/magis-core/categories', async (req, res) => {
    try {
        const categories = await query(`
            SELECT * FROM magis_core_categories
            WHERE is_active = 1
            ORDER BY name
        `);
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get courses for a Magis Core category
app.get('/api/magis-core/:categoryId/courses', async (req, res) => {
    try {
        const courses = await query(`
            SELECT c.*, d.name as department_name, d.code as department_code
            FROM courses c
            JOIN magis_core_requirements mcr ON c.id = mcr.course_id
            JOIN departments d ON c.department_id = d.id
            WHERE mcr.category_id = ?
            ORDER BY c.course_code, c.course_number
        `, [req.params.categoryId]);
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get active terms
app.get('/api/terms', async (req, res) => {
    try {
        const terms = await query(`
            SELECT * FROM terms
            WHERE is_active = 1
            ORDER BY start_date DESC
        `);
        res.json(terms);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Generate schedule based on preferences
app.post('/api/generate-schedule', async (req, res) => {
    try {
        const preferences = req.body;
        const schedule = await generateSchedule(preferences);
        res.json(schedule);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
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