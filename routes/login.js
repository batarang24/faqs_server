const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db'); // MySQL connection
require('dotenv').config();

// Login Route
router.post('/login', async (req, res) => {
    const { identifier, password } = req.body; // identifier = uid OR email
    console.log(password);
    if (!identifier || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Check if user exists (search by UID or Email)
        const [user] = await db.promise().query(
            'SELECT * FROM users WHERE uid = ? OR email = ?',
            [identifier, identifier]
        );

        if (user.length === 0) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const foundUser = user[0];

        // Verify password
        const isMatch = await bcrypt.compare(password, foundUser.password);
        console.log(foundUser.password);
        console.log("Ismatch",isMatch)
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { uid: foundUser.uid, email: foundUser.email }, // Payload
            process.env.JWT_SECRET, // Secret key
            { expiresIn: '7d' } // Token expiration
        );

        res.status(200).json({ uid:foundUser.uid,name:foundUser.name,email:foundUser.email, token,password:foundUser.password });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
