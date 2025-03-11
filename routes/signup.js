const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db'); // Import MySQL connection
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Signup Route
router.post('/signup', async (req, res) => {
    const { uid, name, email, password } = req.body;

    if (!uid || !name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Check if UID or Email already exists
        const [existingUser] = await db.promise().query(
            'SELECT * FROM users WHERE uid = ? OR email = ?',
            [uid, email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'User ID or Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into database
        await db.promise().query(
            'INSERT INTO users (uid, name, email, password) VALUES (?, ?, ?, ?)',
            [uid, name, email, hashedPassword]
        );

        const token = jwt.sign(
                    { uid: uid, email:email }, // Payload
                    process.env.JWT_SECRET, // Secret key
                    { expiresIn: '7d' } // Token expiration
        );
        
        res.status(200).json({ uid:uid,name:name,email:email, token,password:password });
        //res.json({ message: 'User registered successfully' , token});

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
