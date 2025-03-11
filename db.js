const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'faqs_user', // Change as needed
    password: 'chandiran5', // Change as needed
    database: 'faqs',
    port:3306
});

db.connect(err => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

module.exports = db;
