const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Change as needed
    password: '1234', // Change as needed
    database: 'faqs'
});

db.connect(err => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

module.exports = db;
