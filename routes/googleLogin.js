const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db'); // MySQL connection
const generateRandomPassword = require('../getrandom');
require('dotenv').config();

// Login Route
router.post('/google-login', async (req, res) => {
    const { uid, name, email, photo } = req.body;
    console.log(req.body)
    if (!uid || !email) return res.status(400).json({ error: "Invalid data" });

    try {
        console.log('i am inside')
        // Check if the user already exists
        const [existingUser] = await db.promise().query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        //const [existingUser] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
        //console.log(existingUser)
        if (existingUser.length === 0) {
            // Insert new u ser
            const pass=generateRandomPassword();
            await db.promise().query(
                'INSERT INTO users (uid, name, email, photo,password) VALUES (?, ?, ?, ?,?)',
                [uid, name, email, photo,pass]
            );
            res.status(200).json({ uid:uid,name:name,email:email,photo:photo});
        }
        else
        {
            const foundUser=existingUser;
            console.log(existingUser);
            res.status(200).json({ uid:uid,name:foundUser.name,email:foundUser.email });
        }

       // res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
