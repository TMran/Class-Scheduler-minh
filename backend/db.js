const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Path to database file
const dbPath = process.env.NODE_ENV === 'production' 
    ? path.join(__dirname, 'Database/Scheduler.db')
    : path.join(__dirname, '../Database/Scheduler.db');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
        console.error('Database path:', dbPath);
    } else {
        console.log('Connected to SQLite database');
        console.log('Database path:', dbPath);
    }
});

// Helper function to run queries with promises
const query = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

// Helper function for single row queries
const queryOne = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

module.exports = { db, query, queryOne };
