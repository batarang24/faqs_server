const express = require('express');
const router = express.Router();
const db = require('../db'); // Import the database connection
const bcrypt = require('bcryptjs');
router.post('/updatepass', async (req, res) => {
    const {password,email} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {

        // 🔹 Insert Answer into Database
        const [result] = await db.promise().query(
            `UPDATE users SET password = ? WHERE email = ?`,
            [hashedPassword,email]
        );
        
        // ✅ Success Response
        res.status(200).json({ 
            message: 'Updated', 
        });

    } catch (error) {
        console.error('Error posting answer:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
